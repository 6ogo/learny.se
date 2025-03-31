
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
    const { flashcardIds } = await req.json();
    
    if (!Array.isArray(flashcardIds) || flashcardIds.length === 0) {
      throw new Error('No flashcard IDs provided');
    }

    // Get the user ID from the request
    const authHeader = req.headers.get('Authorization') || '';
    const token = authHeader.replace('Bearer ', '');
    
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    if (userError || !user) {
      throw new Error('Unauthorized: ' + (userError?.message || 'User not found'));
    }

    // Generate a unique share code
    const shareCode = Math.random().toString(36).substring(2, 10);
    
    // Store the share information
    await supabase.from('flashcard_shares').insert({
      code: shareCode,
      user_id: user.id,
      flashcard_ids: flashcardIds,
      created_at: new Date().toISOString()
    });

    // Generate the shareable link
    const baseUrl = req.headers.get('origin') || 'https://learny.se';
    const shareableLink = `${baseUrl}/share/${shareCode}`;

    return new Response(
      JSON.stringify({ shareableLink, shareCode }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in create-shareable-link function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
