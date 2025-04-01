// src/components/Flashcard.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ThumbsUp, ThumbsDown, RotateCw, CheckCircle, XCircle } from 'lucide-react'; // Added CheckCircle, XCircle
import { Flashcard as FlashcardType } from '@/types/flashcard';
import { cn } from '@/lib/utils';

interface FlashcardProps {
  flashcard: FlashcardType;
  onCorrect: (id: string) => void;
  onIncorrect: (id: string) => void;
  onNext: () => void;
  showControls?: boolean;
}

// Use standard named export
export const Flashcard: React.FC<FlashcardProps> = ({
  flashcard,
  onCorrect,
  onIncorrect,
  onNext,
  showControls = true,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [answerStatus, setAnswerStatus] = useState<'correct' | 'incorrect' | null>(null);

  // Reset state when flashcard prop changes
  useEffect(() => {
    setIsFlipped(false);
    setShowAnswer(false);
    setAnswerStatus(null);
  }, [flashcard.id]); // Depend on flashcard.id

  const handleFlip = () => {
    if (answerStatus !== null) return; // Don't allow flipping after answering

    setIsFlipped(!isFlipped);
    // Show answer slightly after flip animation completes
    if (!isFlipped) {
      setTimeout(() => {
         if (!isFlipped) { // Check again in case it was flipped back quickly
            setShowAnswer(true);
         }
      }, 300);
    } else {
        // If flipping back to question, hide answer immediately
        setShowAnswer(false);
    }
  };

  const handleAnswer = (correct: boolean) => {
    if (answerStatus !== null) return; // Prevent multiple answers

    setAnswerStatus(correct ? 'correct' : 'incorrect');
    if (correct) {
      onCorrect(flashcard.id);
    } else {
      onIncorrect(flashcard.id);
    }

    // Move to next card after a short delay for visual feedback
    const nextTimeout = setTimeout(() => {
        onNext();
    }, 1000); // Adjust delay if needed

    // Cleanup timeout if component unmounts
    return () => clearTimeout(nextTimeout);
  };

  return (
    <div className="perspective w-full h-[300px] md:h-[400px]">
      <motion.div
        className={cn(
            "relative w-full h-full transition-transform duration-500 transform-style-preserve-3d flashcard-shadow rounded-xl",
            // Apply rotation class directly based on isFlipped state
            isFlipped ? 'rotate-y-180' : ''
        )}
        // Removed Framer Motion animation for rotateY as CSS handles it
        transition={{ duration: 0.5 }}
      >
        {/* Front of Card */}
        <div className="absolute w-full h-full backface-hidden bg-card border border-border rounded-xl p-6 flex flex-col justify-center items-center text-center cursor-pointer" onClick={handleFlip}>
          <p className="text-lg md:text-xl font-medium text-card-foreground">{flashcard.question}</p>
          <span className="mt-4 text-xs text-muted-foreground">(Klicka för att se svaret)</span>
        </div>

        {/* Back of Card */}
        <div className="absolute w-full h-full backface-hidden bg-card border border-border rounded-xl p-6 flex flex-col justify-between items-center text-center transform rotate-y-180">
           {/* Answer text area */}
           <div className="flex-grow flex items-center justify-center">
                <p className="text-lg md:text-xl text-card-foreground">{flashcard.answer}</p>
           </div>

          {/* Controls Area */}
          {showControls && (
            <div className="w-full mt-4 pt-4 border-t border-border">
              {/* Show feedback buttons only if answer is shown and not yet answered */}
              {showAnswer && answerStatus === null && (
                 <>
                    <p className="text-sm text-muted-foreground mb-3">Hur gick det?</p>
                    <div className="flex justify-center space-x-4">
                        <Button
                            variant="outline"
                            size="lg"
                            className="border-learny-red text-learny-red hover:bg-learny-red/10 flex-1"
                            onClick={() => handleAnswer(false)}
                        >
                            <ThumbsDown className="mr-2 h-5 w-5" /> Fel
                        </Button>
                        <Button
                            variant="outline"
                            size="lg"
                            className="border-learny-green text-learny-green hover:bg-learny-green/10 flex-1"
                            onClick={() => handleAnswer(true)}
                        >
                            <ThumbsUp className="mr-2 h-5 w-5" /> Rätt
                        </Button>
                    </div>
                 </>
              )}
              {/* Show status indicator after answering */}
              {answerStatus === 'correct' && (
                  <div className="flex justify-center items-center text-learny-green">
                      <CheckCircle className="h-6 w-6 mr-2"/> Korrekt!
                  </div>
              )}
              {answerStatus === 'incorrect' && (
                  <div className="flex justify-center items-center text-learny-red">
                      <XCircle className="h-6 w-6 mr-2"/> Försök igen nästa gång!
                  </div>
              )}
               {/* "Next Card" button appears after answering */}
               {answerStatus !== null && (
                 <Button
                    variant="secondary"
                    size="sm"
                    className="mt-4 w-full"
                    onClick={onNext} // Directly call onNext
                 >
                    Nästa kort <RotateCw className="ml-2 h-4 w-4"/>
                 </Button>
               )}
            </div>
          )}
           {/* Allow flipping back to question if answer hasn't been submitted */}
           {isFlipped && answerStatus === null && (
               <Button variant="ghost" size="sm" className="absolute bottom-4 right-4 text-xs text-muted-foreground" onClick={handleFlip}>
                   Visa fråga igen
               </Button>
           )}
        </div>
      </motion.div>
    </div>
  );
};