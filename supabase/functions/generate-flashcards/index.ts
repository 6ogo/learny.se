
// supabase/functions/generate-flashcards/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.8.0'

// CORS headers for the response
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Define the structure for flashcards
interface Flashcard {
  question: string;
  answer: string;
  difficulty?: string;
}

// Process the request
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Get the GROQ API key from environment variables
    const apiKey = Deno.env.get('GROQ_API_KEY');
    if (!apiKey) {
      return new Response(
        JSON.stringify({
          error: "GROQ_API_KEY not configured in environment variables",
          flashcards: []
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    // Get the request body
    const requestData = await req.json();
    const { 
      topic, 
      category, 
      difficulty = 'beginner', 
      count = 10, 
      context = '', 
      language = 'swedish' 
    } = requestData;

    if (!topic || !category) {
      return new Response(
        JSON.stringify({
          error: "Missing required fields",
          details: "Both topic and category must be provided",
          flashcards: []
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    console.log(`Generating ${count} flashcards about "${topic}" in category "${category}" with difficulty "${difficulty}" in language "${language}"`);
    
    // Build a prompt that includes additional context if provided
    let prompt = `Generera ${count} flashcards på ${language} för ämnet "${topic}" inom kategorin "${category}" med svårighetsgrad "${difficulty}".`;
    
    if (context && context.length > 0) {
      prompt += ` Använd följande kontext för att skapa mer specifika och detaljerade flashcards: "${context}"`;
    }
    
    prompt += `
    Skapa flashcards som är lämpliga för svårighetsgraden:
    - beginner: Grundläggande begrepp och definitioner
    - intermediate: Mer djupgående förståelse av begreppen
    - advanced: Avancerade koncept och tillämpningar
    - expert: Specialiserade och komplicerade koncept
    
    Varje flashcard ska ha fråga och svar på ${language}. Frågorna ska vara koncisa men tydliga. Svaren ska vara informativa, korrekta och kompletta, men inte för långa.
    
    Svara med en JSON-array med objekt som har fälten "question" och "answer".
    Inkludera BARA denna JSON-array i ditt svar, inga andra kommentarer eller förklaringar.
    `;

    // Call GROQ API directly using fetch
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "llama3-70b-8192",
        messages: [
          {
            role: "system",
            content: `Du är en pedagogisk AI som hjälper till att skapa högkvalitativa flashcards på ${language}. Svara med endast JSON utan kommentarer.`
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.4,
        max_tokens: 4000,
      }),
    });

    // Extract AI response
    const responseData = await response.json();
    const aiResponseText = responseData.choices[0]?.message?.content || "";
    console.log("AI response:", aiResponseText.substring(0, 200) + "...");

    // Try to parse the JSON from the response
    let flashcards: Flashcard[] = [];
    try {
      // Look for a JSON array in the response using regex
      const jsonMatch = aiResponseText.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        flashcards = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No valid JSON array found in response");
      }
    } catch (parseError) {
      console.error("Error parsing flashcards from response:", parseError);
      return new Response(
        JSON.stringify({
          error: "Failed to parse flashcards from AI response",
          details: String(parseError),
          flashcards: []
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    // Validate flashcards format
    if (!Array.isArray(flashcards) || flashcards.length === 0) {
      return new Response(
        JSON.stringify({
          error: "Generated flashcards are not in the expected format",
          flashcards: []
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    // Check if we have a user session to save the flashcards
    const authHeader = req.headers.get('authorization');
    let saved = false;
    let moduleId = null;

    if (authHeader) {
      // Get the JWT token
      const token = authHeader.replace('Bearer ', '');
      
      // Create Supabase client
      const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
      const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY') || '';
      const supabase = createClient(supabaseUrl, supabaseKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
          detectSessionInUrl: false,
        },
        global: { headers: { Authorization: `Bearer ${token}` } },
      });

      try {
        // Get authenticated user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !user) {
          console.error("Error getting user:", userError);
          return new Response(
            JSON.stringify({
              message: "Kunde inte autentisera användaren. Flashcards genererades men sparades inte.",
              flashcards
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
          );
        }

        // Create a new module for these flashcards
        const moduleName = `${topic.substring(0, 30)}${topic.length > 30 ? '...' : ''}`;
        const { data: moduleData, error: moduleError } = await supabase
          .from('flashcard_modules')
          .insert({
            name: moduleName,
            description: `AI-genererade flashcards om ${topic}`,
            category,
            user_id: user.id,
          })
          .select('id')
          .single();

        if (moduleError || !moduleData) {
          console.error("Error creating module:", moduleError);
          return new Response(
            JSON.stringify({
              message: "Kunde inte skapa en modul. Flashcards genererades men sparades inte.",
              flashcards
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
          );
        }

        moduleId = moduleData.id;

        // Prepare flashcards for insertion
        const flashcardsToInsert = flashcards.map(card => ({
          question: card.question,
          answer: card.answer,
          category,
          difficulty,
          module_id: moduleId,
          user_id: user.id,
          is_approved: true // AI-generated cards are auto-approved
        }));

        // Insert flashcards
        const { data: insertedCards, error: insertError } = await supabase
          .from('flashcards')
          .insert(flashcardsToInsert)
          .select('id');

        if (insertError) {
          console.error("Error inserting flashcards:", insertError);
          return new Response(
            JSON.stringify({
              message: "Kunde inte spara flashcards.",
              error: insertError.message,
              flashcards
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
          );
        }

        saved = true;
        console.log(`Saved ${insertedCards.length} flashcards to module ${moduleId}`);

      } catch (dbError) {
        console.error("Database operation error:", dbError);
        return new Response(
          JSON.stringify({
            message: "Databasfel vid sparande. Flashcards genererades men sparades inte.",
            error: String(dbError),
            flashcards
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
        );
      }
    }

    // Return the flashcards along with save status
    return new Response(
      JSON.stringify({
        flashcards,
        saved,
        module_id: moduleId
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );

  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({
        error: "En oväntad fel uppstod",
        details: String(error),
        flashcards: []
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
