// supabase/functions/generate-flashcards/index.ts

// Imports using paths expected by deno.json/import_map.json
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient, SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.26.0";

// Define types for clarity
interface FlashcardData {
  question: string;
  answer: string;
}

interface RequestBody {
  topic: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  count?: number;
}

// CORS Headers configuration
const corsHeaders = {
  'Access-Control-Allow-Origin': '*', // Be more specific in production, e.g., your frontend URL
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Helper function to safely parse JSON, attempting extraction if direct parse fails
function safeJsonParse(text: string): any | null {
    try {
        // Attempt direct parse first
        return JSON.parse(text);
    } catch (e) {
        console.warn("Direct JSON parse failed, attempting extraction...");
        // Fallback: try to extract JSON array or object using regex
        // This regex looks for structures starting with [ or { and ending with ] or }
        const jsonMatch = text.match(/(\[[\s\S]*?\]|\{[\s\S]*?\})/);
        if (jsonMatch && jsonMatch[0]) {
            try {
                return JSON.parse(jsonMatch[0]);
            } catch (e2) {
                console.error("Failed to parse extracted JSON:", e2);
                console.error("Original text snippet:", text.substring(0, 200)); // Log beginning of problematic text
                return null;
            }
        } else {
             console.error("Could not find JSON structure in text.");
             console.error("Original text snippet:", text.substring(0, 200));
             return null;
        }
    }
}

// Helper function to find an existing module or create a new one
async function findOrCreateModule(supabase: SupabaseClient, userId: string, category: string, topic: string): Promise<string | null> {
    const moduleName = `${topic} (AI)`; // Consistent naming for AI modules
    const description = `AI generated flashcards about ${topic}`;

    try {
        // Check if a module with the same name, category, and user already exists
        let { data: existingModule, error: findError } = await supabase
          .from('flashcard_modules')
          .select('id')
          .eq('name', moduleName)
          .eq('category', category)
          .eq('user_id', userId)
          .maybeSingle(); // Use maybeSingle to handle 0 or 1 result without error

        // Rethrow unexpected errors
        if (findError && findError.code !== 'PGRST116') { // PGRST116 means 0 rows found (expected case)
             throw findError;
        }

        if (existingModule) {
            console.log(`Using existing module: "${moduleName}" (ID: ${existingModule.id})`);
            return existingModule.id;
        }

        // Create the module if it doesn't exist
        console.log(`Creating module: "${moduleName}" for user ${userId}`);
        const { data: newModule, error: createError } = await supabase
            .from('flashcard_modules')
            .insert({
                name: moduleName,
                description: description,
                category: category,
                // subcategory: null, // Default to null for AI modules unless provided
                user_id: userId,
            })
            .select('id')
            .single(); // Expect exactly one row back after insert

        if (createError) throw createError;
        if (!newModule) throw new Error("Module creation failed unexpectedly (no data returned).");

        console.log(`Created new module: "${moduleName}" (ID: ${newModule.id})`);
        return newModule.id;

    } catch(error) {
         console.error(`Error finding or creating module "${moduleName}" for user ${userId}:`, error);
         // Return null to indicate failure, allowing the main handler to respond appropriately
         return null;
    }
}

// --- Main Edge Function Handler ---
serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Parse request body
    const { topic, category, difficulty, count = 10 }: RequestBody = await req.json();

    // --- Input Validation ---
    if (!topic || !category || !difficulty) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters: topic, category, difficulty' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
     const validDifficulties = ['beginner', 'intermediate', 'advanced', 'expert'];
     if (!validDifficulties.includes(difficulty)) {
         return new Response(
            JSON.stringify({ error: 'Invalid difficulty parameter' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
         );
     }

    // --- Get API Key ---
    const GROQ_API_KEY = Deno.env.get('GROQ_API_KEY');
    if (!GROQ_API_KEY) {
      console.error('CRITICAL: GROQ_API_KEY secret not set in Supabase Function settings.');
      return new Response(
        JSON.stringify({ error: 'Server configuration error [GK]' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // --- Call Groq API ---
    const systemPrompt = `You are an expert flashcard creator specializing in the field related to ${category}. Generate exactly ${count} high-quality flashcards about the specific topic: "${topic}". The target difficulty level is: ${difficulty}. Ensure each flashcard has a clear 'question' and a concise, accurate 'answer'. The flashcards should be factual and educational. Format the output STRICTLY as a valid JSON array of objects, where each object has exactly two string keys: "question" and "answer". Do NOT include any text, explanations, introductions, markdown formatting, or code blocks before or after the JSON array itself. The entire response must be only the JSON array. Example: [{"question": "Q1?", "answer": "A1"}, {"question": "Q2?", "answer": "A2"}]`;
    const userPrompt = `Generate ${count} flashcards for topic "${topic}", category "${category}", difficulty "${difficulty}". Strict JSON array output only.`;

    console.log(`Calling Groq for: ${topic} (${category}, ${difficulty}, ${count})`);
    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
         method: 'POST',
         headers: {
           'Authorization': `Bearer ${GROQ_API_KEY}`,
           'Content-Type': 'application/json'
         },
         body: JSON.stringify({
           model: "llama3-70b-8192", // Consider testing other models if needed
           messages: [
             { role: "system", content: systemPrompt },
             { role: "user", content: userPrompt }
           ],
           temperature: 0.65, // Slightly adjusted temperature
           max_tokens: 4096, // Max tokens for the model
           response_format: { type: "json_object" }, // Explicitly request JSON object if supported
         })
    });

    if (!groqResponse.ok) {
      const errorBody = await groqResponse.text();
      console.error(`Groq API Error (${groqResponse.status}): ${errorBody}`);
      return new Response(
        JSON.stringify({ error: 'Failed to generate flashcards from AI', details: `Status ${groqResponse.status}` }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } } // Use 502 Bad Gateway for upstream errors
      );
    }

    const groqData = await groqResponse.json();
    const rawContent = groqData.choices?.[0]?.message?.content;

    if (!rawContent) {
        console.error('Groq response missing content:', groqData);
         return new Response(
           JSON.stringify({ error: 'AI returned empty content' }),
           { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
         );
    }

    // --- Parse Groq Response ---
    const parsedData = safeJsonParse(rawContent);
    let flashcards: FlashcardData[] = [];

    // Check structure more carefully
    if (parsedData && Array.isArray(parsedData) && parsedData.every(card => card && typeof card.question === 'string' && typeof card.answer === 'string')) {
        flashcards = parsedData;
    } else if (parsedData && parsedData.flashcards && Array.isArray(parsedData.flashcards) && parsedData.flashcards.every(card => card && typeof card.question === 'string' && typeof card.answer === 'string')){
        flashcards = parsedData.flashcards; // Handle cases where it's wrapped { flashcards: [...] }
        console.warn("Extracted 'flashcards' array from Groq object response.");
    } else {
        console.error('Failed to parse or validate flashcard structure from Groq response:', rawContent);
        return new Response(
            JSON.stringify({ error: 'Failed to parse valid flashcards from AI response', details: "Received invalid format." }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }

    if (flashcards.length === 0 && parsedData) { // Check if parsing worked but array was empty
          console.log("AI generated an empty list of flashcards.");
          // Inform the user appropriately
           return new Response(
             JSON.stringify({ flashcards: [], saved: false, message: "AI generated no flashcards for this topic." }),
             { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
           );
    }

    console.log(`Successfully parsed ${flashcards.length} flashcards from Groq.`);

    // --- Save to Database (if authenticated) ---
    const authHeader = req.headers.get('authorization');
    let saved = false;
    let moduleId: string | null = null;
    let userId: string | null = null;

    if (authHeader) {
      try {
        // Create Supabase client with ANON KEY to verify the USER'S token
        const supabaseAuthClient = createClient(
          Deno.env.get('SUPABASE_URL') ?? '',
          Deno.env.get('SUPABASE_ANON_KEY') ?? '', // Use ANON key for getUser
          { global: { headers: { Authorization: authHeader } } }
        );
        const { data: { user }, error: userError } = await supabaseAuthClient.auth.getUser();

        if (!userError && user) {
          userId = user.id;
          console.log(`User ${userId} authenticated via JWT. Attempting to save cards.`);

          // Create Supabase client with SERVICE ROLE KEY for database operations
          const supabaseAdminClient = createClient(
             Deno.env.get('SUPABASE_URL') ?? '',
             Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '' // Use Service Role for DB write
          );

          // Find or create the module using the admin client
          moduleId = await findOrCreateModule(supabaseAdminClient, userId, category, topic);

          if (moduleId !== null) {
            // Prepare flashcard data for insertion
            const flashcardsToInsert = flashcards.map(card => ({
              question: card.question,
              answer: card.answer,
              category: category,
              subcategory: null, // Default subcategory to null for AI cards
              difficulty: difficulty,
              module_id: moduleId,
              user_id: userId,
              is_approved: true, // AI generated = approved
              correct_count: 0,
              incorrect_count: 0,
              learned: false,
              review_later: false,
              report_count: 0, // Initialize report fields
              report_reason: null,
            }));

            // Insert flashcards using the admin client
            const { error: insertError } = await supabaseAdminClient
              .from('flashcards')
              .insert(flashcardsToInsert);

            if (insertError) {
              console.error('Error saving flashcards to database:', insertError);
              // Respond with generated cards but indicate save failed
              return new Response(
                JSON.stringify({ flashcards, saved: false, error: "Failed to save generated cards to database.", module_id: moduleId }),
                { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
              );
            } else {
              saved = true;
              console.log(`Successfully saved ${flashcardsToInsert.length} cards to module ${moduleId} for user ${userId}.`);
            }
          } else {
             console.error(`Failed to find or create module for user ${userId}, topic "${topic}", cards not saved.`);
             // Respond with generated cards but indicate save failed due to module issue
             return new Response(
                JSON.stringify({ flashcards, saved: false, error: "Could not associate cards with a user module." }),
                { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
              );
          }
        } else {
          console.warn('Auth token invalid or user not found, not saving cards:', userError?.message);
          // Fall through to return generated cards with saved: false
        }
      } catch (dbError) {
        console.error('Error during database operation phase:', dbError);
        // Fall through to return generated cards with saved: false
      }
    } else {
      console.log('No auth header found, returning generated cards without saving.');
    }

    // --- Return Final Response ---
    return new Response(
      JSON.stringify({
        flashcards,
        saved, // true if user was logged in, module created/found, and insert succeeded
        module_id: moduleId, // Will be null if not saved
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200, // OK status even if not saved, as cards were generated
      }
    );

  } catch (error) {
    // Catch unexpected errors in the main try block
    console.error('Unexpected error in generate-flashcards function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal Server Error', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});