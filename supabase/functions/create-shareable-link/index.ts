
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.26.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Generate a random code of length 8
function generateShareCode() {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get flashcard IDs from request
    const { flashcardIds } = await req.json();
    
    if (!flashcardIds || !Array.isArray(flashcardIds) || flashcardIds.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No flashcard IDs provided' }),
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
    
    // Generate a unique share code
    let shareCode = generateShareCode();
    let isUnique = false;
    let attempts = 0;
    
    while (!isUnique && attempts < 5) {
      const { data: existingShare } = await supabase
        .from('flashcard_shares')
        .select('code')
        .eq('code', shareCode)
        .single();
      
      if (!existingShare) {
        isUnique = true;
      } else {
        shareCode = generateShareCode();
        attempts++;
      }
    }
    
    if (!isUnique) {
      return new Response(
        JSON.stringify({ error: 'Failed to generate unique share code' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }
    
    // Create the share record
    const { data: shareData, error: shareError } = await supabase
      .from('flashcard_shares')
      .insert({
        code: shareCode,
        user_id: user.id,
        flashcard_ids: flashcardIds
      })
      .select()
      .single();
    
    if (shareError) {
      console.error('Error creating share:', shareError);
      return new Response(
        JSON.stringify({ error: 'Failed to create share' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }
    
    // Generate shareable link with the current host
    const host = req.headers.get('host') || 'learny.se';
    const isLocalhost = host.includes('localhost') || host.includes('127.0.0.1');
    const protocol = isLocalhost ? 'http' : 'https';
    const shareableLink = `${protocol}://${host}/share/${shareCode}`;
    
    return new Response(
      JSON.stringify({ shareableLink, shareCode }),
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
