import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useLocalStorage } from '@/context/LocalStorageContext';
import { useAuth } from '@/context/AuthContext';
import { Flashcard } from '@/components/Flashcard';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Trophy, BookOpen, AlertCircle, CheckCircle, FileQuestion, RefreshCcw } from 'lucide-react'; // Added RefreshCcw
import { Progress } from '@/components/ui/progress';
import { motion, AnimatePresence } from 'framer-motion';
import { Flashcard as FlashcardType } from '@/types/flashcard'; // Import type
import { startFlashcardSession, endFlashcardSession, trackFlashcardInteraction } from '@/utils/analytics';


// Define a type for the answers being tracked
type AnswerRecord = {
  question: string;
  userAnswer?: string; // User answer might not be available if skipped
  correctAnswer: string;
  isCorrect: boolean;
};

const StudyPage = () => {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<number>(0);
  const { programId } = useParams<{ programId: string }>();
  const navigate = useNavigate();
  const {
    getProgram,
    getFlashcardsByProgram,
    updateUserStats,
    markProgramCompleted,
    userStats // Get current userStats
  } = useLocalStorage();
  const { addAchievement } = useAuth();

  const program = getProgram(programId || '');
  const programFlashcards = getFlashcardsByProgram(programId || '');

  const [currentIndex, setCurrentIndex] = useState(0);
  const [sessionCorrectCount, setSessionCorrectCount] = useState(0);
  const [sessionIncorrectCount, setSessionIncorrectCount] = useState(0);
  const [incorrectAnswers, setIncorrectAnswers] = useState<AnswerRecord[]>([]); // Store only incorrect answers for review
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    if (!program) {
      navigate('/');
    }
    // Update streak
    updateUserStats({});
  }, [program, navigate, updateUserStats]);


  const handleCorrect = () => {
    setSessionCorrectCount(prev => prev + 1);
    // No need to save to userAnswers here, handleNextCard will do it
    // No need to call handleNextCard here, Flashcard component will trigger onNext callback
  };

  const handleIncorrect = () => {
    setSessionIncorrectCount(prev => prev + 1);
    // Save the incorrect answer detail for summary
    setIncorrectAnswers(prev => [
      ...prev,
      {
        question: programFlashcards[currentIndex].question,
        correctAnswer: programFlashcards[currentIndex].answer,
        isCorrect: false, // Explicitly false
      }
    ]);
    // No need to call handleNextCard here, Flashcard component will trigger onNext callback
  };

  // This function is now called by the Flashcard component via the onNext prop
  const handleNextCard = () => {
    if (currentIndex < programFlashcards.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setIsFinished(true);

      // Update *global* user stats with the session's results
      updateUserStats({
        totalCorrect: userStats.totalCorrect + sessionCorrectCount, // Add session count to global
        totalIncorrect: userStats.totalIncorrect + sessionIncorrectCount, // Add session count to global
        cardsLearned: userStats.cardsLearned + sessionCorrectCount, // Only count correct as newly learned
      });

      // Mark program as completed
      if (program) {
        markProgramCompleted(program.id);

        // Add an achievement
        addAchievement({
          name: `Avklarat: ${program.name}`,
          description: `Slutfört programmet "${program.name}"!`,
          icon: 'trophy'
        });
      }
    }
  };

  const handleRestartProgram = () => {
    setCurrentIndex(0);
    setSessionCorrectCount(0); // Reset session counts
    setSessionIncorrectCount(0);
    setIncorrectAnswers([]); // Clear incorrect answers
    setIsFinished(false);
  };

  const handleStartExam = () => {
    navigate(`/exam/${programId}`);
  };

  if (!program || programFlashcards.length === 0) {
    return (
      <div>
        <p className="text-xl text-gray-600 dark:text-gray-300">Programmet hittades inte eller innehåller inga flashcards.</p>
        <Button asChild className="mt-4">
          <Link to="/home">Tillbaka till startsidan</Link>
        </Button>
      </div>
    );
  }

  // Calculate progress (add 1 to currentIndex for user-friendly numbering)
  const progress = Math.round(((currentIndex) / programFlashcards.length) * 100);

  return (
    <div>
      <Link to="/home" className="inline-flex items-center text-gray-600 dark:text-gray-300 hover:text-learny-purple dark:hover:text-learny-purple-dark mb-6">
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
                {sessionCorrectCount} rätt
              </span>
              <span className="mx-2 dark:text-gray-400">•</span>
              <span className="text-sm font-medium text-learny-red dark:text-learny-red-dark">
                {sessionIncorrectCount} fel
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
              onCorrect={handleCorrect}      // Called by Flashcard when correct button is pressed
              onIncorrect={handleIncorrect}  // Called by Flashcard when incorrect button is pressed
              onNext={handleNextCard}        // Called by Flashcard when "Nästa kort" is pressed
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
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm border border-gray-100 dark:border-gray-700 max-w-lg mx-auto">
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
                    {sessionCorrectCount}
                  </p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-center mb-2">
                    <AlertCircle className="h-5 w-5 text-learny-red dark:text-learny-red-dark mr-2" />
                    <span className="font-medium dark:text-white">Fel svar</span>
                  </div>
                  <p className="text-2xl font-bold text-learny-red dark:text-learny-red-dark">
                    {sessionIncorrectCount}
                  </p>
                </div>
              </div>

              {/* Section for Incorrect Answers */}
              {incorrectAnswers.length > 0 && (
                <div className="mb-8 text-left">
                  <h3 className="font-medium text-lg mb-4 dark:text-white">Att öva på:</h3>
                  <div className="space-y-4 max-h-60 overflow-y-auto border dark:border-gray-700 rounded-md p-4 bg-gray-50 dark:bg-gray-700">
                    {incorrectAnswers.map((answer, index) => (
                      <div key={index} className="border-b dark:border-gray-600 pb-2 last:border-b-0">
                        <p className="font-medium mb-1 dark:text-gray-200">F: {answer.question}</p>
                        <p className="text-sm text-learny-green dark:text-learny-green-dark">Rätt svar: {answer.correctAnswer}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {incorrectAnswers.length === 0 && (
                <div className="mb-8 text-center p-4 bg-green-100 dark:bg-green-900/30 rounded-md border border-green-200 dark:border-green-700">
                  <CheckCircle className="h-6 w-6 text-learny-green dark:text-learny-green-dark mx-auto mb-2" />
                  <p className="font-medium text-learny-green dark:text-learny-green-dark">Alla rätt! Bra jobbat!</p>
                </div>
              )}


              <div className="flex flex-wrap justify-center gap-3">
                <Button variant="outline" onClick={handleRestartProgram}>
                  <RefreshCcw className="h-4 w-4 mr-2" /> Öva igen
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
                  <Link to="/home">Tillbaka till startsidan</Link>
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