
import React, { useState, useEffect } from 'react';
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

export const FlashcardsByLevel: React.FC<FlashcardsByLevelProps> = ({ categoryId, difficulty }) => {
  const { getFlashcardsByCategory } = useLocalStorage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [filteredFlashcards, setFilteredFlashcards] = useState<any[]>([]);
  const [isFlipped, setIsFlipped] = useState(false);
  
  // Load flashcards when component mounts or categoryId/difficulty changes
  useEffect(() => {
    setIsLoading(true);
    
    // Filter flashcards for this category and difficulty from local storage
    const cards = getFlashcardsByCategory(categoryId).filter(card => card.difficulty === difficulty);
    setFilteredFlashcards(cards);
    setCurrentIndex(0);
    setIsFlipped(false);
    setIsLoading(false);
  }, [categoryId, difficulty, getFlashcardsByCategory]);
  
  if (isLoading) {
    return (
      <Card className={cn("mb-8 border-l-4", getDifficultyColor())}>
        <CardHeader>
          <CardTitle>{getDifficultyLabel()}</CardTitle>
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

  const getDifficultyLabel = () => {
    switch (difficulty) {
      case 'beginner': return 'Nybörjare';
      case 'intermediate': return 'Medel';
      case 'advanced': return 'Avancerad';
      case 'expert': return 'Expert';
      default: return difficulty;
    }
  };
  
  const getDifficultyColor = () => {
    switch (difficulty) {
      case 'beginner': return 'border-learny-green dark:border-learny-green-dark';
      case 'intermediate': return 'border-learny-blue dark:border-learny-blue-dark';
      case 'advanced': return 'border-learny-purple dark:border-learny-purple-dark';
      case 'expert': return 'border-learny-red dark:border-learny-red-dark';
    }
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
    <Card className={cn("mb-8 border-l-4", getDifficultyColor())}>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>{getDifficultyLabel()} ({filteredFlashcards.length} kort)</span>
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
      <CardContent>
        {filteredFlashcards.length > 0 && (
          <Flashcard 
            flashcard={filteredFlashcards[currentIndex]}
            isFlipped={isFlipped}
            onFlip={handleFlip}
            showInteractions={true}
          />
        )}
      </CardContent>
    </Card>
  );
};
