
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookmarkIcon, BookmarkCheck, RotateCw } from 'lucide-react';
import { Flashcard as FlashcardType } from '@/types/flashcard';
import { cn } from '@/lib/utils';
import { useLocalStorage } from '@/context/LocalStorageContext';

export interface FlashcardProps {
  flashcard: FlashcardType;
  isFlipped?: boolean;
  onFlip?: () => void;
  showControls?: boolean;
  onCorrect?: () => void;
  onIncorrect?: () => void;
  onNext?: () => void;
  showInteractions?: boolean;
}

export const Flashcard: React.FC<FlashcardProps> = ({ 
  flashcard, 
  isFlipped = false, 
  onFlip,
  showControls = false,
  onCorrect = () => {},
  onIncorrect = () => {},
  onNext = () => {},
  showInteractions = false
}) => {
  const [internalFlipped, setInternalFlipped] = useState(false);
  const { updateFlashcardUserInteraction } = useLocalStorage();
  
  // If external control is provided, use it, otherwise use internal state
  const flipped = onFlip ? isFlipped : internalFlipped;
  
  const handleClick = () => {
    if (onFlip) {
      onFlip();
    } else {
      setInternalFlipped(!internalFlipped);
    }
  };
  
  const getDifficultyDisplay = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return { label: 'Nybörjare', color: 'bg-learny-green dark:bg-learny-green-dark' };
      case 'intermediate':
        return { label: 'Medel', color: 'bg-learny-blue dark:bg-learny-blue-dark' };
      case 'advanced':
        return { label: 'Avancerad', color: 'bg-learny-purple dark:bg-learny-purple-dark' };
      case 'expert':
        return { label: 'Expert', color: 'bg-learny-red dark:bg-learny-red-dark' };
      default:
        return { label: difficulty, color: 'bg-gray-500' };
    }
  };
  
  const difficultyInfo = getDifficultyDisplay(flashcard.difficulty);
  
  const toggleLearnedStatus = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card flip
    updateFlashcardUserInteraction(flashcard.id, { learned: !flashcard.learned });
  };
  
  const toggleReviewLater = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card flip
    updateFlashcardUserInteraction(flashcard.id, { reviewLater: !flashcard.reviewLater });
  };
  
  return (
    <div 
      className={`flip-card-container ${flipped ? 'flipped' : ''} relative w-full cursor-pointer card-enter card-shadow`}
      onClick={handleClick}
    >
      <div className="flip-card-inner">
        {/* Front side */}
        <Card className="flip-card-front p-6 flex flex-col border rounded-xl">
          <CardContent className="flex-1 flex flex-col justify-center p-0">
            <p className="text-xl font-medium text-center flip-text">{flashcard.question}</p>
          </CardContent>
          
          <div className="flex justify-between items-center mt-4">
            <p className="text-sm text-gray-500">Klicka för att visa svar</p>
            <div className="flex items-center gap-2">
              {showInteractions && (
                <>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={toggleLearnedStatus}
                    className={cn(flashcard.learned ? "text-green-500" : "text-gray-400")}
                    title={flashcard.learned ? "Markera som ej inlärd" : "Markera som inlärd"}
                  >
                    {flashcard.learned ? <BookmarkCheck /> : <BookmarkIcon />}
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={toggleReviewLater}
                    className={cn(flashcard.reviewLater ? "text-blue-500" : "text-gray-400")}
                    title={flashcard.reviewLater ? "Ta bort från granska senare" : "Granska senare"}
                  >
                    <RotateCw />
                  </Button>
                </>
              )}
              <Badge className={difficultyInfo.color}>{difficultyInfo.label}</Badge>
            </div>
          </div>
        </Card>
        
        {/* Back side */}
        <Card className="flip-card-back p-6 flex flex-col border rounded-xl">
          <CardContent className="flex-1 flex flex-col justify-center p-0">
            <p className="text-xl font-medium text-center flip-text flip-text-back">{flashcard.answer}</p>
          </CardContent>
          
          <div className="flex justify-between items-center mt-4">
            <p className="text-sm text-gray-500">Klicka för att visa fråga</p>
            <div className="flex items-center gap-2">
              {showInteractions && (
                <>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={toggleLearnedStatus}
                    className={cn(flashcard.learned ? "text-green-500" : "text-gray-400")}
                    title={flashcard.learned ? "Markera som ej inlärd" : "Markera som inlärd"}
                  >
                    {flashcard.learned ? <BookmarkCheck /> : <BookmarkIcon />}
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={toggleReviewLater}
                    className={cn(flashcard.reviewLater ? "text-blue-500" : "text-gray-400")}
                    title={flashcard.reviewLater ? "Ta bort från granska senare" : "Granska senare"}
                  >
                    <RotateCw />
                  </Button>
                </>
              )}
              <Badge className={difficultyInfo.color}>{difficultyInfo.label}</Badge>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
