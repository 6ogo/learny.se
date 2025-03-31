
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

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
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { shareCode } = await req.json();
    
    if (!shareCode) {
      throw new Error('No share code provided');
    }

    // Get the user ID from the request
    const authHeader = req.headers.get('Authorization') || '';
    const token = authHeader.replace('Bearer ', '');
    
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    if (userError || !user) {
      throw new Error('Unauthorized: ' + (userError?.message || 'User not found'));
    }

    // Get the shared flashcards
    const { data: shareData, error: shareError } = await supabase
      .from('flashcard_shares')
      .select('flashcard_ids, user_id')
      .eq('code', shareCode)
      .single();

    if (shareError || !shareData) {
      throw new Error('Invalid share code: ' + (shareError?.message || 'Share not found'));
    }

    // Get the flashcards
    const { data: flashcards, error: flashcardsError } = await supabase
      .from('flashcards')
      .select('*')
      .in('id', shareData.flashcard_ids);

    if (flashcardsError) {
      throw new Error('Error fetching flashcards: ' + flashcardsError.message);
    }

    // Import flashcards for the current user
    const importedFlashcards = flashcards.map(fc => ({
      question: fc.question,
      answer: fc.answer,
      category: fc.category,
      subcategory: fc.subcategory,
      difficulty: fc.difficulty,
      user_id: user.id,
      module_id: fc.module_id,
      learned: false,
      review_later: false,
      correct_count: 0,
      incorrect_count: 0
    }));

    const { data: insertedData, error: insertError } = await supabase
      .from('flashcards')
      .insert(importedFlashcards)
      .select();

    if (insertError) {
      throw new Error('Error importing flashcards: ' + insertError.message);
    }

    return new Response(
      JSON.stringify({ success: true, count: importedFlashcards.length }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in import-shared-flashcards function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
