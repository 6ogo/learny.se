// GROQ API service for generating flashcards
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

export interface AIFlashcardRequest {
  topic: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  count?: number;
}

export interface AIFlashcardResponse {
  flashcards: {
    question: string;
    answer: string;
  }[];
  module_id?: string;
  saved?: boolean;
}

export const generateFlashcards = async (request: AIFlashcardRequest): Promise<AIFlashcardResponse> => {
  try {
    console.log('Generating flashcards with GROQ API...', request);
    
    // Call our Supabase Edge Function to securely use the GROQ API
    const { data, error } = await supabase.functions.invoke('generate-flashcards', {
      body: {
        topic: request.topic,
        category: request.category,
        difficulty: request.difficulty,
        count: request.count || 10
      }
    });

    if (error) {
      console.error('Error calling GROQ API:', error);
      toast({
        title: "Kunde inte generera flashcards",
        description: "Ett fel uppstod när vi försökte generera flashcards med AI. Försök igen senare.",
        variant: "destructive",
      });
      return { flashcards: [] };
    }

    console.log('Generated flashcards:', data);
    
    if (data.saved) {
      toast({
        title: "Flashcards skapade",
        description: `${data.flashcards.length} flashcards har genererats och sparats i din samling.`,
      });
    }
    
    return data;
  } catch (error) {
    console.error('Failed to generate flashcards:', error);
    toast({
      title: "Kunde inte generera flashcards",
      description: "Ett fel uppstod när vi försökte generera flashcards med AI. Försök igen senare.",
      variant: "destructive",
    });
    return { flashcards: [] };
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

// Add this default export component for the CreateFlashcards page
const CreateFlashcardsPage = () => {
  return (
    <div>
      <h1>Create Flashcards</h1>
      {/* Add content for the CreateFlashcards page */}
    </div>
  );
};

export default CreateFlashcardsPage;
