
// src/services/groqService.ts
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export interface AIFlashcardRequest {
  topic: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  count?: number;
  context?: string;
  language?: string;
}

export interface AIFlashcardResponse {
  flashcards: { question: string; answer: string }[];
  module_id?: string; // ID of the module if saved
  saved?: boolean; // Flag indicating if cards were saved to DB
  error?: string; // Optional error message from function
  message?: string; // Optional info message from function
}

// Maximum number of retries for function invocation
const MAX_RETRIES = 3;
// Timeout for function invocation (ms)
const TIMEOUT_MS = 30000;
// Track if a request is already in progress
let requestInProgress = false;

export const generateFlashcards = async (request: AIFlashcardRequest): Promise<AIFlashcardResponse> => {
  // Prevent multiple concurrent requests
  if (requestInProgress) {
    return { 
      flashcards: [], 
      error: "En annan generering pågår redan. Vänta tills den är klar." 
    };
  }
  
  try {
    console.log('Invoking Supabase function generate-flashcards...', request);
    requestInProgress = true;

    let retries = 0;
    let lastError = null;

    while (retries < MAX_RETRIES) {
      try {
        // Create a timeout promise
        const timeoutPromise = new Promise<{data: null, error: Error}>((_, reject) => {
          setTimeout(() => reject(new Error("Request timed out")), TIMEOUT_MS);
        });

        // Create the actual request promise
        const requestPromise = supabase.functions.invoke('generate-flashcards', {
          body: {
            topic: request.topic,
            category: request.category,
            difficulty: request.difficulty,
            count: request.count || 10,
            context: request.context || '',
            language: request.language || 'swedish' // Default to Swedish if not specified
          }
        });

        // Race the timeout against the actual request
        const { data, error: functionError } = await Promise.race([
          requestPromise,
          timeoutPromise
        ]) as { data: any, error: any };

        // Handle errors during function invocation itself
        if (functionError) {
          console.error('Error invoking Supabase function:', functionError);
          lastError = functionError;
          retries++;
          
          // Exponential backoff between retries
          if (retries < MAX_RETRIES) {
            await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retries)));
            continue;
          } else {
            throw functionError;
          }
        }

        // Handle errors returned *from* the function execution
        if (data?.error) {
          console.error('Error from generate-flashcards function:', data.error, data.details);
          
          // If we get a specific error about JSON parsing, retry
          if (data.error.includes('parse') && retries < MAX_RETRIES) {
            lastError = new Error(data.error);
            retries++;
            // Exponential backoff between retries
            await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retries)));
            continue;
          } else {
            // For other errors, show toast and continue
            try {
              toast({
                title: "Kunde inte generera flashcards",
                description: data.error || "Ett fel uppstod hos AI-tjänsten.",
                variant: "destructive",
              });
            } catch (toastError) {
              console.error('Could not show toast:', toastError);
            }
            // Return the data which includes the error message
            return { flashcards: data.flashcards || [], saved: false, error: data.error };
          }
        }

        // Handle informational messages from function (e.g., no cards generated)
        if (data?.message) {
          try {
            toast({
              title: "Info",
              description: data.message,
              variant: "default"
            });
          } catch (toastError) {
            console.error('Could not show toast:', toastError);
          }
        }

        // Handle success (saved or not saved)
        if (data?.saved) {
          try {
            toast({
              title: "Flashcards skapade!",
              description: `${data.flashcards.length} flashcards har genererats och sparats i din samling.`,
            });
          } catch (toastError) {
            console.error('Could not show toast:', toastError);
          }
        } else if (data?.flashcards?.length > 0 && !data.saved && !data.error && !data.message) {
          // Only show this if no specific message/error was returned
          try {
            toast({
              title: "Flashcards genererade (ej sparade)",
              description: "Logga in för att spara flashcards till din samling.",
              variant: "default" // Use default variant for informational message
            });
          } catch (toastError) {
            console.error('Could not show toast:', toastError);
          }
        }

        console.log('generate-flashcards function response:', data);
        return data as AIFlashcardResponse; // Cast the response
      } catch (error: any) {
        lastError = error;
        retries++;
        
        // If we've reached max retries, throw the last error
        if (retries >= MAX_RETRIES) {
          throw error;
        }
        
        // Exponential backoff between retries
        await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retries)));
      }
    }

    // This should never be reached due to the throw in the loop, but TypeScript needs it
    throw lastError || new Error("Maximum retries reached");
    
  } catch (error: any) {
    // Catch unexpected frontend errors during the process
    console.error('Failed to generate flashcards (service catch):', error);
    try {
      toast({
        title: "Oväntat fel",
        description: "Ett oväntat fel uppstod. Försök igen senare.",
        variant: "destructive",
      });
    } catch (toastError) {
      console.error('Could not show toast:', toastError);
    }
    return { flashcards: [], saved: false, error: error.message };
  } finally {
    // Always reset the request flag when done
    requestInProgress = false;
  }
};

// Create a function to share flashcards via link
export const generateShareableLink = async (flashcardIds: string[]): Promise<string> => {
  try {
    // Call our Supabase Edge Function to create a shareable link
    const { data, error } = await supabase.functions.invoke('create-shareable-link', {
      body: { flashcardIds }
    });

    if (error) {
      console.error('Error creating shareable link:', error);
      toast({
        title: "Kunde inte skapa delbar länk",
        description: "Ett fel uppstod när vi försökte skapa en delbar länk. Försök igen senare.",
        variant: "destructive",
      });
      return '';
    }

    return data.shareableLink;
  } catch (error) {
    console.error('Failed to create shareable link:', error);
    toast({
      title: "Kunde inte skapa delbar länk",
      description: "Ett fel uppstod när vi försökte skapa en delbar länk. Försök igen senare.",
      variant: "destructive",
    });
    return '';
  }
};

// Import shared flashcards
export const importSharedFlashcards = async (shareCode: string): Promise<boolean> => {
  try {
    // Call our Supabase Edge Function to import shared flashcards
    const { data, error } = await supabase.functions.invoke('import-shared-flashcards', {
      body: { shareCode }
    });

    if (error) {
      console.error('Error importing shared flashcards:', error);
      toast({
        title: "Kunde inte importera flashcards",
        description: "Ett fel uppstod när vi försökte importera delade flashcards. Kontrollera att koden är korrekt.",
        variant: "destructive",
      });
      return false;
    }

    toast({
      title: "Flashcards importerade",
      description: `${data.count} flashcards har importerats till din samling.`,
    });
    return true;
  } catch (error) {
    console.error('Failed to import shared flashcards:', error);
    toast({
      title: "Kunde inte importera flashcards",
      description: "Ett fel uppstod när vi försökte importera delade flashcards. Försök igen senare.",
      variant: "destructive",
    });
    return false;
  }
};
