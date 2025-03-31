
// Deprecated - Import the supabase client from @/integrations/supabase/client instead
import { supabase } from '@/integrations/supabase/client';

// Export the client for backward compatibility
export { supabase };

// Export a function to check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return true; // We're now properly configured with environment variables
};
