
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLocalStorage } from '@/context/LocalStorageContext';
import { Program } from '@/types/program';
import { Flashcard as FlashcardType } from '@/types/flashcard';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Home, X, Check } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Flashcard } from '@/components/Flashcard';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { StudyInsights } from '@/components/StudyInsights';

const difficultyLabels = {
  beginner: 'Nybörjare',
  intermediate: 'Medel',
  advanced: 'Avancerad',
  expert: 'Expert'
};

interface FlashcardWithResponse extends FlashcardType {
  userResponse?: boolean;
}

export default function StudyPage() {
  const { programId } = useParams<{ programId: string }>();
  const navigate = useNavigate();
  const { fetchFlashcardsByProgramId, fetchProgram, markProgramCompleted, updateUserStats } = useLocalStorage();
  const { user } = useAuth();
  
  // Program state
  const [program, setProgram] = useState<Program | null>(null);
  const [flashcards, setFlashcards] = useState<FlashcardWithResponse[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [currentCard, setCurrentCard] = useState<FlashcardWithResponse | null>(null);
  const [flipped, setFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Stats tracking
  const [sessionStats, setSessionStats] = useState({
    correct: 0,
    incorrect: 0,
    total: 0,
    cardsStudied: 0,
  });
  
  // Session management
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [sessionComplete, setSessionComplete] = useState(false);
  
  // Reference to track if data has been loaded
  const dataLoaded = useRef(false);
  
  // Parse category and difficulty from programId if it's in the format "category-difficulty"
  const isCategoryDifficultyFormat = programId?.includes('-') && programId.split('-').length === 2;
  let categoryId, difficultyLevel;
  
  if (isCategoryDifficultyFormat && programId) {
    console.log(`StudyPage: Detected category-difficulty format: ${programId}`);
    [categoryId, difficultyLevel] = programId.split('-');
    console.log(`StudyPage: Program set: ${categoryId} (${difficultyLevel})`);
  }
  
  // Create or retrieve a study session
  const createSession = useCallback(async () => {
    if (!user?.id) return null;
    
    try {
      console.log('Creating new flashcard session');
      
      // Determine category from either the program or parsed categoryId
      const category = program?.category || categoryId || null;
      
      const { data, error } = await supabase
        .from('flashcard_sessions')
        .insert({
          user_id: user.id,
          category: category,
          start_time: new Date().toISOString(),
          completed: false,
          cards_studied: 0,
          correct_count: 0,
          incorrect_count: 0,
        })
        .select()
        .single();
      
      if (error) {
        console.log(' Error creating session:', error);
        return null;
      }
      
      console.log('Session created:', data.id);
      return data.id;
    } catch (err) {
      console.error('Error in createSession:', err);
      return null;
    }
  }, [user, program, categoryId]);
  
  // Load study data (program and flashcards) - only once
  useEffect(() => {
    // Prevent duplicate loading
    if (dataLoaded.current || !programId) return;
    
    const loadData = async () => {
      console.log(`StudyPage: Loading program data for ID: ${programId}`);
      setLoading(true);
      setError(null);
      
      try {
        // Fetch program data
        const programData = await fetchProgram(programId);
        
        if (!programData) {
          setError('Programmet kunde inte hittas');
          setLoading(false);
          return;
        }
        
        setProgram(programData);
        
        // Fetch flashcards for this program - only fetch once
        console.log(`StudyPage: Fetching flashcards for program: ${programId}`);
        const cards = await fetchFlashcardsByProgramId(programId);
        
        if (!cards || cards.length === 0) {
          throw new Error('Inga flashcards hittades för detta program.');
        }
        
        setFlashcards(cards);
        setCurrentCard(cards[0]);
        setCurrentCardIndex(0);
        
        // Create a new session
        const newSessionId = await createSession();
        setSessionId(newSessionId);
        
        setSessionStats({
          correct: 0,
          incorrect: 0,
          total: cards.length,
          cardsStudied: 0,
        });
        
        dataLoaded.current = true;
        setLoading(false);
      } catch (err: any) {
        console.error(`StudyPage: Error in loadData:`, err);
        setError(err.message || 'Ett fel uppstod vid laddning av studie-data');
        setLoading(false);
      }
    };
    
    loadData();
  }, [programId, fetchProgram, fetchFlashcardsByProgramId, createSession]);
  
  // Update current card when index changes
  useEffect(() => {
    if (flashcards.length > 0 && currentCardIndex < flashcards.length) {
      setCurrentCard(flashcards[currentCardIndex]);
    }
  }, [flashcards, currentCardIndex]);
  
  // Mark answer as correct or incorrect
  const handleAnswer = async (correct: boolean) => {
    if (!currentCard || !user?.id) return;
    
    // Update flashcard with user response
    const updatedFlashcards = [...flashcards];
    updatedFlashcards[currentCardIndex] = {
      ...updatedFlashcards[currentCardIndex],
      userResponse: correct
    };
    setFlashcards(updatedFlashcards);
    
    // Update session stats
    setSessionStats(prev => ({
      ...prev,
      correct: correct ? prev.correct + 1 : prev.correct,
      incorrect: correct ? prev.incorrect : prev.incorrect + 1,
      cardsStudied: prev.cardsStudied + 1,
    }));
    
    // Update flashcard stats in Supabase
    try {
      const updates: any = {
        last_reviewed: new Date().toISOString()
      };
      
      if (correct) {
        updates.correct_count = supabase.rpc('increment', {
          row_id: parseInt(currentCard.id),
          column_name: 'correct_count',
          table_name: 'flashcards'
        });
      } else {
        updates.incorrect_count = supabase.rpc('increment', {
          row_id: parseInt(currentCard.id),
          column_name: 'incorrect_count',
          table_name: 'flashcards'
        });
      }
      
      await supabase
        .from('flashcards')
        .update(updates)
        .eq('id', currentCard.id);
      
      // Record interaction
      if (sessionId) {
        await supabase
          .from('flashcard_interactions')
          .insert({
            user_id: user.id,
            flashcard_id: currentCard.id,
            is_correct: correct,
            session_id: sessionId,
            response_time_ms: 0 // We're not tracking time for now
          });
      }
    } catch (err) {
      console.error('Error recording answer:', err);
    }
    
    // Move to next card or complete session
    if (currentCardIndex < flashcards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setFlipped(false);
    } else {
      completeSession();
    }
  };
  
  // Complete the study session
  const completeSession = async () => {
    setSessionComplete(true);
    
    // Update user stats
    updateUserStats({
      totalCorrect: sessionStats.correct,
      totalIncorrect: sessionStats.incorrect,
      cardsLearned: sessionStats.cardsStudied
    });
    
    // If program exists, mark it as completed
    if (program) {
      markProgramCompleted(program.id);
    }
    
    // Update session in Supabase
    if (sessionId && user?.id) {
      try {
        await supabase
          .from('flashcard_sessions')
          .update({
            completed: true,
            end_time: new Date().toISOString(),
            cards_studied: sessionStats.cardsStudied,
            correct_count: sessionStats.correct,
            incorrect_count: sessionStats.incorrect
          })
          .eq('id', sessionId)
          .eq('user_id', user.id);
      } catch (err) {
        console.error('Error completing session:', err);
      }
    }
    
    toast({
      title: 'Session avslutad',
      description: `Du har slutfört alla flashcards i detta program!`
    });
  };
  
  // Navigate back
  const handleBack = () => {
    navigate(-1);
  };
  
  // Navigate home
  const handleHome = () => {
    navigate('/home');
  };
  
  // Restart session
  const handleRestart = () => {
    setCurrentCardIndex(0);
    setFlipped(false);
    setSessionComplete(false);
    setSessionStats({
      correct: 0,
      incorrect: 0,
      total: flashcards.length,
      cardsStudied: 0,
    });
    // Reset user responses
    const resetFlashcards = flashcards.map(card => ({
      ...card,
      userResponse: undefined
    }));
    setFlashcards(resetFlashcards);
    
    // Create a new session
    createSession().then(newId => {
      setSessionId(newId);
    });
  };
  
  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-learny-purple"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-300">Laddar flashcards...</p>
      </div>
    );
  }
  
  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <X className="h-16 w-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-center mb-2">Ett fel uppstod</h2>
        <p className="text-gray-600 dark:text-gray-300 text-center mb-6">{error}</p>
        <div className="flex gap-4">
          <Button onClick={handleBack} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Tillbaka
          </Button>
          <Button onClick={handleHome}>
            <Home className="h-4 w-4 mr-2" />
            Hem
          </Button>
        </div>
      </div>
    );
  }
  
  // Session complete state with insights
  if (sessionComplete && program) {
    return (
      <div className="max-w-4xl mx-auto px-4">
        <StudyInsights
          program={program}
          correctCount={sessionStats.correct}
          incorrectCount={sessionStats.incorrect}
          flashcards={flashcards}
          onClose={handleBack}
          onRestart={handleRestart}
        />
      </div>
    );
  }
  
  // Regular study state
  return (
    <div className="max-w-2xl mx-auto px-4">
      {program && (
        <div className="mb-6">
          <h1 className="text-2xl font-bold">{program.name}</h1>
          <p className="text-gray-600 dark:text-gray-300">{program.description}</p>
          
          {isCategoryDifficultyFormat && difficultyLevel && (
            <Badge className="mt-2">{difficultyLabels[difficultyLevel as keyof typeof difficultyLabels] || difficultyLevel}</Badge>
          )}
        </div>
      )}
      
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Kort {currentCardIndex + 1} av {flashcards.length}
          </span>
          <div className="flex gap-2">
            <Badge variant="outline">{sessionStats.correct} rätt</Badge>
            <Badge variant="outline" className="border-red-500">{sessionStats.incorrect} fel</Badge>
          </div>
        </div>
        <Progress value={(currentCardIndex / flashcards.length) * 100} className="h-2" />
      </div>
      
      {currentCard && (
        <div className="mb-8 h-[300px]">
          <Flashcard
            flashcard={currentCard}
            isFlipped={flipped}
            onFlip={() => setFlipped(!flipped)}
          />
        </div>
      )}
      
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        {flipped ? (
          <>
            <Button 
              onClick={() => handleAnswer(false)} 
              variant="outline" 
              className="flex-1 border-red-500 hover:bg-red-500 hover:text-white"
            >
              <X className="h-5 w-5 mr-2" />
              Fel
            </Button>
            <Button 
              onClick={() => handleAnswer(true)} 
              variant="outline" 
              className="flex-1 border-green-500 hover:bg-green-500 hover:text-white"
            >
              <Check className="h-5 w-5 mr-2" />
              Rätt
            </Button>
          </>
        ) : (
          <Button 
            onClick={() => setFlipped(true)} 
            className="flex-1 bg-learny-purple hover:bg-learny-purple-dark"
          >
            Visa svar
          </Button>
        )}
      </div>
    </div>
  );
}
