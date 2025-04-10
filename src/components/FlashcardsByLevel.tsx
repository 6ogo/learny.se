
import React, { useState, useEffect, useRef } from 'react';
import { useLocalStorage } from '@/context/LocalStorageContext';
import { Flashcard } from '@/components/Flashcard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FlashcardsByLevelProps {
  categoryId: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

// Define helper functions first, before they're used
const getDifficultyLabel = (difficulty: string) => {
  switch (difficulty) {
    case 'beginner': return 'Nybörjare';
    case 'intermediate': return 'Medel';
    case 'advanced': return 'Avancerad';
    case 'expert': return 'Expert';
    default: return difficulty;
  }
};

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'beginner': return 'border-learny-green dark:border-learny-green-dark';
    case 'intermediate': return 'border-learny-blue dark:border-learny-blue-dark';
    case 'advanced': return 'border-learny-purple dark:border-learny-purple-dark';
    case 'expert': return 'border-learny-red dark:border-learny-red-dark';
    default: return 'border-gray-500';
  }
};

export const FlashcardsByLevel: React.FC<FlashcardsByLevelProps> = ({ categoryId, difficulty }) => {
  const { getFlashcardsByCategory, fetchFlashcardsByCategory } = useLocalStorage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [filteredFlashcards, setFilteredFlashcards] = useState<any[]>([]);
  const [isFlipped, setIsFlipped] = useState(false);
  const dataFetched = useRef(false);
  
  // Load flashcards when component mounts or categoryId/difficulty changes
  useEffect(() => {
    setIsLoading(true);
    
    // First try to get cards from local cache
    const cachedCards = getFlashcardsByCategory(categoryId).filter(card => card.difficulty === difficulty);
    
    if (cachedCards.length > 0 && dataFetched.current) {
      // Use cached data if available and we've already attempted a fetch
      setFilteredFlashcards(cachedCards);
      setCurrentIndex(0);
      setIsFlipped(false);
      setIsLoading(false);
    } else {
      // Otherwise fetch from the database
      const loadData = async () => {
        try {
          await fetchFlashcardsByCategory(categoryId);
          // After fetching, get the updated cards from cache
          const updatedCards = getFlashcardsByCategory(categoryId).filter(card => card.difficulty === difficulty);
          setFilteredFlashcards(updatedCards);
          dataFetched.current = true; // Mark that we've attempted a fetch
        } catch (error) {
          console.error('Error loading flashcards:', error);
          // If fetch fails, still use any available cached cards
          setFilteredFlashcards(cachedCards);
        } finally {
          setCurrentIndex(0);
          setIsFlipped(false);
          setIsLoading(false);
        }
      };
      loadData();
    }
  }, [categoryId, difficulty, getFlashcardsByCategory, fetchFlashcardsByCategory]);
  
  if (isLoading) {
    return (
      <Card className={cn("mb-8 border-l-4", getDifficultyColor(difficulty))}>
        <CardHeader>
          <CardTitle>{getDifficultyLabel(difficulty)}</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center items-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          <span className="ml-2">Laddar flashcards...</span>
        </CardContent>
      </Card>
    );
  }
  
  if (filteredFlashcards.length === 0) {
    return null;
  }

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handlePrevious = () => {
    setIsFlipped(false);
    setCurrentIndex(prev => (prev > 0 ? prev - 1 : filteredFlashcards.length - 1));
  };

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex(prev => (prev < filteredFlashcards.length - 1 ? prev + 1 : 0));
  };

  return (
    <Card className={cn("mb-8 border-l-4", getDifficultyColor(difficulty))}>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>{getDifficultyLabel(difficulty)} ({filteredFlashcards.length} kort)</span>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={handlePrevious}
              disabled={filteredFlashcards.length <= 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={handleNext}
              disabled={filteredFlashcards.length <= 1}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {filteredFlashcards.length > 0 && (
          <div className="h-[250px]">
            <Flashcard 
              flashcard={filteredFlashcards[currentIndex]}
              isFlipped={isFlipped}
              onFlip={handleFlip}
              showInteractions={true}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};
