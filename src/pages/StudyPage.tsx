
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useLocalStorage } from '@/context/LocalStorageContext';
import { Flashcard } from '@/components/Flashcard';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Trophy, BookOpen, AlertCircle, CheckCircle } from 'lucide-react';
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
  const [showSummary, setShowSummary] = useState(false);

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
      
      // Fix the type errors by not passing function updates through updateUserStats
      // Instead, use the current values directly
      updateUserStats({
        totalCorrect: correctCount,
        totalIncorrect: incorrectCount,
        cardsLearned: correctCount,
      });
      
      // Mark program as completed if all cards are answered
      if (program && correctCount + incorrectCount === programFlashcards.length) {
        markProgramCompleted(program.id);
      }
    }
  };

  const handleRestartProgram = () => {
    setCurrentIndex(0);
    setCorrectCount(0);
    setIncorrectCount(0);
    setIsFinished(false);
    setShowSummary(false);
  };

  if (!program || programFlashcards.length === 0) {
    return (
      <div className="container px-4 py-12 mx-auto text-center">
        <p className="text-xl text-gray-600">Programmet hittades inte eller innehåller inga flashcards.</p>
        <Button asChild className="mt-4">
          <Link to="/">Tillbaka till startsidan</Link>
        </Button>
      </div>
    );
  }

  const progress = Math.round(((currentIndex) / programFlashcards.length) * 100);

  return (
    <div className="container px-4 py-8 mx-auto">
      <Link to="/" className="inline-flex items-center text-gray-600 hover:text-learny-purple mb-6">
        <ChevronLeft className="h-5 w-5 mr-1" />
        Tillbaka till startsidan
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{program.name}</h1>
        <p className="text-lg text-gray-600">{program.description}</p>
      </div>

      {!isFinished ? (
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center">
              <BookOpen className="h-5 w-5 text-learny-purple mr-2" />
              <span className="text-sm font-medium">
                {currentIndex + 1} av {programFlashcards.length} flashcards
              </span>
            </div>
            <div>
              <span className="text-sm font-medium text-learny-green">
                {correctCount} rätt
              </span>
              <span className="mx-2">•</span>
              <span className="text-sm font-medium text-learny-red">
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
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 max-w-md mx-auto">
              <div className="inline-flex items-center justify-center rounded-full bg-learny-purple/10 p-4 mb-4">
                <Trophy className="h-10 w-10 text-learny-purple" />
              </div>
              
              <h2 className="text-2xl font-bold mb-4">
                Träningspass slutfört!
              </h2>
              
              <p className="text-gray-600 mb-6">
                Du har gått igenom alla flashcards i detta program.
              </p>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-center mb-2">
                    <CheckCircle className="h-5 w-5 text-learny-green mr-2" />
                    <span className="font-medium">Rätt svar</span>
                  </div>
                  <p className="text-2xl font-bold text-learny-green">
                    {correctCount}
                  </p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-center mb-2">
                    <AlertCircle className="h-5 w-5 text-learny-red mr-2" />
                    <span className="font-medium">Fel svar</span>
                  </div>
                  <p className="text-2xl font-bold text-learny-red">
                    {incorrectCount}
                  </p>
                </div>
              </div>
              
              <div className="flex flex-wrap justify-center gap-3">
                <Button variant="outline" onClick={handleRestartProgram}>
                  Öva igen
                </Button>
                
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
