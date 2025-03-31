
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Flashcard as FlashcardComponent } from '@/components/Flashcard';
import { Flashcard } from '@/types/flashcard';
import { toast } from '@/components/ui/use-toast';
import { ChevronLeft, Download, ArrowLeft, ArrowRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { importSharedFlashcards } from '@/services/groqService';
import { useLocalStorage } from '@/context/LocalStorageContext';

const SharePage = () => {
  const { shareCode } = useParams<{ shareCode: string }>();
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { addFlashcard } = useLocalStorage();

  useEffect(() => {
    const fetchSharedFlashcards = async () => {
      if (!shareCode) return;
      
      try {
        // Get the shared flashcards information from the new flashcard_shares table
        const { data: shareData, error: shareError } = await supabase
          .from('flashcard_shares')
          .select('flashcard_ids')
          .eq('code', shareCode)
          .single();
        
        if (shareError) {
          console.error("Error fetching share:", shareError);
          toast({
            title: "Delningskod ogiltig",
            description: "Kunde inte hitta flashcards med denna delningskod.",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }
        
        // Fetch the actual flashcards
        const { data: flashcardsData, error: flashcardsError } = await supabase
          .from('flashcards')
          .select('*')
          .in('id', shareData.flashcard_ids);
          
        if (flashcardsError) {
          console.error("Error fetching flashcards:", flashcardsError);
          toast({
            title: "Kunde inte läsa flashcards",
            description: "Ett fel uppstod när vi försökte hämta de delade flashcards.",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }
        
        // Convert the database flashcards to our Flashcard type
        const typedFlashcards: Flashcard[] = flashcardsData.map(card => ({
          id: card.id,
          question: card.question,
          answer: card.answer,
          category: card.category,
          subcategory: card.subcategory,
          difficulty: card.difficulty as 'beginner' | 'intermediate' | 'advanced' | 'expert',
          reportCount: card.report_count,
          reportReason: card.report_reason,
          isApproved: card.is_approved,
          correct_count: card.correct_count,
          incorrect_count: card.incorrect_count,
          last_reviewed: card.last_reviewed,
          created_at: card.created_at,
          module_id: card.module_id,
          user_id: card.user_id
        }));
        
        setFlashcards(typedFlashcards);
      } catch (error) {
        console.error("Error:", error);
        toast({
          title: "Ett fel uppstod",
          description: "Kunde inte hämta de delade flashcards. Försök igen senare.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSharedFlashcards();
  }, [shareCode]);

  const handleImport = async () => {
    if (!shareCode) return;
    
    try {
      setImporting(true);
      const success = await importSharedFlashcards(shareCode);
      
      if (success) {
        // Also add to local storage
        flashcards.forEach(flashcard => {
          addFlashcard({
            question: flashcard.question,
            answer: flashcard.answer,
            category: flashcard.category,
            difficulty: flashcard.difficulty,
          });
        });
        
        toast({
          title: "Flashcards importerade",
          description: `${flashcards.length} flashcards har lagts till i din samling.`,
        });
      }
    } catch (error) {
      console.error("Import error:", error);
      toast({
        title: "Importen misslyckades",
        description: "Ett fel uppstod. Försök igen senare eller logga in först.",
        variant: "destructive",
      });
    } finally {
      setImporting(false);
    }
  };

  const navigateNext = () => {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const navigatePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <div className="container px-4 py-8 mx-auto">
      <Link to="/" className="inline-flex items-center text-gray-600 hover:text-learny-purple mb-6">
        <ChevronLeft className="h-5 w-5 mr-1" />
        Tillbaka till startsidan
      </Link>

      <h1 className="text-3xl font-bold mb-6">Delade Flashcards</h1>
      
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin w-8 h-8 border-4 border-learny-purple border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Laddar delade flashcards...</p>
        </div>
      ) : flashcards.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <h2 className="text-xl font-semibold mb-2">Inga flashcards hittades</h2>
              <p className="text-gray-600 mb-6">
                Denna delningskod innehåller inga flashcards eller har upphört att gälla.
              </p>
              <Button asChild>
                <Link to="/">Gå till startsidan</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">
                    {flashcards.length} delade flashcards
                  </h2>
                  <p className="text-gray-600">
                    Bläddra bland flashcards för att se dem, eller importera alla till din samling.
                  </p>
                  
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-500">
                      Kort {currentIndex + 1} av {flashcards.length}
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={navigatePrev}
                        disabled={currentIndex === 0}
                      >
                        <ArrowLeft className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={navigateNext}
                        disabled={currentIndex === flashcards.length - 1}
                      >
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full" 
                    onClick={handleImport}
                    disabled={importing}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    {importing ? 'Importerar...' : `Importera alla ${flashcards.length} flashcards`}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
              <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
                Flashcard
              </h2>
              {flashcards[currentIndex] && (
                <FlashcardComponent 
                  flashcard={flashcards[currentIndex]} 
                  showControls={false} 
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SharePage;
