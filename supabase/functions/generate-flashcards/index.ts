
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.26.0";

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
    const { topic, category, difficulty, count } = await req.json();
    
    // Input validation
    if (!topic || !category || !difficulty || !count) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Get the GROQ API key from environment variable
    const GROQ_API_KEY = Deno.env.get('GROQ_API_KEY');
    if (!GROQ_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'GROQ API key not configured' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    // Create a system prompt based on parameters
    const systemPrompt = `You are an expert flashcard creator for the topic: ${topic} at ${difficulty} level.
    Create ${count} high-quality flashcards that are clear, concise, and educational.
    Each flashcard should have a question and answer that helps users understand important concepts about ${topic}.`;

    // Make request to GROQ API
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "llama3-70b-8192",
        messages: [
          {
            role: "system",
            content: systemPrompt
          },
          {
            role: "user",
            content: `Please generate ${count} flashcards about ${topic} at ${difficulty} level. Format your response as a JSON array of objects, each with 'question' and 'answer' properties. Make sure your JSON is valid, with no extra text before or after the JSON array.`
          }
        ],
        temperature: 0.7,
        max_tokens: 4000
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('GROQ API error:', errorData);
      return new Response(
        JSON.stringify({ error: 'Error calling GROQ API', details: errorData }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    const data = await response.json();
    const groqResponse = data.choices[0].message.content;
    
    // Extract the JSON array from the response
    let flashcards;
    try {
      // Try to parse the response as JSON directly
      flashcards = JSON.parse(groqResponse);
      
      // Make sure we have an array of objects with question and answer properties
      if (!Array.isArray(flashcards) || !flashcards.every(card => card.question && card.answer)) {
        throw new Error('Invalid flashcard format');
      }
    } catch (e) {
      console.error('Error parsing GROQ response:', e);
      console.log('Raw response:', groqResponse);
      
      // Try to extract JSON from text (in case model added extra text)
      const jsonMatch = groqResponse.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        try {
          flashcards = JSON.parse(jsonMatch[0]);
        } catch (e2) {
          console.error('Failed to extract JSON:', e2);
          return new Response(
            JSON.stringify({ error: 'Failed to parse GROQ response', flashcards: [] }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
          );
        }
      } else {
        return new Response(
          JSON.stringify({ error: 'Failed to parse GROQ response', flashcards: [] }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        );
      }
    }

    // Get user info from auth token
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      // User is not logged in, return the flashcards but don't save them
      return new Response(
        JSON.stringify({ flashcards, saved: false }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // User is logged in, we can save the flashcards
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    try {
      // Validate user token
      const authToken = authHeader.replace('Bearer ', '');
      const { data: { user }, error: userError } = await supabase.auth.getUser(authToken);
      
      if (userError || !user) {
        console.error('User auth error:', userError);
        // Return flashcards but don't save them
        return new Response(
          JSON.stringify({ flashcards, saved: false }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      // Create a flashcard module to store these cards
      const { data: moduleData, error: moduleError } = await supabase
        .from('flashcard_modules')
        .insert({
          name: topic,
          description: `AI generated flashcards about ${topic}`,
          category,
          user_id: user.id
        })
        .select()
        .single();
      
      if (moduleError) {
        console.error('Error creating module:', moduleError);
        // Return flashcards but mark not saved
        return new Response(
          JSON.stringify({ flashcards, saved: false, error: 'Failed to create module' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      // Prepare flashcards for database
      const flashcardsToInsert = flashcards.map(card => ({
        question: card.question,
        answer: card.answer,
        category,
        difficulty,
        module_id: moduleData.id,
        user_id: user.id,
        is_approved: true // AI-generated cards are pre-approved
      }));
      
      // Insert flashcards
      const { data: savedCards, error: saveError } = await supabase
        .from('flashcards')
        .insert(flashcardsToInsert)
        .select();
      
      if (saveError) {
        console.error('Error saving flashcards:', saveError);
        return new Response(
          JSON.stringify({ flashcards, saved: false, error: 'Failed to save flashcards' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      // Success!
      return new Response(
        JSON.stringify({ 
          flashcards, 
          saved: true, 
          module_id: moduleData.id 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } catch (error) {
      console.error('Error saving flashcards:', error);
      // Return flashcards but mark not saved
      return new Response(
        JSON.stringify({ flashcards, saved: false, error: 'Internal server error' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
