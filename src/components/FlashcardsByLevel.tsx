
import React, { useState } from 'react';
import { useLocalStorage } from '@/context/LocalStorageContext';
import { Flashcard } from '@/components/Flashcard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FlashcardsByLevelProps {
  categoryId: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

export const FlashcardsByLevel: React.FC<FlashcardsByLevelProps> = ({ categoryId, difficulty }) => {
  const { getFlashcardsByCategory } = useLocalStorage();
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Get flashcards for this category and difficulty
  const flashcards = getFlashcardsByCategory(categoryId).filter(card => card.difficulty === difficulty);
  
  if (flashcards.length === 0) {
    return null;
  }

  const getDifficultyLabel = () => {
    switch (difficulty) {
      case 'beginner': return 'Nybörjare';
      case 'intermediate': return 'Medel';
      case 'advanced': return 'Avancerad';
      case 'expert': return 'Expert';
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
    setCurrentIndex(prev => (prev > 0 ? prev - 1 : flashcards.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex(prev => (prev < flashcards.length - 1 ? prev + 1 : 0));
  };

  return (
    <Card className={cn("mb-8 border-l-4", getDifficultyColor())}>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>{getDifficultyLabel()} ({flashcards.length} kort)</span>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={handlePrevious}
              disabled={flashcards.length <= 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={handleNext}
              disabled={flashcards.length <= 1}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {flashcards.length > 0 && (
          <Flashcard flashcard={flashcards[currentIndex]} />
        )}
      </CardContent>
    </Card>
  );
};
