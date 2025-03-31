
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Flashcard } from '@/types/flashcard';

// Get a shareable link for selected flashcards
export const createShareableLink = async (flashcardIds: string[]): Promise<string | null> => {
  try {
    if (flashcardIds.length === 0) {
      toast({
        title: "Inget att dela",
        description: "Du måste välja minst ett flashcard att dela.",
        variant: "destructive",
      });
      return null;
    }

    const { data, error } = await supabase.functions.invoke('create-shareable-link', {
      body: { flashcardIds }
    });

    if (error) {
      console.error('Error creating shareable link:', error);
      toast({
        title: "Kunde inte skapa delbar länk",
        description: "Ett fel uppstod. Försök igen senare.",
        variant: "destructive",
      });
      return null;
    }

    return data.shareableLink;
  } catch (error) {
    console.error('Error creating shareable link:', error);
    toast({
      title: "Kunde inte skapa delbar länk",
      description: "Ett fel uppstod. Försök igen senare.",
      variant: "destructive",
    });
    return null;
  }
};

// Import flashcards from a share code
export const importSharedFlashcards = async (shareCode: string): Promise<number> => {
  try {
    if (!shareCode) {
      toast({
        title: "Ogiltig delningskod",
        description: "Vänligen ange en giltig delningskod.",
        variant: "destructive",
      });
      return 0;
    }

    const { data, error } = await supabase.functions.invoke('import-shared-flashcards', {
      body: { shareCode }
    });

    if (error) {
      console.error('Error importing shared flashcards:', error);
      toast({
        title: "Kunde inte importera flashcards",
        description: "Ett fel uppstod. Kontrollera att koden är korrekt.",
        variant: "destructive",
      });
      return 0;
    }

    toast({
      title: "Flashcards importerade",
      description: `${data.count} flashcards har importerats till din samling.`,
    });
    
    return data.count || 0;
  } catch (error) {
    console.error('Error importing shared flashcards:', error);
    toast({
      title: "Kunde inte importera flashcards",
      description: "Ett fel uppstod. Försök igen senare.",
      variant: "destructive",
    });
    return 0;
  }
};

// Fetch flashcards by share code (without importing)
export const getSharedFlashcards = async (shareCode: string): Promise<Flashcard[]> => {
  try {
    if (!shareCode) return [];

    // First, get the share information
    const { data: shareData, error: shareError } = await supabase
      .from('flashcard_shares')
      .select('flashcard_ids')
      .eq('code', shareCode)
      .single();

    if (shareError || !shareData) {
      console.error('Error fetching share information:', shareError);
      return [];
    }

    // Then fetch the flashcards
    const { data: flashcardsData, error: flashcardsError } = await supabase
      .from('flashcards')
      .select('*')
      .in('id', shareData.flashcard_ids);

    if (flashcardsError || !flashcardsData) {
      console.error('Error fetching shared flashcards:', flashcardsError);
      return [];
    }

    // Map the database objects to our Flashcard type
    return flashcardsData.map(card => ({
      id: card.id,
      question: card.question,
      answer: card.answer,
      category: card.category,
      subcategory: card.subcategory || undefined,
      difficulty: card.difficulty as 'beginner' | 'intermediate' | 'advanced' | 'expert',
      correctCount: card.correct_count,
      incorrectCount: card.incorrect_count,
      learned: card.learned,
      reviewLater: card.review_later,
      // Include reporting fields
      reportCount: card.report_count,
      reportReason: card.report_reason,
      isApproved: card.is_approved
    }));
  } catch (error) {
    console.error('Error getting shared flashcards:', error);
    return [];
  }
};
