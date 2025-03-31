
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from 'https://esm.sh/stripe@14.21.0';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

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
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    // Get the user from the auth header
    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { 
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
    });

    // Get user profile with subscription tier
    const { data: profile, error: profileError } = await supabaseClient
      .from('user_profiles')
      .select('subscription_tier')
      .eq('id', user.id)
      .single();

    if (profileError && profileError.code !== 'PGRST116') {
      throw profileError;
    }

    // Find customer in our database
    const { data: customer, error: customerError } = await supabaseClient
      .from('customers')
      .select('stripe_customer_id, subscription_id')
      .eq('user_id', user.id)
      .single();

    // If no customer or subscription found, return default tier
    if (customerError || !customer?.subscription_id) {
      return new Response(
        JSON.stringify({ 
          tier: profile?.subscription_tier || 'free',
          active: false
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }

    // Verify subscription with Stripe
    const subscription = await stripe.subscriptions.retrieve(customer.subscription_id);
    
    // Determine subscription tier based on product
    let tier = 'free';
    if (subscription.status === 'active' || subscription.status === 'trialing') {
      // Get product details
      const product = await stripe.products.retrieve(subscription.items.data[0].price.product as string);
      
      // Map product to tier based on metadata or name
      if (product.metadata.tier) {
        tier = product.metadata.tier;
      } else if (product.name.toLowerCase().includes('premium')) {
        tier = 'premium';
      } else if (product.name.toLowerCase().includes('super')) {
        tier = 'super';
      }
      
      // Update user profile if tier doesn't match
      if (profile?.subscription_tier !== tier) {
        await supabaseClient
          .from('user_profiles')
          .update({ subscription_tier: tier })
          .eq('id', user.id);
      }
    } else {
      // Subscription not active, update user profile to free
      if (profile?.subscription_tier !== 'free') {
        await supabaseClient
          .from('user_profiles')
          .update({ subscription_tier: 'free' })
          .eq('id', user.id);
      }
    }

    return new Response(
      JSON.stringify({ 
        tier,
        active: subscription.status === 'active' || subscription.status === 'trialing',
        subscription_status: subscription.status,
        renewal_date: new Date(subscription.current_period_end * 1000).toISOString()
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error checking subscription:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        tier: 'free',
        active: false
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
