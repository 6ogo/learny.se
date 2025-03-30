
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, RotateCcw, BookmarkPlus, BookmarkX } from 'lucide-react';
import { Flashcard as FlashcardType } from '@/types/flashcard';
import { useLocalStorage } from '@/context/LocalStorageContext';
import { toast } from "@/hooks/use-toast";

// Array of positive feedback messages
const POSITIVE_FEEDBACK = [
  "Bra jobbat!",
  "Helt rätt!",
  "Perfekt!",
  "Utmärkt!",
  "Bravo!",
  "Mycket bra!",
  "Korrekt!",
  "Snyggt!",
  "Rätt tänkt!",
  "Imponerande!",
  "Bra minne!",
  "Du klarade det!",
  "Helt korrekt!",
  "Fantastiskt!",
  "Briljant!",
  "Bra gjort!",
  "Tummen upp!",
  "Du har förstått det!",
  "Du har koll på det här!",
  "Fortsätt så!"
];

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
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const { updateFlashcard } = useLocalStorage();

  // Reset states when flashcard changes
  useEffect(() => {
    setIsFlipped(false);
    setAnswered(false);
    setFeedbackMessage(null);
  }, [flashcard.id]);

  const handleFlip = () => {
    if (!answered) {
      setIsFlipped(!isFlipped);
    }
  };

  const getRandomPositiveFeedback = () => {
    return POSITIVE_FEEDBACK[Math.floor(Math.random() * POSITIVE_FEEDBACK.length)];
  };

  const handleCorrect = () => {
    setAnswered(true);
    const feedback = getRandomPositiveFeedback();
    setFeedbackMessage(feedback);
    
    updateFlashcard(flashcard.id, {
      correctCount: (flashcard.correctCount || 0) + 1,
      lastReviewed: Date.now(),
    });
    
    if (onCorrect) onCorrect();
  };

  const handleIncorrect = () => {
    setAnswered(true);
    setFeedbackMessage("Du behöver träna mer på det här. Fortsätt öva!");
    
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
    setFeedbackMessage(null);
  };

  const toggleLearned = () => {
    const newLearnedState = !flashcard.learned;
    updateFlashcard(flashcard.id, {
      learned: newLearnedState,
      lastReviewed: Date.now(),
    });
    
    toast({
      title: newLearnedState ? "Markerad som inlärd" : "Markering borttagen",
      description: newLearnedState 
        ? "Detta kort har markerats som inlärt i din profil."
        : "Detta kort är inte längre markerat som inlärt.",
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

      {/* Feedback message */}
      <AnimatePresence>
        {feedbackMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={cn(
              "mt-4 p-3 rounded-lg text-center font-medium",
              feedbackMessage.includes("träna") 
                ? "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300"
                : "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300"
            )}
          >
            {feedbackMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {showControls && (
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {!answered ? (
            <div className="flex flex-wrap justify-center gap-2">
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
                className="border-learny-purple hover:bg-learny-purple/5 hover:text-learny-purple dark:border-learny-purple-dark dark:hover:bg-learny-purple/20 dark:text-white dark:hover:text-learny-purple-dark w-32"
                onClick={toggleLearned}
              >
                {flashcard.learned ? (
                  <>
                    <BookmarkX className="mr-2 h-5 w-5" />
                    Avmarkera
                  </>
                ) : (
                  <>
                    <BookmarkPlus className="mr-2 h-5 w-5" />
                    Markera inlärd
                  </>
                )}
              </Button>
            </div>
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
