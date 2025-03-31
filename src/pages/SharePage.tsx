
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Flashcard as FlashcardComponent } from '@/components/Flashcard';
import { Flashcard } from '@/types/flashcard';
import { getSharedFlashcards, importSharedFlashcards } from '@/services/flashcardSharingService';
import { useToast } from '@/hooks/use-toast';
import { LandingNavBar } from '@/components/LandingNavBar';
import { Footer } from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const SharePage = () => {
  const { shareCode } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [shareTitle, setShareTitle] = useState('Delade Flashcards');
  const [shareDescription, setShareDescription] = useState('');
  
  useEffect(() => {
    const loadShareData = async () => {
      if (!shareCode) {
        setIsLoading(false);
        return;
      }
      
      try {
        // First fetch share metadata
        const { data: shareData, error: shareError } = await supabase
          .from('flashcard_shares')
          .select('*')
          .eq('code', shareCode)
          .single();

        if (shareError) {
          console.error('Error fetching share data:', shareError);
          toast({
            title: 'Ogiltig delningskod',
            description: 'Kunde inte hitta de delade flashcards.',
            variant: 'destructive',
          });
          setIsLoading(false);
          return;
        }

        // The title and description may not exist in the table yet, so we check conditionally
        if (shareData) {
          // Optional properties - need to check if they exist
          const metadata = shareData as any; // Use type assertion for dynamic properties
          if (metadata.title) setShareTitle(metadata.title);
          if (metadata.description) setShareDescription(metadata.description);
        }
        
        // Fetch the actual flashcards
        const cards = await getSharedFlashcards(shareCode);
        
        if (cards.length === 0) {
          toast({
            title: 'Inga flashcards hittades',
            description: 'Denna delningskod innehåller inga flashcards.',
            variant: 'destructive',
          });
        } else {
          setFlashcards(cards);
        }
      } catch (error) {
        console.error('Error loading shared flashcards:', error);
        toast({
          title: 'Ett fel uppstod',
          description: 'Kunde inte ladda delade flashcards.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadShareData();
  }, [shareCode, toast]);
  
  const handleImport = async () => {
    if (!shareCode) return;
    
    if (!user) {
      // Prompt to sign in first
      toast({
        title: 'Logga in först',
        description: 'Du måste vara inloggad för att importera flashcards.',
        variant: 'default',
      });
      // Redirect to auth with return path
      navigate(`/auth?returnTo=/share/${shareCode}`);
      return;
    }
    
    setIsLoading(true);
    const importedCount = await importSharedFlashcards(shareCode);
    setIsLoading(false);
    
    if (importedCount > 0) {
      navigate('/home');
    }
  };
  
  const handleNext = () => {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };
  
  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };
  
  // Custom function to handle when a flashcard is answered correctly or incorrectly
  const handleFlashcardAction = () => {
    // This function can be empty since we just need to satisfy the props interface
    // and we're not tracking card performance on the share page
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <LandingNavBar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-learny-purple"></div>
        </div>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <LandingNavBar />
      
      <div className="flex-1 container mx-auto py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">{shareTitle}</h1>
          {shareDescription && (
            <p className="text-lg mb-8 text-gray-600 dark:text-gray-300">{shareDescription}</p>
          )}
          
          {flashcards.length > 0 ? (
            <div className="space-y-8">
              <div className="text-right mb-4">
                <span className="text-gray-600 dark:text-gray-300">
                  {currentIndex + 1} av {flashcards.length}
                </span>
              </div>
              
              <Card className="h-[400px] overflow-hidden relative">
                <FlashcardComponent 
                  flashcard={flashcards[currentIndex]} 
                  onCorrect={handleFlashcardAction} 
                  onIncorrect={handleFlashcardAction}
                  // Remove the onNext prop since it's not in the component interface
                />
              </Card>
              
              <div className="flex justify-between">
                <Button 
                  onClick={handlePrev} 
                  disabled={currentIndex === 0}
                  variant="outline"
                >
                  Föregående
                </Button>
                
                <Button 
                  onClick={handleNext} 
                  disabled={currentIndex === flashcards.length - 1}
                  variant="outline"
                >
                  Nästa
                </Button>
              </div>
              
              <div className="text-center mt-8">
                <Button 
                  onClick={handleImport} 
                  size="lg" 
                  className="w-full md:w-auto"
                >
                  Importera dessa flashcards
                </Button>
                
                <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">
                  Importera dessa flashcards till din samling för att studera dem när du vill.
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <h2 className="text-2xl font-semibold mb-4">Inga flashcards hittades</h2>
              <p className="mb-8">
                Denna delningskod innehåller inga tillgängliga flashcards eller är ogiltig.
              </p>
              <Button onClick={() => navigate('/')}>
                Gå till startsidan
              </Button>
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default SharePage;
