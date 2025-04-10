
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

export const generateFlashcards = async (request: AIFlashcardRequest): Promise<AIFlashcardResponse> => {
  try {
    console.log('Invoking Supabase function generate-flashcards...', request);

    const { data, error: functionError } = await supabase.functions.invoke('generate-flashcards', {
      body: {
        topic: request.topic,
        category: request.category,
        difficulty: request.difficulty,
        count: request.count || 10,
        context: request.context || '',
        language: request.language || 'swedish' // Default to Swedish if not specified
      }
    });

    // Handle errors during function invocation itself
    if (functionError) {
      console.error('Error invoking Supabase function:', functionError);
      toast({
        title: "Kommunikationsfel",
        description: "Kunde inte kontakta AI-tjänsten. Kontrollera din anslutning.",
        variant: "destructive",
      });
      // Return an empty response matching the interface
      return { flashcards: [], saved: false, error: functionError.message };
    }

    // Handle errors returned *from* the function execution
    if (data.error) {
         console.error('Error from generate-flashcards function:', data.error, data.details);
         toast({
           title: "Kunde inte generera flashcards",
           description: data.error || "Ett fel uppstod hos AI-tjänsten.",
           variant: "destructive",
         });
         // Return the data which includes the error message
         return { flashcards: data.flashcards || [], saved: false, error: data.error };
    }

     // Handle informational messages from function (e.g., no cards generated)
     if (data.message){
         toast({
            title: "Info",
            description: data.message,
            variant: "default"
         });
     }


    // Handle success (saved or not saved)
    if (data.saved) {
      toast({
        title: "Flashcards skapade!",
        description: `${data.flashcards.length} flashcards har genererats och sparats i din samling.`,
      });
    } else if (data.flashcards?.length > 0 && !data.saved && !data.error && !data.message) {
        // Only show this if no specific message/error was returned
      toast({
        title: "Flashcards genererade (ej sparade)",
        description: "Logga in för att spara flashcards till din samling.",
        variant: "default" // Use default variant for informational message
      });
    }

    console.log('generate-flashcards function response:', data);
    return data as AIFlashcardResponse; // Cast the response

  } catch (error: any) {
    // Catch unexpected frontend errors during the process
    console.error('Failed to generate flashcards (service catch):', error);
    toast({
      title: "Oväntat fel",
      description: "Ett oväntat fel uppstod. Försök igen senare.",
      variant: "destructive",
    });
    return { flashcards: [], saved: false, error: error.message };
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
