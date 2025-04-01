// src/integrations/supabase/client.ts
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://pkixxzfdjlplojdqhlzf.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBraXh4emZkamxwbG9qZHFobHpmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM0MTczMzMsImV4cCI6MjA1ODk5MzMzM30.20SKi9YyU5UjLcoUUOUbZ6nD5E0kPcR6ManTSy8cHzY";

// Create Supabase client with improved configuration
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true, // Enable detecting OAuth tokens in URL
    storageKey: 'learny-auth', // Custom storage key for auth
  },
});

// Add a connection check function
export const checkSupabaseConnection = async () => {
  try {
    // Try a simple query to check connection
    const { error } = await supabase
      .from('user_profiles')
      .select('count', { count: 'exact', head: true })
      .limit(1);
      
    if (error) {
      console.error('Supabase connection error:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Supabase connection exception:', err);
    return false;
  }
};