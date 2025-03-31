
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from 'https://esm.sh/stripe@14.21.0';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

serve(async (req) => {
  try {
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
    });
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    // Get the signature from the header
    const signature = req.headers.get('stripe-signature')!;
    
    // Get the webhook secret from the environment variables
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET') || '';
    
    if (!webhookSecret) {
      console.error('Missing Stripe webhook secret');
      return new Response(JSON.stringify({ error: 'Server configuration error' }), { status: 500 });
    }

    // Get the request body as text
    const body = await req.text();
    
    // Construct the event
    let event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error(`Webhook signature verification failed: ${err.message}`);
      return new Response(JSON.stringify({ error: 'Webhook signature verification failed' }), { status: 400 });
    }

    // Handle the event
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        const subscription = event.data.object;
        await handleSubscriptionChange(supabaseClient, stripe, subscription);
        break;
        
      case 'customer.subscription.deleted':
        const deletedSubscription = event.data.object;
        await handleSubscriptionDeleted(supabaseClient, deletedSubscription);
        break;
        
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new Response(JSON.stringify({ received: true }), { status: 200 });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
});

async function handleSubscriptionChange(supabase, stripe, subscription) {
  const customerId = subscription.customer;
  const subscriptionId = subscription.id;
  
  // Get the customer from our database
  const { data: customer, error: customerError } = await supabase
    .from('customers')
    .select('user_id')
    .eq('stripe_customer_id', customerId)
    .single();
    
  if (customerError) {
    console.error('Error finding customer:', customerError);
    return;
  }
  
  const userId = customer.user_id;
  
  // Determine the tier based on the product
  const product = await stripe.products.retrieve(subscription.items.data[0].price.product);
  
  let tier = 'free';
  if (product.metadata.tier) {
    tier = product.metadata.tier;
  } else if (product.name.toLowerCase().includes('premium')) {
    tier = 'premium';
  } else if (product.name.toLowerCase().includes('super')) {
    tier = 'super';
  }
  
  // Update the customer record with the subscription ID
  await supabase
    .from('customers')
    .update({ 
      subscription_id: subscriptionId,
      status: subscription.status,
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString()
    })
    .eq('stripe_customer_id', customerId);
    
  // Update the user profile with the subscription tier
  await supabase
    .from('user_profiles')
    .update({ 
      subscription_tier: (subscription.status === 'active' || subscription.status === 'trialing') ? tier : 'free'
    })
    .eq('id', userId);
}

async function handleSubscriptionDeleted(supabase, subscription) {
  const customerId = subscription.customer;
  
  // Get the customer from our database
  const { data: customer, error: customerError } = await supabase
    .from('customers')
    .select('user_id')
    .eq('stripe_customer_id', customerId)
    .single();
    
  if (customerError) {
    console.error('Error finding customer:', customerError);
    return;
  }
  
  const userId = customer.user_id;
  
  // Update the customer record
  await supabase
    .from('customers')
    .update({ 
      subscription_id: null,
      status: 'canceled',
      current_period_end: null
    })
    .eq('stripe_customer_id', customerId);
    
  // Update the user profile to free tier
  await supabase
    .from('user_profiles')
    .update({ subscription_tier: 'free' })
    .eq('id', userId);
}
