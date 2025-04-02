
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Flashcard as FlashcardType } from '@/types/flashcard';
import { cn } from '@/lib/utils';

export interface FlashcardProps {
  flashcard: FlashcardType;
  isFlipped?: boolean;
  onFlip?: () => void;
  showControls?: boolean;
  onCorrect?: () => void;
  onIncorrect?: () => void;
  onNext?: () => void;
}

export const Flashcard: React.FC<FlashcardProps> = ({ 
  flashcard, 
  isFlipped = false, 
  onFlip,
  showControls = false,
  onCorrect = () => {},
  onIncorrect = () => {},
  onNext = () => {}
}) => {
  const [internalFlipped, setInternalFlipped] = useState(false);
  
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
        return { label: 'Nybörjare', color: 'bg-green-500' };
      case 'intermediate':
        return { label: 'Medel', color: 'bg-yellow-500' };
      case 'advanced':
        return { label: 'Avancerad', color: 'bg-orange-500' };
      case 'expert':
        return { label: 'Expert', color: 'bg-red-500' };
      default:
        return { label: difficulty, color: 'bg-gray-500' };
    }
  };
  
  const difficultyInfo = getDifficultyDisplay(flashcard.difficulty);
  
  return (
    <div 
      className="relative perspective-1000 w-full cursor-pointer"
      onClick={handleClick}
    >
      <Card 
        className={cn(
          "w-full transition-transform duration-500 transform-style-3d min-h-[200px]",
          flipped ? "rotate-y-180" : ""
        )}
      >
        {/* Front side */}
        <CardContent 
          className={cn(
            "absolute w-full h-full backface-hidden p-6 flex flex-col",
            !flipped ? "visible" : "invisible"
          )}
        >
          <div className="flex-1 flex flex-col justify-center">
            <p className="text-xl font-medium text-center">{flashcard.question}</p>
          </div>
          
          <div className="flex justify-between items-center mt-4">
            <p className="text-sm text-gray-500">Klicka för att visa svar</p>
            <Badge className={difficultyInfo.color}>{difficultyInfo.label}</Badge>
          </div>
        </CardContent>
        
        {/* Back side */}
        <CardContent 
          className={cn(
            "absolute w-full h-full backface-hidden rotate-y-180 p-6 flex flex-col",
            flipped ? "visible" : "invisible"
          )}
        >
          <div className="flex-1 flex flex-col justify-center">
            <p className="text-xl font-medium text-center">{flashcard.answer}</p>
          </div>
          
          <div className="flex justify-between items-center mt-4">
            <p className="text-sm text-gray-500">Klicka för att visa fråga</p>
            <Badge className={difficultyInfo.color}>{difficultyInfo.label}</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
