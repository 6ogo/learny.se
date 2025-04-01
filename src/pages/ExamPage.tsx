// src/pages/ExamPage.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useLocalStorage } from '@/context/LocalStorageContext';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Trophy, CheckCircle, XCircle, Loader2 } from 'lucide-react'; // Added Loader2
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from '@/components/ui/use-toast';
import { Program } from '@/types/program'; // Import Program type
import { Flashcard } from '@/types/flashcard'; // Import Flashcard type

const ExamPage = () => {
  const { programId } = useParams<{ programId: string }>();
  const navigate = useNavigate();
  const {
      fetchProgram, // Use fetch function
      fetchFlashcardsByProgramId, // Use fetch function
      markProgramCompleted
  } = useLocalStorage();
  const { addAchievement } = useAuth();

  const [program, setProgram] = useState<Program | null>(null);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [options, setOptions] = useState<string[][]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [userAnswers, setUserAnswers] = useState<{question: string, userAnswer: string, correctAnswer: string}[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  // --- Fetch Program and Flashcards ---
  const loadExamData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setProgram(null);
    setFlashcards([]);
    setOptions([]);

    if (!programId) {
      setError("Program ID saknas.");
      setIsLoading(false);
      return;
    }

    try {
      // Fetch program details
      // **** fetchProgram currently uses placeholder/local state ****
      const fetchedProgram = await fetchProgram(programId);
      if (!fetchedProgram) throw new Error("Programmet kunde inte hittas.");
      if (!fetchedProgram.hasExam) {
        // Redirect if no exam exists for this program
        toast({ title: 'Info', description: 'Detta program har inget prov.', variant: 'default' });
        navigate(`/study/${programId}`);
        return;
      }
      setProgram(fetchedProgram);

      // Fetch flashcards for the program
      // **** fetchFlashcardsByProgramId currently uses placeholder/local state ****
      const fetchedFlashcards = await fetchFlashcardsByProgramId(programId);
      if (fetchedFlashcards.length === 0) throw new Error("Inga flashcards hittades för detta program.");
      setFlashcards(fetchedFlashcards);

      // Generate options after flashcards are loaded
      const generatedOptions = fetchedFlashcards.map((card) => {
        const correctAnswer = card.answer;
        const otherAnswers = fetchedFlashcards
          .filter(c => c.id !== card.id)
          .map(c => c.answer)
          .sort(() => 0.5 - Math.random())
          .slice(0, 3);
        return [...otherAnswers, correctAnswer].sort(() => 0.5 - Math.random());
      });
      setOptions(generatedOptions);

    } catch (err: any) {
      setError(err.message || "Kunde inte ladda provdata.");
      toast({ title: 'Fel', description: err.message || 'Kunde inte ladda provet.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  }, [programId, fetchProgram, fetchFlashcardsByProgramId, navigate, toast]);

  useEffect(() => {
    loadExamData();
  }, [loadExamData]);

  // --- Event Handlers (logic remains mostly the same) ---
  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
  };

  const handleNextQuestion = () => {
    if (!selectedOption || !flashcards[currentQuestionIndex]) return;

    const currentQuestion = flashcards[currentQuestionIndex];
    const isCorrect = selectedOption === currentQuestion.answer;

    setUserAnswers(prev => [
      ...prev,
      {
        question: currentQuestion.question,
        userAnswer: selectedOption,
        correctAnswer: currentQuestion.answer
      }
    ]);

    if (isCorrect) {
      setScore(prev => prev + 1);
    }

    setSelectedOption(null);

    if (currentQuestionIndex < flashcards.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setShowResults(true);
      const finalScore = score + (isCorrect ? 1 : 0); // Calculate final score before potential state update delay
      const passingScore = Math.ceil(flashcards.length * 0.7);

      if (finalScore >= passingScore && program) {
         console.log(`Exam passed for ${program.name}, marking complete.`);
        markProgramCompleted(program.id);
        addAchievement({
          name: `Klarat provet: ${program.name}`,
          description: `Du har klarat provet för ${program.name}!`,
          icon: 'trophy',
        });
        toast({
          title: "Grattis!",
          description: `Du har klarat provet för ${program.name}!`,
        });
      } else if (program) {
         console.log(`Exam failed for ${program.name}. Score: ${finalScore}/${flashcards.length}`);
      }
    }
  };

  const handleRestartExam = () => {
    loadExamData(); // Reload data to get fresh options
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setUserAnswers([]);
    setShowResults(false);
    setScore(0);
  };

  // --- Render Logic ---
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <span className="ml-2 text-muted-foreground">Laddar prov...</span>
      </div>
    );
  }

  if (error || !program || flashcards.length === 0) {
    return (
      <div className="container px-4 py-12 mx-auto text-center">
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-4">
          {error || "Provet kunde inte laddas."}
        </p>
        <Button asChild>
          <Link to="/home">Tillbaka till startsidan</Link>
        </Button>
      </div>
    );
  }

  const currentQuestion = flashcards[currentQuestionIndex];
  const currentOptions = options[currentQuestionIndex] || [];
  const progress = ((currentQuestionIndex) / flashcards.length) * 100;
  const scorePercentage = showResults ? Math.round((score / flashcards.length) * 100) : 0;
  const isPassed = showResults && scorePercentage >= 70;

  return (
    <div>
      {/* Back Link */}
      <Link to={`/study/${programId}`} className="inline-flex items-center text-gray-600 dark:text-gray-300 hover:text-learny-purple dark:hover:text-learny-purple-dark mb-6">
        <ChevronLeft className="h-5 w-5 mr-1" />
        Tillbaka till programmet
      </Link>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 dark:text-white">{program.name} - Prov</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">Testa dina kunskaper.</p>
      </div>

      <AnimatePresence mode="wait">
        {!showResults ? (
          <motion.div /* Quiz View */ >
            {/* Progress Bar */}
             <div className="mb-4">
               <div className="flex justify-between items-center mb-2">
                 <div className="text-sm font-medium dark:text-gray-300">
                   Fråga {currentQuestionIndex + 1} av {flashcards.length}
                 </div>
                 <div className="text-sm font-medium dark:text-gray-300">
                   {score} poäng
                 </div>
               </div>
               <Progress value={progress} className="h-2" />
             </div>

            {/* Question Card */}
            <Card className="p-6 mb-6 dark:bg-gray-800 dark:border-gray-700 min-h-[150px] flex items-center justify-center">
              <h3 className="text-xl font-bold text-center dark:text-white">{currentQuestion?.question || "Laddar fråga..."}</h3>
            </Card>

            {/* Options */}
            <div className="space-y-3 mb-6">
              {currentOptions.map((option, index) => (
                <div
                  key={index}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors min-h-[60px] flex items-center ${
                    selectedOption === option
                      ? 'border-learny-purple bg-learny-purple/10 dark:border-learny-purple-dark dark:bg-learny-purple-dark/10'
                      : 'border-gray-200 hover:border-learny-purple/50 hover:bg-gray-50 dark:border-gray-700 dark:hover:border-learny-purple-dark/50 dark:hover:bg-gray-700'
                  }`}
                  onClick={() => handleOptionSelect(option)}
                >
                  <p className="dark:text-white w-full">{option}</p>
                </div>
              ))}
            </div>

            {/* Next Button */}
            <div className="flex justify-end">
              <Button
                onClick={handleNextQuestion}
                disabled={!selectedOption}
                size="lg"
              >
                {currentQuestionIndex < flashcards.length - 1 ? 'Nästa fråga' : 'Se resultat'}
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div /* Results View */ >
            <Card className="p-8 text-center dark:bg-gray-800 dark:border-gray-700 max-w-2xl mx-auto">
              {/* Icon and Title */}
              <div className="inline-flex items-center justify-center rounded-full bg-learny-purple/10 dark:bg-learny-purple-dark/10 p-4 mb-4">
                <Trophy className={`h-10 w-10 ${isPassed ? 'text-learny-purple dark:text-learny-purple-dark' : 'text-gray-400 dark:text-gray-500'}`} />
              </div>
              <h2 className="text-2xl font-bold mb-2 dark:text-white">
                {isPassed ? 'Grattis! Du har klarat provet!' : 'Försök igen!'}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                {isPassed
                  ? 'Du har visat att du behärskar detta ämne.'
                  : 'Du behöver studera mer för att klara detta prov.'}
              </p>

              {/* Score */}
              <div className="mb-6">
                <div className="text-3xl font-bold mb-1 dark:text-white">
                  {score} / {flashcards.length} poäng
                </div>
                <div className="text-gray-500 dark:text-gray-400">
                  {scorePercentage}% rätt
                </div>
              </div>

              {/* Answer Review */}
              <div className="mb-8">
                <h3 className="font-medium text-lg mb-4 text-left dark:text-white">Dina svar:</h3>
                <div className="space-y-4 max-h-80 overflow-y-auto border rounded-md p-4 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                  {userAnswers.map((answer, index) => (
                    <div key={index} className="border-b dark:border-gray-600 pb-3 last:border-b-0">
                      <p className="font-medium mb-1 dark:text-gray-200">Fråga {index + 1}: {answer.question}</p>
                      <div className="flex items-start gap-2">
                        {answer.userAnswer === answer.correctAnswer ? (
                          <CheckCircle className="h-5 w-5 text-learny-green dark:text-learny-green-dark mt-0.5 flex-shrink-0" />
                        ) : (
                          <XCircle className="h-5 w-5 text-learny-red dark:text-learny-red-dark mt-0.5 flex-shrink-0" />
                        )}
                        <div>
                          <p className={`text-sm ${answer.userAnswer === answer.correctAnswer ? 'text-gray-600 dark:text-gray-400' : 'text-learny-red dark:text-learny-red-dark'}`}>
                            Ditt svar: {answer.userAnswer}
                          </p>
                          {answer.userAnswer !== answer.correctAnswer && (
                            <p className="text-sm text-learny-green dark:text-learny-green-dark mt-1">Rätt svar: {answer.correctAnswer}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap justify-center gap-3">
                <Button variant="outline" onClick={handleRestartExam}>
                  Försök igen
                </Button>
                <Button asChild>
                  <Link to={`/study/${programId}`}>Tillbaka till programmet</Link>
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ExamPage;