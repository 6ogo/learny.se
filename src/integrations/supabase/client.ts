
// src/integrations/supabase/client.ts
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://pkixxzfdjlplojdqhlzf.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBraXh4emZkamxwbG9qZHFobHpmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM0MTczMzMsImV4cCI6MjA1ODk5MzMzM30.20SKi9YyU5UjLcoUUOUbZ6nD5E0kPcR6ManTSy8cHzY";

// Create Supabase client with explicit session persistence and token refresh
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true, // Detect OAuth redirects
    storage: localStorage, // Explicitly use localStorage
  },
});

// Add debugging helper for Supabase errors
export const logSupabaseError = (error: any, operation: string) => {
  console.error(`Supabase ${operation} error:`, error);
  
  // Additional context for common errors
  if (error?.code === '42501') {
    console.error('RLS policy might be preventing this operation');
  } else if (error?.code === '23505') {
    console.error('Unique constraint violation');
  } else if (error?.code === '23503') {
    console.error('Foreign key constraint violation'); 
  }
};
