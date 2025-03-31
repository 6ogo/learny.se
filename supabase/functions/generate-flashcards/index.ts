
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

// Use environment variables for sensitive data
const GROQ_API_KEY = Deno.env.get('GROQ_API_KEY') || '';
const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { topic, category, difficulty, count = 10 } = await req.json();
    
    if (!topic || !category || !difficulty) {
      throw new Error('Missing required fields: topic, category, or difficulty');
    }

    // Get the user ID from the request
    const authHeader = req.headers.get('Authorization') || '';
    const token = authHeader.replace('Bearer ', '');
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    if (userError || !user) {
      throw new Error('Unauthorized: ' + (userError?.message || 'User not found'));
    }

    // Check user's subscription tier to ensure they have access to AI features
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('subscription_tier, daily_usage')
      .eq('id', user.id)
      .single();

    if (profileError) {
      throw new Error('Error fetching user profile: ' + profileError.message);
    }

    // Only allow AI generation for 'super' tier users
    if (profile.subscription_tier !== 'super') {
      throw new Error('AI flashcard generation requires Super Learner subscription');
    }

    // Increment daily usage
    await supabase
      .from('user_profiles')
      .update({ daily_usage: profile.daily_usage + 1 })
      .eq('id', user.id);

    // Create the GROQ API request
    const prompt = `
      Generate ${count} flashcards about ${topic} in the ${category} category with ${difficulty} difficulty level.
      Each flashcard should have a question and answer.
      The format should be a valid JSON array with objects containing 'question' and 'answer' keys.
      Make the questions challenging but clear, and provide comprehensive answers for ${difficulty} level.
    `;

    console.log('Sending request to GROQ API...');
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama3-70b-8192', // Using a large model for better quality
        messages: [
          {
            role: 'system',
            content: 'You are an expert in creating educational flashcards. Your task is to generate accurate, concise, and educational flashcards in the requested format.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('GROQ API error:', errorText);
      throw new Error('Error calling GROQ API: ' + response.status);
    }

    const data = await response.json();
    console.log('Received response from GROQ API');

    // Extract flashcards from the response
    try {
      let flashcardsText = data.choices[0].message.content;
      
      // Clean up the response to ensure it's valid JSON
      flashcardsText = flashcardsText.replace(/```json/g, '').replace(/```/g, '');
      const jsonStart = flashcardsText.indexOf('[');
      const jsonEnd = flashcardsText.lastIndexOf(']') + 1;
      
      if (jsonStart >= 0 && jsonEnd > jsonStart) {
        flashcardsText = flashcardsText.substring(jsonStart, jsonEnd);
      }

      const flashcards = JSON.parse(flashcardsText);

      // Create module for the flashcards
      const { data: moduleData, error: moduleError } = await supabase
        .from('flashcard_modules')
        .insert({
          name: `${topic} (${difficulty})`,
          description: `AI generated flashcards about ${topic}`,
          category: category,
          user_id: user.id
        })
        .select()
        .single();

      if (moduleError) {
        throw new Error('Error creating module: ' + moduleError.message);
      }

      // Save flashcards to the database
      const flashcardsToInsert = flashcards.map(fc => ({
        question: fc.question,
        answer: fc.answer,
        category: category,
        difficulty: difficulty,
        module_id: moduleData.id,
        user_id: user.id,
        is_approved: true // Auto-approve AI-generated cards
      }));

      const { data: insertedFlashcards, error: insertError } = await supabase
        .from('flashcards')
        .insert(flashcardsToInsert)
        .select();

      if (insertError) {
        throw new Error('Error saving flashcards: ' + insertError.message);
      }

      return new Response(
        JSON.stringify({ 
          flashcards: flashcards,
          module_id: moduleData.id,
          saved: true
        }),
        { 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json' 
          } 
        }
      );
    } catch (parseError) {
      console.error('Error parsing GROQ response:', parseError);
      console.log('Raw response:', data.choices[0].message.content);
      throw new Error('Invalid response format from GROQ API');
    }
  } catch (error) {
    console.error('Error in generate-flashcards function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});
