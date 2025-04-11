
// Follow Deno Deploy runtime API
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.8";
import { Database } from "../_shared/database.types.ts";

// Define the correct GROQ API endpoint
const GROQ_API_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";

// Languages map for better prompts
const languageMap: Record<string, string> = {
  swedish: "svenska",
  english: "English",
  norwegian: "norsk",
  danish: "dansk",
  finnish: "suomi",
  german: "Deutsch",
  french: "français",
  spanish: "español",
};

// Types for request validation
interface RequestBody {
  topic: string;
  category: string;
  difficulty: string;
  count: number;
  context?: string;
  language?: string;
}

interface FlashcardPayload {
  question: string;
  answer: string;
}

// Function to get the category ID from its name
async function getCategoryId(supabaseClient: any, categoryName: string) {
  const { data, error } = await supabaseClient
    .from('flashcard_modules')
    .select('id')
    .eq('name', categoryName)
    .eq('is_generic', true)
    .limit(1);
  
  if (error || !data || data.length === 0) {
    console.error("Error finding category ID:", error);
    return null;
  }
  
  return data[0].id;
}

// Main serve function
serve(async (req) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  
  try {
    // Get environment variables
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
    const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY") || "";
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const GROQ_API_KEY = Deno.env.get("GROQ_API_KEY") || "";
    
    if (!GROQ_API_KEY) {
      throw new Error("GROQ_API_KEY environment variable not set");
    }
    
    // Parse the request body
    const requestData = await req.json() as RequestBody;
    const { topic, category, difficulty, count = 10, context = "", language = "swedish" } = requestData;
    
    // Input validation
    if (!topic) throw new Error("Topic is required");
    if (!category) throw new Error("Category is required");
    if (!["beginner", "intermediate", "advanced", "expert"].includes(difficulty)) {
      throw new Error("Invalid difficulty level");
    }
    
    // Configure Supabase clients - one with anonymous credentials, one with service role
    const supabaseClient = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);
    const supabaseAdmin = createClient<Database>(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    
    // Get user information from the request (if authenticated)
    const authHeader = req.headers.get("Authorization");
    let user = null;
    
    if (authHeader) {
      const token = authHeader.replace("Bearer ", "");
      const { data: { user: userData }, error: userError } = await supabaseClient.auth.getUser(token);
      
      if (userError) {
        console.error("Error getting user:", userError);
      } else {
        user = userData;
      }
    }
    
    // Prepare language-specific prompting
    const languageDisplay = languageMap[language.toLowerCase()] || language;
    const targetLang = language.toLowerCase() === "english" ? "English" : languageDisplay;
    
    console.log(`Generating ${count} flashcards about "${topic}" in category "${category}" with difficulty "${difficulty}" in language "${targetLang}"`);
    
    // Construct the system message based on parameters
    const difficultyDescriptions: Record<string, string> = {
      "beginner": "simple, core concepts with clear and direct answers",
      "intermediate": "moderately complex with some nuance in explanations",
      "advanced": "complex concepts with detailed technical explanations",
      "expert": "highly technical, specialist knowledge with in-depth explanations"
    };
    
    const systemMessage = `You are an expert educator creating flashcards on the topic: "${topic}" in ${targetLang}. 
    Create ${count} question-answer flashcards at ${difficulty} level (${difficultyDescriptions[difficulty]}).
    ${context ? `Additional context to consider: ${context}` : ''}
    
    Each flashcard should have a clear question and comprehensive answer.
    Your response must be ONLY valid, properly formatted JSON array with objects containing "question" and "answer" fields.
    Ensure the JSON is complete and properly terminated. Verify each flashcard object has both fields completed.`;
    
    // Prepare the request to GROQ API
    const groqPayload = {
      messages: [
        {
          role: "system",
          content: systemMessage
        },
        {
          role: "user",
          content: `Create ${count} flashcards about "${topic}" in ${targetLang} at ${difficulty} difficulty. Return only a valid JSON array without any additional text.`
        }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 2048
    };
    
    // Call the GROQ API
    const response = await fetch(GROQ_API_ENDPOINT, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(groqPayload)
    });
    
    if (!response.ok) {
      const errorData = await response.text();
      console.error("GROQ API error:", errorData);
      throw new Error(`GROQ API error: ${response.status} ${errorData}`);
    }
    
    const apiResponse = await response.json();
    console.log("AI response:", apiResponse.choices[0].message.content.substring(0, 200) + "...");
    
    // Extract the content and parse the JSON
    let flashcardsContent = apiResponse.choices[0].message.content;
    
    // Sometimes the AI includes markdown code blocks, let's clean that up
    flashcardsContent = flashcardsContent.replace(/```json\s*/g, '').replace(/```\s*$/g, '');
    
    // Try to parse the JSON - with improved error handling
    let flashcards: FlashcardPayload[] = [];
    try {
      // First, try the standard JSON parse
      try {
        flashcards = JSON.parse(flashcardsContent);
      } catch (parseError) {
        console.error("Initial JSON parse failed:", parseError);
        
        // Try to repair the JSON if possible
        try {
          // Add missing closing brackets if needed
          let fixedContent = flashcardsContent;
          const openBrackets = (flashcardsContent.match(/\[/g) || []).length;
          const closeBrackets = (flashcardsContent.match(/\]/g) || []).length;
          if (openBrackets > closeBrackets) {
            fixedContent += ']'.repeat(openBrackets - closeBrackets);
          }
          
          // Check for trailing commas
          fixedContent = fixedContent.replace(/,(\s*[\}\]])/g, '$1');
          
          // Try to fix incomplete strings with missing quotes
          fixedContent = fixedContent.replace(/([{,]\s*"[^"]+"\s*:\s*[^",}\]]*),/g, '$1",');
          fixedContent = fixedContent.replace(/([{,]\s*"[^"]+"\s*:\s*[^",}\]]*)}]/g, '$1"}]');
          
          flashcards = JSON.parse(fixedContent);
          console.log("JSON repair successful");
        } catch (repairError) {
          console.error("JSON repair failed:", repairError);
          
          // If all else fails, we'll extract flashcards manually
          // Extract using regex pattern matching
          const pattern = /"question"\s*:\s*"([^"]*)"\s*,\s*"answer"\s*:\s*"([^"]*)"/g;
          const matches = [...flashcardsContent.matchAll(pattern)];
          
          if (matches.length > 0) {
            flashcards = matches.map(match => ({
              question: match[1],
              answer: match[2]
            }));
            console.log("Extracted flashcards using regex:", flashcards.length);
          } else {
            throw new Error("Could not extract flashcards from malformed JSON");
          }
        }
      }
      
      // Validate structure: should be an array of objects with question and answer
      if (!Array.isArray(flashcards)) {
        flashcards = [{
          question: "Could not generate valid flashcards",
          answer: "The AI returned an invalid response format. Please try again."
        }];
      } else {
        // Ensure each flashcard has a question and answer
        flashcards = flashcards.filter(fc => 
          typeof fc === 'object' && fc !== null &&
          typeof fc.question === 'string' && fc.question.trim() !== '' &&
          typeof fc.answer === 'string' && fc.answer.trim() !== ''
        );
      }
      
      // If we end up with no valid flashcards, add a fallback
      if (flashcards.length === 0) {
        flashcards = [{
          question: "Could not generate valid flashcards",
          answer: "The AI returned an invalid response format. Please try again."
        }];
      }
    } catch (e) {
      console.error("Failed to parse AI response:", e);
      console.log("Raw content:", flashcardsContent);
      return new Response(
        JSON.stringify({
          flashcards: [],
          error: "Failed to parse AI response. The model returned an invalid format.",
          details: flashcardsContent.substring(0, 500)
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // If the user is authenticated, save the flashcards to the database
    let module_id = null;
    let saved = false;
    
    if (user) {
      try {
        // First create a new flashcard module
        const moduleInsert = await supabaseAdmin
          .from('flashcard_modules')
          .insert({
            name: topic,
            description: `AI-genererade flashcards om ${topic} (${difficultyDescriptions[difficulty]})`,
            user_id: user.id,
            category: category,
            is_generic: false
          })
          .select()
          .single();
        
        if (moduleInsert.error) {
          throw new Error(`Error creating flashcard module: ${moduleInsert.error.message}`);
        }
        
        module_id = moduleInsert.data.id;
        
        // Then insert the flashcards
        const flashcardsInsert = await supabaseAdmin
          .from('flashcards')
          .insert(
            flashcards.map(fc => ({
              question: fc.question,
              answer: fc.answer,
              category: category,
              difficulty: difficulty,
              user_id: user.id,
              module_id: module_id,
              is_approved: true
            }))
          );
        
        if (flashcardsInsert.error) {
          throw new Error(`Error creating flashcards: ${flashcardsInsert.error.message}`);
        }
        
        saved = true;
      } catch (err) {
        console.error("Database error:", err);
        return new Response(
          JSON.stringify({
            flashcards,
            error: "Failed to save flashcards to database",
            details: err.message
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }
    
    // Return the flashcards to the client
    return new Response(
      JSON.stringify({
        flashcards,
        module_id,
        saved
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
    
  } catch (error) {
    console.error("ERROR:", error.message);
    return new Response(
      JSON.stringify({ 
        flashcards: [], 
        error: error.message,
        details: error.stack 
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
    );
  }
});
