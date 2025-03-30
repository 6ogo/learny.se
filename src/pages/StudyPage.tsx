
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useLocalStorage } from '@/context/LocalStorageContext';
import { Flashcard } from '@/components/Flashcard';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Trophy, BookOpen, AlertCircle, CheckCircle, FileQuestion } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { motion, AnimatePresence } from 'framer-motion';

const StudyPage = () => {
  const { programId } = useParams<{ programId: string }>();
  const navigate = useNavigate();
  const { 
    getProgram, 
    getFlashcardsByProgram, 
    updateUserStats, 
    markProgramCompleted 
  } = useLocalStorage();

  const program = getProgram(programId || '');
  const programFlashcards = getFlashcardsByProgram(programId || '');
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    if (!program) {
      navigate('/');
    }
    
    // Update streak
    updateUserStats({});
  }, [program, navigate, updateUserStats]);

  const handleCorrect = () => {
    setCorrectCount(prev => prev + 1);
    handleNextCard();
  };

  const handleIncorrect = () => {
    setIncorrectCount(prev => prev + 1);
    handleNextCard();
  };

  const handleNextCard = () => {
    if (currentIndex < programFlashcards.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setIsFinished(true);
      
      // Update user stats with the current values
      updateUserStats({
        totalCorrect: correctCount + 1, // +1 because we just answered correctly
        totalIncorrect: incorrectCount,
        cardsLearned: correctCount + 1,
      });
      
      // Mark program as completed if all cards are answered
      if (program) {
        markProgramCompleted(program.id);
      }
    }
  };

  const handleRestartProgram = () => {
    setCurrentIndex(0);
    setCorrectCount(0);
    setIncorrectCount(0);
    setIsFinished(false);
  };

  const handleStartExam = () => {
    navigate(`/exam/${programId}`);
  };

  if (!program || programFlashcards.length === 0) {
    return (
      <div className="container px-4 py-12 mx-auto text-center">
        <p className="text-xl text-gray-600 dark:text-gray-300">Programmet hittades inte eller innehåller inga flashcards.</p>
        <Button asChild className="mt-4">
          <Link to="/">Tillbaka till startsidan</Link>
        </Button>
      </div>
    );
  }

  // Calculate progress (add 1 to currentIndex for user-friendly numbering)
  const progress = Math.round(((currentIndex) / programFlashcards.length) * 100);

  return (
    <div className="container px-4 py-8 mx-auto">
      <Link to="/" className="inline-flex items-center text-gray-600 dark:text-gray-300 hover:text-learny-purple dark:hover:text-learny-purple-dark mb-6">
        <ChevronLeft className="h-5 w-5 mr-1" />
        Tillbaka till startsidan
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 dark:text-white">{program.name}</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">{program.description}</p>
      </div>

      {!isFinished ? (
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center">
              <BookOpen className="h-5 w-5 text-learny-purple dark:text-learny-purple-dark mr-2" />
              <span className="text-sm font-medium dark:text-gray-300">
                {currentIndex + 1} av {programFlashcards.length} flashcards
              </span>
            </div>
            <div>
              <span className="text-sm font-medium text-learny-green dark:text-learny-green-dark">
                {correctCount} rätt
              </span>
              <span className="mx-2 dark:text-gray-400">•</span>
              <span className="text-sm font-medium text-learny-red dark:text-learny-red-dark">
                {incorrectCount} fel
              </span>
            </div>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      ) : null}

      <AnimatePresence mode="wait">
        {!isFinished ? (
          <motion.div
            key="flashcard"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Flashcard 
              flashcard={programFlashcards[currentIndex]} 
              onCorrect={handleCorrect}
              onIncorrect={handleIncorrect}
            />
          </motion.div>
        ) : (
          <motion.div
            key="summary"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-center py-8"
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm border border-gray-100 dark:border-gray-700 max-w-md mx-auto">
              <div className="inline-flex items-center justify-center rounded-full bg-learny-purple/10 dark:bg-learny-purple-dark/10 p-4 mb-4">
                <Trophy className="h-10 w-10 text-learny-purple dark:text-learny-purple-dark" />
              </div>
              
              <h2 className="text-2xl font-bold mb-4 dark:text-white">
                Träningspass slutfört!
              </h2>
              
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Du har gått igenom alla flashcards i detta program.
              </p>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-center mb-2">
                    <CheckCircle className="h-5 w-5 text-learny-green dark:text-learny-green-dark mr-2" />
                    <span className="font-medium dark:text-white">Rätt svar</span>
                  </div>
                  <p className="text-2xl font-bold text-learny-green dark:text-learny-green-dark">
                    {correctCount}
                  </p>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-center mb-2">
                    <AlertCircle className="h-5 w-5 text-learny-red dark:text-learny-red-dark mr-2" />
                    <span className="font-medium dark:text-white">Fel svar</span>
                  </div>
                  <p className="text-2xl font-bold text-learny-red dark:text-learny-red-dark">
                    {incorrectCount}
                  </p>
                </div>
              </div>
              
              <div className="flex flex-wrap justify-center gap-3">
                <Button variant="outline" onClick={handleRestartProgram}>
                  Öva igen
                </Button>
                
                {program.hasExam && (
                  <Button 
                    onClick={handleStartExam}
                    className="flex items-center gap-2"
                  >
                    <FileQuestion className="h-4 w-4" />
                    Ta provet
                  </Button>
                )}
                
                <Button asChild>
                  <Link to="/">Tillbaka till startsidan</Link>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StudyPage;
