// src/pages/StudyPage.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useLocalStorage } from '@/context/LocalStorageContext';
import { useAuth } from '@/context/AuthContext';
import { Flashcard as FlashcardComponent } from '@/components/Flashcard';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Trophy, BookOpen, AlertCircle, CheckCircle, FileQuestion, RefreshCcw, Loader2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { motion, AnimatePresence } from 'framer-motion';
import { Flashcard as FlashcardType } from '@/types/flashcard';
import { Program } from '@/types/program';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { initialCategories as categories } from '@/data/categories';

type AnswerRecord = {
  question: string;
  userAnswer?: string;
  correctAnswer: string;
  isCorrect: boolean;
};

const StudyPage = () => {
  const { programId } = useParams<{ programId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    fetchProgram,
    fetchFlashcardsByProgramId,
    updateUserStats,
    markProgramCompleted,
    userStats
  } = useLocalStorage();
  const { user, addAchievement } = useAuth();

  const [program, setProgram] = useState<Program | null>(null);
  const [programFlashcards, setProgramFlashcards] = useState<FlashcardType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [sessionCorrectCount, setSessionCorrectCount] = useState(0);
  const [sessionIncorrectCount, setSessionIncorrectCount] = useState(0);
  const [incorrectAnswers, setIncorrectAnswers] = useState<AnswerRecord[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);

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
      console.log(`StudyPage: Loading program data for ID: ${programId}`);
      
      if (user) {
        try {
          const { data: sessionData, error: sessionError } = await supabase
            .from('flashcard_sessions')
            .insert({
              user_id: user.id,
              category: programId.includes('-') ? programId.split('-')[0] : null,
              start_time: new Date().toISOString(),
              completed: false
            })
            .select()
            .single();
            
          if (sessionError) {
            console.error("Error creating session:", sessionError);
          } else if (sessionData) {
            sessionId = sessionData.id;
            setSessionId(sessionData.id);
            console.log("Created study session:", sessionData.id);
          }
        } catch (sessionErr) {
          console.error("Failed to create session:", sessionErr);
          // Continue anyway - session is not critical
        }
      }
  
      let fetchedProgram = null;
      
      if (programId.includes('-')) {
        const [category, difficulty] = programId.split('-');
        console.log(`StudyPage: Detected category-difficulty format: ${category}-${difficulty}`);
        
        fetchedProgram = {
          id: programId,
          name: `${categories.find(c => c.id === category)?.name || category} (${difficulty})`,
          description: `Flashcards för ${categories.find(c => c.id === category)?.name || category} på ${difficulty} nivå`,
          category,
          difficulty: difficulty as 'beginner' | 'intermediate' | 'advanced' | 'expert',
          flashcards: [],
          hasExam: false
        };
      } else {
        const program = await fetchProgram(programId);
        
        if (!program) {
          try {
            console.log("StudyPage: fetchProgram returned null, trying direct DB fetch");
            const { data: moduleData, error: moduleError } = await supabase
              .from('flashcard_modules')
              .select('*')
              .eq('id', programId)
              .single();
              
            if (moduleError) {
              throw new Error(`Kunde inte hitta modulen: ${moduleError.message}`);
            }
            
            if (!moduleData) {
              throw new Error("Modulen hittades inte i databasen");
            }
            
            fetchedProgram = {
              id: moduleData.id,
              name: moduleData.name,
              description: moduleData.description || moduleData.name,
              category: moduleData.category,
              difficulty: 'beginner',
              flashcards: [],
              hasExam: false
            };
            
            console.log("StudyPage: Successfully fetched module directly:", fetchedProgram.name);
          } catch (directFetchError) {
            console.error("StudyPage: Direct module fetch failed:", directFetchError);
            throw new Error("Programmet kunde inte hittas.");
          }
        } else {
          fetchedProgram = program;
        }
      }
  
      if (!fetchedProgram) {
        throw new Error("Programmet kunde inte hittas.");
      }
      
      setProgram(fetchedProgram);
      console.log("StudyPage: Program set:", fetchedProgram.name);
  
      let fetchedFlashcards: FlashcardType[] = [];
      
      try {
        fetchedFlashcards = await fetchFlashcardsByProgramId(programId);
        console.log(`StudyPage: Fetched ${fetchedFlashcards.length} flashcards`);
        
        if (fetchedFlashcards.length === 0) {
          if (programId.includes('-')) {
            const [category, difficulty] = programId.split('-');
            console.log(`StudyPage: Direct DB fetch for ${category}-${difficulty}`);
            
            const { data, error } = await supabase
              .from('flashcards')
              .select('*')
              .eq('category', category)
              .eq('difficulty', difficulty);
              
            if (error) {
              console.error("StudyPage: Direct flashcard fetch error:", error);
            } else if (data && data.length > 0) {
              console.log(`StudyPage: Direct fetch found ${data.length} flashcards`);
              fetchedFlashcards = data.map(f => ({
                id: f.id,
                question: f.question,
                answer: f.answer,
                category: f.category,
                difficulty: f.difficulty as 'beginner' | 'intermediate' | 'advanced' | 'expert',
                subcategory: f.subcategory || undefined,
                correctCount: f.correct_count || 0,
                incorrectCount: f.incorrect_count || 0
              }));
            }
          } else {
            console.log(`StudyPage: Direct DB fetch for module ${programId}`);
            
            const { data, error } = await supabase
              .from('flashcards')
              .select('*')
              .eq('module_id', programId);
              
            if (error) {
              console.error("StudyPage: Direct flashcard fetch error:", error);
            } else if (data && data.length > 0) {
              console.log(`StudyPage: Direct fetch found ${data.length} flashcards`);
              fetchedFlashcards = data.map(f => ({
                id: f.id,
                question: f.question,
                answer: f.answer,
                category: f.category,
                difficulty: f.difficulty as 'beginner' | 'intermediate' | 'advanced' | 'expert',
                subcategory: f.subcategory || undefined,
                correctCount: f.correct_count || 0,
                incorrectCount: f.incorrect_count || 0
              }));
            }
          }
        }
      } catch (flashcardsError) {
        console.error("StudyPage: Error fetching flashcards:", flashcardsError);
        fetchedFlashcards = [];
      }
  
      if (fetchedFlashcards.length === 0) {
        throw new Error("Inga flashcards hittades för detta program.");
      }
      
      const shuffledFlashcards = [...fetchedFlashcards].sort(() => 0.5 - Math.random());
      setProgramFlashcards(shuffledFlashcards);
  
    } catch (err: any) {
      console.error("StudyPage: Error in loadStudyData:", err);
      setError(err.message || "Kunde inte ladda studieuppgifter.");
      toast({ title: 'Fel', description: err.message || 'Kunde inte ladda programmet.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  }, [programId, fetchProgram, fetchFlashcardsByProgramId, toast, user, categories]);

  useEffect(() => {
    let isMounted = true;
    
    if (isMounted) {
      loadStudyData();
      updateUserStats({});
    }
    
    return () => {
      isMounted = false;
    };
  }, []);

  const updateFlashcardStats = async (flashcardId: string, isCorrect: boolean) => {
    if (!user) return;

    const currentCard = programFlashcards.find(f => f.id === flashcardId);
    if (!currentCard) return;
    
    const columnToIncrement = isCorrect ? 'correct_count' : 'incorrect_count';
    const currentValue = (isCorrect ? currentCard.correct_count : currentCard.incorrect_count) || 0;

    try {
      const { error } = await supabase
        .from('flashcards')
        .update({
          [columnToIncrement]: currentValue + 1,
          last_reviewed: new Date().toISOString(),
        })
        .eq('id', flashcardId);

      if (error) {
        console.error("Error updating flashcard stats in DB:", error);
      }
      
      if (sessionId) {
        const { error: interactionError } = await supabase
          .from('flashcard_interactions')
          .insert({
            user_id: user.id,
            flashcard_id: flashcardId,
            session_id: sessionId,
            is_correct: isCorrect,
            response_time_ms: 0
          });
          
        if (interactionError) {
          console.error("Error recording flashcard interaction:", interactionError);
        }
      }
    } catch (err) {
      console.error("Failed to update flashcard stats:", err);
    }
  };

  const handleCorrect = (id: string) => {
    setSessionCorrectCount(prev => prev + 1);
    updateFlashcardStats(id, true);
  };

  const handleIncorrect = (id: string) => {
    setSessionIncorrectCount(prev => prev + 1);
    updateFlashcardStats(id, false);

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

      if (sessionId && user) {
        supabase
          .from('flashcard_sessions')
          .update({
            end_time: new Date().toISOString(),
            completed: true,
            cards_studied: programFlashcards.length,
            correct_count: sessionCorrectCount,
            incorrect_count: sessionIncorrectCount
          })
          .eq('id', sessionId)
          .then(({ error }) => {
            if (error) console.error("Error updating session:", error);
            else console.log("Session completed:", sessionId);
          });
          
        supabase.rpc('increment_flashcards_studied', { 
          user_id: user.id, 
          study_date: new Date().toISOString().split('T')[0], 
          count: programFlashcards.length 
        }).then(({ error }) => {
          if (error) console.error("Error incrementing flashcards studied:", error);
        });
      }

      updateUserStats({
        totalCorrect: (userStats.totalCorrect || 0) + sessionCorrectCount,
        totalIncorrect: (userStats.totalIncorrect || 0) + sessionIncorrectCount,
        cardsLearned: (userStats.cardsLearned || 0) + sessionCorrectCount,
      });

      if (program) {
        console.log(`Program ${program.name} finished, marking complete.`);
        markProgramCompleted(program.id);
      }
    }
  };

  const handleRestartProgram = () => {
    if (user && programId) {
      supabase
        .from('flashcard_sessions')
        .insert({
          user_id: user.id,
          category: programId.includes('-') ? programId.split('-')[0] : null,
          start_time: new Date().toISOString(),
          completed: false
        })
        .select()
        .single()
        .then(({ data, error }) => {
          if (error) console.error("Error creating restart session:", error);
          else if (data) setSessionId(data.id);
        });
    }
    
    const shuffledFlashcards = [...programFlashcards].sort(() => 0.5 - Math.random());
    setProgramFlashcards(shuffledFlashcards);
    
    setCurrentIndex(0);
    setSessionCorrectCount(0);
    setSessionIncorrectCount(0);
    setIncorrectAnswers([]);
    setIsFinished(false);
  };

  const handleStartExam = () => {
    if (programId) {
      navigate(`/exam/${programId}`);
    }
  };

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
      <Link to="/home" className="inline-flex items-center text-gray-600 dark:text-gray-300 hover:text-learny-purple dark:hover:text-learny-purple-dark mb-6">
        <ChevronLeft className="h-5 w-5 mr-1" />
        Tillbaka till startsidan
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 dark:text-white">{program.name}</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">{program.description}</p>
      </div>

      {!isFinished && (
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
      )}

      <AnimatePresence mode="wait">
        {!isFinished ? (
          <motion.div
            key={`flashcard-${programFlashcards[currentIndex]?.id || currentIndex}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <FlashcardComponent
              flashcard={programFlashcards[currentIndex]}
              onCorrect={handleCorrect}
              onIncorrect={handleIncorrect}
              onNext={handleNextCard}
              showControls={true}
            />
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4"
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm border border-gray-100 dark:border-gray-700 max-w-lg mx-auto text-center">
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
