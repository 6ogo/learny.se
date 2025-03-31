
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
    // Get share code from request
    const { shareCode } = await req.json();
    
    if (!shareCode) {
      return new Response(
        JSON.stringify({ error: 'No share code provided' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Get user from auth header
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authentication required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      );
    }
    
    const authToken = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(authToken);
    
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid authentication' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      );
    }
    
    // Get the share data
    const { data: shareData, error: shareError } = await supabase
      .from('flashcard_shares')
      .select('flashcard_ids')
      .eq('code', shareCode)
      .single();
    
    if (shareError || !shareData) {
      return new Response(
        JSON.stringify({ error: 'Invalid share code' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
      );
    }
    
    // Get the flashcards
    const { data: flashcards, error: flashcardError } = await supabase
      .from('flashcards')
      .select('*')
      .in('id', shareData.flashcard_ids);
    
    if (flashcardError) {
      console.error('Error fetching flashcards:', flashcardError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch flashcards' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }
    
    if (!flashcards || flashcards.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No flashcards found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
      );
    }
    
    // Create a new module for the imported flashcards
    const { data: moduleData, error: moduleError } = await supabase
      .from('flashcard_modules')
      .insert({
        name: `Imported Flashcards (${new Date().toLocaleDateString()})`,
        description: `Flashcards imported from share code: ${shareCode}`,
        category: flashcards[0].category,
        user_id: user.id
      })
      .select()
      .single();
    
    if (moduleError) {
      console.error('Error creating module:', moduleError);
      return new Response(
        JSON.stringify({ error: 'Failed to create module' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }
    
    // Prepare the flashcards for insertion
    const flashcardsToInsert = flashcards.map(card => ({
      question: card.question,
      answer: card.answer,
      category: card.category,
      subcategory: card.subcategory,
      difficulty: card.difficulty,
      module_id: moduleData.id,
      user_id: user.id,
      is_approved: true
    }));
    
    // Insert the flashcards
    const { data: insertedFlashcards, error: insertError } = await supabase
      .from('flashcards')
      .insert(flashcardsToInsert);
    
    if (insertError) {
      console.error('Error inserting flashcards:', insertError);
      return new Response(
        JSON.stringify({ error: 'Failed to import flashcards' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        count: flashcardsToInsert.length, 
        module_id: moduleData.id 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
