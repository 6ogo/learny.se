
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, RotateCcw, BookmarkPlus } from 'lucide-react';
import { Flashcard as FlashcardType, useLocalStorage } from '@/context/LocalStorageContext';

interface FlashcardProps {
  flashcard: FlashcardType;
  onCorrect?: () => void;
  onIncorrect?: () => void;
  showControls?: boolean;
}

export const Flashcard: React.FC<FlashcardProps> = ({
  flashcard,
  onCorrect,
  onIncorrect,
  showControls = true,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [answered, setAnswered] = useState(false);
  const { updateFlashcard } = useLocalStorage();

  const handleFlip = () => {
    if (!answered) {
      setIsFlipped(!isFlipped);
    }
  };

  const handleCorrect = () => {
    setAnswered(true);
    updateFlashcard(flashcard.id, {
      correctCount: (flashcard.correctCount || 0) + 1,
      lastReviewed: Date.now(),
    });
    if (onCorrect) onCorrect();
  };

  const handleIncorrect = () => {
    setAnswered(true);
    updateFlashcard(flashcard.id, {
      incorrectCount: (flashcard.incorrectCount || 0) + 1,
      lastReviewed: Date.now(),
      reviewLater: true,
    });
    if (onIncorrect) onIncorrect();
  };

  const handleReset = () => {
    setIsFlipped(false);
    setAnswered(false);
  };

  const handleMarkLearned = () => {
    updateFlashcard(flashcard.id, {
      learned: true,
      lastReviewed: Date.now(),
    });
  };

  // Calculate the difficulty indicator
  const getDifficultyColor = () => {
    switch (flashcard.difficulty) {
      case 'beginner':
        return 'bg-learny-green';
      case 'intermediate':
        return 'bg-learny-blue';
      case 'advanced':
        return 'bg-learny-purple';
      case 'expert':
        return 'bg-learny-red';
      default:
        return 'bg-learny-blue';
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <div 
        className="relative w-full aspect-[3/2] cursor-pointer perspective-1000"
        onClick={handleFlip}
      >
        <motion.div
          initial={false}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, type: 'spring', stiffness: 300, damping: 30 }}
          className="w-full h-full relative preserve-3d"
        >
          {/* Front of the card */}
          <motion.div 
            className={cn(
              "absolute w-full h-full bg-white dark:bg-gray-800 rounded-xl p-6 flex flex-col justify-center items-center shadow-lg border border-gray-200 dark:border-gray-700 backface-hidden",
              flashcard.learned && "bg-gray-50 dark:bg-gray-700 border-green-200 dark:border-green-800"
            )}
          >
            <div className={`absolute top-4 left-4 w-3 h-3 rounded-full ${getDifficultyColor()}`} />
            
            {flashcard.learned && (
              <div className="absolute top-3 right-3">
                <CheckCircle className="w-5 h-5 text-learny-green" />
              </div>
            )}
            
            <p className="text-xl md:text-2xl font-medium text-center dark:text-white">
              {flashcard.question}
            </p>
            
            <div className="absolute bottom-4 left-0 right-0 text-center text-sm text-gray-400 dark:text-gray-300">
              Klicka för att vända kortet
            </div>
          </motion.div>

          {/* Back of the card */}
          <motion.div
            style={{ rotateY: 180 }}
            className="absolute w-full h-full bg-white dark:bg-gray-800 rounded-xl p-6 flex flex-col justify-center items-center shadow-lg border border-gray-200 dark:border-gray-700 backface-hidden"
          >
            <div className={`absolute top-4 left-4 w-3 h-3 rounded-full ${getDifficultyColor()}`} />
            
            <p className="text-xl md:text-2xl font-medium mb-4 text-center text-learny-purple dark:text-learny-purple-dark">
              Svar:
            </p>
            
            <p className="text-lg text-center dark:text-white">
              {flashcard.answer}
            </p>
          </motion.div>
        </motion.div>
      </div>

      {showControls && (
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {!answered ? (
            <>
              <Button
                variant="outline"
                size="lg"
                className="border-learny-red hover:bg-learny-red/5 hover:text-learny-red dark:border-learny-red dark:hover:bg-learny-red/20 dark:text-white dark:hover:text-learny-red-dark w-32"
                onClick={handleIncorrect}
              >
                <XCircle className="mr-2 h-5 w-5" />
                Fel
              </Button>
              
              <Button
                size="lg"
                className="bg-learny-green hover:bg-learny-green/90 dark:bg-learny-green-dark dark:hover:bg-learny-green/90 w-32"
                onClick={handleCorrect}
              >
                <CheckCircle className="mr-2 h-5 w-5" />
                Rätt
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                className="mt-2 border-learny-purple hover:bg-learny-purple/5 hover:text-learny-purple dark:border-learny-purple-dark dark:hover:bg-learny-purple/20 dark:text-white dark:hover:text-learny-purple-dark w-32"
                onClick={handleMarkLearned}
              >
                <BookmarkPlus className="mr-2 h-5 w-5" />
                Markera inlärd
              </Button>
            </>
          ) : (
            <Button
              variant="outline"
              size="lg"
              className="mt-2 dark:border-gray-600 dark:text-white"
              onClick={handleReset}
            >
              <RotateCcw className="mr-2 h-5 w-5" />
              Nästa kort
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
