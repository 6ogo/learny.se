// src/pages/StudyPage.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useLocalStorage } from '@/context/LocalStorageContext';
import { useAuth } from '@/context/AuthContext';
import { Flashcard as FlashcardComponent } from '@/components/Flashcard'; // Renamed import
import { Button } from '@/components/ui/button';
import { ChevronLeft, Trophy, BookOpen, AlertCircle, CheckCircle, FileQuestion, RefreshCcw, Loader2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { motion, AnimatePresence } from 'framer-motion';
import { Flashcard as FlashcardType } from '@/types/flashcard';
import { Program } from '@/types/program'; // Import type
import { supabase } from '@/integrations/supabase/client'; // Import supabase client
import { toast } from '@/components/ui/use-toast'; // Import toast

// Define a type for the answers being tracked
type AnswerRecord = {
  question: string;
  userAnswer?: string; // User answer might not be available if skipped
  correctAnswer: string;
  isCorrect: boolean;
};

const StudyPage = () => {
  const { programId } = useParams<{ programId: string }>();
  const navigate = useNavigate();
  const {
    fetchProgram, // Use fetch function
    fetchFlashcardsByProgramId, // Use fetch function
    updateUserStats,
    markProgramCompleted,
    userStats // Get current userStats for global update
  } = useLocalStorage();
  const { user, addAchievement } = useAuth(); // Get user for DB updates

  const [program, setProgram] = useState<Program | null>(null);
  const [programFlashcards, setProgramFlashcards] = useState<FlashcardType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [sessionCorrectCount, setSessionCorrectCount] = useState(0);
  const [sessionIncorrectCount, setSessionIncorrectCount] = useState(0);
  const [incorrectAnswers, setIncorrectAnswers] = useState<AnswerRecord[]>([]);
  const [isFinished, setIsFinished] = useState(false);

  // --- Fetch Program and Flashcards ---
  const loadStudyData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setProgram(null);
    setProgramFlashcards([]);

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
      setProgram(fetchedProgram);

      // Fetch flashcards for the program
      // **** fetchFlashcardsByProgramId currently uses placeholder/local state ****
      const fetchedFlashcards = await fetchFlashcardsByProgramId(programId);
      if (fetchedFlashcards.length === 0) throw new Error("Inga flashcards hittades för detta program.");
      setProgramFlashcards(fetchedFlashcards);

    } catch (err: any) {
      setError(err.message || "Kunde inte ladda studieuppgifter.");
      toast({ title: 'Fel', description: err.message || 'Kunde inte ladda programmet.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  }, [programId, fetchProgram, fetchFlashcardsByProgramId, toast]);

  useEffect(() => {
    loadStudyData();
    updateUserStats({}); // Update activity/streak on visit
  }, [loadStudyData, updateUserStats]);


  // --- Handle Flashcard Interaction Updates ---
  const updateFlashcardStats = async (flashcardId: string, isCorrect: boolean) => {
     if (!user) return; // Need user to attribute stats potentially

     const columnToIncrement = isCorrect ? 'correct_count' : 'incorrect_count';
     const currentCard = programFlashcards.find(f => f.id === flashcardId);
     const currentValue = (isCorrect ? currentCard?.correct_count : currentCard?.incorrect_count) || 0;

     try {
        // Update directly in Supabase
         const { error } = await supabase
             .from('flashcards')
             .update({
                 [columnToIncrement]: currentValue + 1,
                 last_reviewed: new Date().toISOString(),
                 // Add logic for `learned` and `next_review` if using SRS
             })
             .eq('id', flashcardId);

         if (error) {
             console.error("Error updating flashcard stats in DB:", error);
             // Optional: toast error to user?
         } else {
             // Optionally update local state if needed for immediate UI feedback,
             // though fetching again or using react-query handles this better.
             setProgramFlashcards(prev => prev.map(f =>
                f.id === flashcardId ? { ...f, [columnToIncrement]: currentValue + 1 } : f
             ));
         }
     } catch (err) {
         console.error("Failed to update flashcard stats:", err);
     }
  };


  // --- Event Handlers ---
  const handleCorrect = (id: string) => {
    setSessionCorrectCount(prev => prev + 1);
    updateFlashcardStats(id, true); // Update DB stats
  };

  const handleIncorrect = (id: string) => {
    setSessionIncorrectCount(prev => prev + 1);
    updateFlashcardStats(id, false); // Update DB stats

    // Save details for the summary review
    const currentCard = programFlashcards[currentIndex];
    if (currentCard) {
        setIncorrectAnswers(prev => [
          ...prev,
          {
            question: currentCard.question,
            correctAnswer: currentCard.answer,
            isCorrect: false,
          }
        ]);
    }
  };

  const handleNextCard = () => {
    if (currentIndex < programFlashcards.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setIsFinished(true);

      // Update *global* user stats with the session's results
      // Note: This might double-count if not careful with how stats are defined.
      // Consider if updateUserStats should take delta values instead.
      updateUserStats({
        totalCorrect: (userStats.totalCorrect || 0) + sessionCorrectCount,
        totalIncorrect: (userStats.totalIncorrect || 0) + sessionIncorrectCount,
        // cardsLearned only increases on correct answers
        cardsLearned: (userStats.cardsLearned || 0) + sessionCorrectCount,
      });

      if (program) {
        console.log(`Program ${program.name} finished, marking complete.`);
        markProgramCompleted(program.id);
        // Achievement is handled inside markProgramCompleted now
      }
    }
  };

  const handleRestartProgram = () => {
    // Re-fetch might be better if data could have changed, but for now just reset state
    setCurrentIndex(0);
    setSessionCorrectCount(0);
    setSessionIncorrectCount(0);
    setIncorrectAnswers([]);
    setIsFinished(false);
     // Maybe shuffle cards here if desired:
     // setProgramFlashcards(prev => [...prev].sort(() => 0.5 - Math.random()));
  };

  const handleStartExam = () => {
    if (programId) {
        navigate(`/exam/${programId}`);
    }
  };

  // --- Render Logic ---
   if (isLoading) {
     return (
       <div className="flex justify-center items-center py-12">
         <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
         <span className="ml-2 text-muted-foreground">Laddar program...</span>
       </div>
     );
   }

   if (error || !program || programFlashcards.length === 0) {
     return (
       <div>
         <p className="text-xl text-gray-600 dark:text-gray-300 mb-4">
             {error || "Programmet kunde inte laddas eller saknar flashcards."}
         </p>
         <Button asChild className="mt-4">
           <Link to="/home">Tillbaka till startsidan</Link>
         </Button>
       </div>
     );
   }

  const progress = Math.round(((currentIndex) / programFlashcards.length) * 100);

  return (
    <div>
      {/* Back Link */}
      <Link to="/home" className="inline-flex items-center text-gray-600 dark:text-gray-300 hover:text-learny-purple dark:hover:text-learny-purple-dark mb-6">
        <ChevronLeft className="h-5 w-5 mr-1" />
        Tillbaka till startsidan
      </Link>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 dark:text-white">{program.name}</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">{program.description}</p>
      </div>

      {/* Progress Bar */}
      {!isFinished && (
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
             {/* ... Progress text ... */}
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
      )}

      {/* Flashcard/Summary Area */}
      <AnimatePresence mode="wait">
        {!isFinished ? (
          <motion.div
            key={`flashcard-${programFlashcards[currentIndex]?.id || currentIndex}`} // Ensure key changes
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <FlashcardComponent // Use renamed import
              flashcard={programFlashcards[currentIndex]}
              onCorrect={handleCorrect}
              onIncorrect={handleIncorrect}
              onNext={handleNextCard} // Pass the handler
              showControls={true} // Ensure controls are shown
            />
          </motion.div>
        ) : (
          <motion.div /* Summary View */ >
             <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm border border-gray-100 dark:border-gray-700 max-w-lg mx-auto text-center">
                 {/* ... Icon, Title, Description ... */}
                 <div className="inline-flex items-center justify-center rounded-full bg-learny-purple/10 dark:bg-learny-purple-dark/10 p-4 mb-4">
                    <Trophy className="h-10 w-10 text-learny-purple dark:text-learny-purple-dark" />
                 </div>
                  <h2 className="text-2xl font-bold mb-4 dark:text-white">
                     Träningspass slutfört!
                  </h2>
                   <p className="text-gray-600 dark:text-gray-300 mb-6">
                     Du har gått igenom alla flashcards i detta program.
                   </p>

                 {/* Score Summary */}
                 <div className="grid grid-cols-2 gap-4 mb-6">
                     {/* Correct Answers */}
                     <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                          <div className="flex items-center justify-center mb-2">
                              <CheckCircle className="h-5 w-5 text-learny-green dark:text-learny-green-dark mr-2" />
                              <span className="font-medium dark:text-white">Rätt svar</span>
                          </div>
                          <p className="text-2xl font-bold text-learny-green dark:text-learny-green-dark">
                              {sessionCorrectCount}
                          </p>
                     </div>
                     {/* Incorrect Answers */}
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

                 {/* Incorrect Answers Review Section */}
                 {incorrectAnswers.length > 0 ? (
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
                 ) : (
                     <div className="mb-8 text-center p-4 bg-green-100 dark:bg-green-900/30 rounded-md border border-green-200 dark:border-green-700">
                       <CheckCircle className="h-6 w-6 text-learny-green dark:text-learny-green-dark mx-auto mb-2" />
                       <p className="font-medium text-learny-green dark:text-learny-green-dark">Alla rätt! Bra jobbat!</p>
                     </div>
                 )}

                 {/* Action Buttons */}
                 <div className="flex flex-wrap justify-center gap-3">
                     <Button variant="outline" onClick={handleRestartProgram}>
                         <RefreshCcw className="h-4 w-4 mr-2" /> Öva igen
                     </Button>

                     {program.hasExam && (
                       <Button onClick={handleStartExam} className="flex items-center gap-2">
                           <FileQuestion className="h-4 w-4" /> Ta provet
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