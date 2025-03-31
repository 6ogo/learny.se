
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const GROQ_API_KEY = Deno.env.get('GROQ_API_KEY');

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
    
    console.log(`Generating ${count} flashcards for topic: ${topic}, category: ${category}, difficulty: ${difficulty}`);
    
    if (!GROQ_API_KEY) {
      throw new Error('GROQ_API_KEY is not configured');
    }

    // Construct the prompt for generating flashcards
    const prompt = `
    Create ${count} flashcards about ${topic} in the category of ${category} at ${difficulty} level.
    Each flashcard should have a clear question and a concise but complete answer.
    Format your response as a JSON array of objects with "question" and "answer" properties.
    Example:
    [
      {"question": "What is X?", "answer": "X is..."},
      {"question": "How does Y work?", "answer": "Y works by..."}
    ]
    Only respond with the JSON array, nothing else.
    `;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3-70b-8192',
        messages: [
          {
            role: 'system',
            content: 'You are an expert in creating educational flashcards. Respond only with JSON.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('GROQ API error:', data);
      throw new Error(`GROQ API responded with status ${response.status}: ${data.error?.message || 'Unknown error'}`);
    }

    // Extract the generated content
    const generatedContent = data.choices[0].message.content;
    console.log('Generated content:', generatedContent);
    
    // Parse the JSON response
    let flashcards;
    try {
      // Try to parse the response directly
      flashcards = JSON.parse(generatedContent);
    } catch (e) {
      // If direct parsing fails, try to extract JSON from text
      const jsonMatch = generatedContent.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        flashcards = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Unable to parse flashcards from GROQ response');
      }
    }

    // Validate the structure
    if (!Array.isArray(flashcards) || 
        !flashcards.every(card => typeof card.question === 'string' && typeof card.answer === 'string')) {
      throw new Error('Invalid flashcard format in GROQ response');
    }

    return new Response(
      JSON.stringify({ flashcards }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in generate-flashcards function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
