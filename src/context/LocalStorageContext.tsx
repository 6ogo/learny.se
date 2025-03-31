import React, { createContext, useContext, useState, useEffect, ReactNode, FC } from 'react';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/hooks/use-toast';
import { Flashcard } from '@/types/flashcard';
import { Category } from '@/types/category';
import { Program } from '@/types/program';
import { UserStats, UserAchievement } from '@/types/user';
import { initialCategories } from '@/data/categories';
import { initialPrograms } from '@/data/programs';
import { allFlashcards } from '@/data/flashcards/index';
import { initialUserStats } from '@/data/user';

type LocalStorageContextType = {
  flashcards: Flashcard[];
  programs: Program[];
  categories: Category[];
  userStats: UserStats;
  isContextLoading: boolean; // <-- Add loading state indicator
  addFlashcard: (flashcardData: Omit<Flashcard, 'id' | 'correctCount' | 'incorrectCount' | 'lastReviewed' | 'nextReview' | 'learned' | 'reviewLater'>) => void;
  updateFlashcard: (id: string, updates: Partial<Flashcard>) => void;
  deleteFlashcard: (id: string) => void;
  getFlashcard: (id: string) => Flashcard | undefined;
  getFlashcardsByCategory: (category: string) => Flashcard[];
  getFlashcardsByProgram: (programId: string) => Flashcard[];
  updateUserStats: (updates: Partial<UserStats>) => void;
  markProgramCompleted: (programId: string) => void;
  getProgram: (programId: string) => Program | undefined;
  getProgramsByCategory: (category: string) => Program[];
  getCategory: (categoryId: string) => Category | undefined;
};

const LocalStorageContext = createContext<LocalStorageContextType | undefined>(undefined);

export const useLocalStorage = () => {
  const context = useContext(LocalStorageContext);
  if (context === undefined) {
    throw new Error('useLocalStorage must be used within a LocalStorageProvider');
  }
  return context;
};

export const LocalStorageProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { addAchievement: addAuthAchievement } = useAuth();
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [userStats, setUserStats] = useState<UserStats>(initialUserStats);
  const [isContextLoading, setIsContextLoading] = useState(true); // Start as loading

  // Effect 1: Load initial data from localStorage
  useEffect(() => {
    console.log("LocalStorageProvider Mount: Starting initial data load...");
    let loadedFlashcards = allFlashcards;
    let loadedPrograms = initialPrograms;
    let loadedCategories = initialCategories;
    let loadedUserStats = { ...initialUserStats }; // Clone initial stats

    try {
      const storedFlashcards = localStorage.getItem('flashcards');
      if (storedFlashcards) loadedFlashcards = JSON.parse(storedFlashcards);
    } catch (e) { console.error("Error parsing stored flashcards:", e); }

    try {
      const storedPrograms = localStorage.getItem('programs');
      if (storedPrograms) loadedPrograms = JSON.parse(storedPrograms);
    } catch (e) { console.error("Error parsing stored programs:", e); }

    try {
      const storedCategories = localStorage.getItem('categories');
      if (storedCategories) loadedCategories = JSON.parse(storedCategories);
    } catch (e) { console.error("Error parsing stored categories:", e); }

    try {
      const storedUserStats = localStorage.getItem('userStats');
      if (storedUserStats) {
        const parsedStats = JSON.parse(storedUserStats);
        // Ensure all properties exist, using defaults if missing in storage
        loadedUserStats = {
          streak: parsedStats.streak ?? initialUserStats.streak,
          lastActivity: parsedStats.lastActivity ?? initialUserStats.lastActivity,
          totalCorrect: parsedStats.totalCorrect ?? initialUserStats.totalCorrect,
          totalIncorrect: parsedStats.totalIncorrect ?? initialUserStats.totalIncorrect,
          cardsLearned: parsedStats.cardsLearned ?? initialUserStats.cardsLearned,
          achievements: Array.isArray(parsedStats.achievements) ? parsedStats.achievements : initialUserStats.achievements,
          completedPrograms: Array.isArray(parsedStats.completedPrograms) ? parsedStats.completedPrograms : initialUserStats.completedPrograms,
        };
      }
    } catch (e) { console.error("Error parsing stored userStats:", e); }

    // Set the loaded state
    setFlashcards(loadedFlashcards);
    setPrograms(loadedPrograms);
    setCategories(loadedCategories);
    setUserStats(loadedUserStats); // Set the loaded stats

    console.log("LocalStorageProvider Mount: Initial data set from localStorage.");
    // Loading is finished *after* this initial data is set
    setIsContextLoading(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only ONCE on mount

  // Effect 2: Check and update streak *after* initial load
  useEffect(() => {
    // Only run if initial data load is complete AND userStats has been potentially set
    if (!isContextLoading) {
      console.log("LocalStorageProvider: Running streak check effect...");
      setUserStats(currentStats => {
          const now = new Date();
          const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
          const lastActivityTimestamp = typeof currentStats.lastActivity === 'number' ? currentStats.lastActivity : 0;
          const lastActivityDate = new Date(lastActivityTimestamp).getTime();
          const oneDayMs = 24 * 60 * 60 * 1000;

          // This prevents calculation if lastActivity is invalid (e.g., 0 from initial state)
          // It should only run if a valid timestamp exists from previous sessions or the initial load.
          if (lastActivityTimestamp === 0 || isNaN(lastActivityDate)) {
              console.log("Streak Check: Initializing or invalid lastActivity, setting streak=1 for today.");
              // Important: Only update if lastActivity was *truly* 0, not just default.
              // The check in the loading useEffect handles the very first initialization better.
              // This check mainly handles cases after a reset or if data was corrupted.
              // Let's refine: Maybe only update if lastActivity was 0 AND user did something today?
              // A simpler approach: The initial load useEffect handles the FIRST ever streak.
              // This effect handles subsequent updates.
              return currentStats; // Let initial load handle the very first streak setting
          }

          const lastActivityDay = new Date(new Date(lastActivityTimestamp).getFullYear(), new Date(lastActivityTimestamp).getMonth(), new Date(lastActivityTimestamp).getDate()).getTime();
          const daysSinceLastActivity = Math.floor((today - lastActivityDay) / oneDayMs);

          console.log(`Streak Check (Post-Load): Today=${today}, LastActivityDay=${lastActivityDay}, Days Since=${daysSinceLastActivity}, Current Streak=${currentStats.streak}`);

          if (daysSinceLastActivity === 0) {
              console.log("Streak Check (Post-Load): Active today, no change.");
              // Ensure lastActivity is today if already active
              return currentStats.lastActivity === today ? currentStats : { ...currentStats, lastActivity: today };
          } else if (daysSinceLastActivity === 1) {
              const newStreak = currentStats.streak + 1;
              console.log(`Streak Check (Post-Load): Incrementing streak to ${newStreak}`);
              // Check achievements
              if (newStreak === 7) addAuthAchievement({ name: '7-dagars Streak', description: 'Använt Learny 7 dagar i rad!', icon: 'flame' });
              else if (newStreak === 30) addAuthAchievement({ name: '30-dagars Streak', description: 'Använt Learny 30 dagar i rad!', icon: 'flame' });
              return { ...currentStats, streak: newStreak, lastActivity: today };
          } else { // daysSinceLastActivity > 1
              console.log("Streak Check (Post-Load): Streak broken, resetting to 1.");
              return { ...currentStats, streak: 1, lastActivity: today };
          }
      });
    }
    // Depend on isContextLoading to trigger AFTER initial load
    // Add other dependencies if specific user actions should trigger a re-check (e.g., completing a card)
    // For now, just checking after load should fix the refresh issue.
  }, [isContextLoading, addAuthAchievement]);


  // Save effects - Depend on isContextLoading to prevent premature saves
  useEffect(() => {
    if (isContextLoading) return;
    console.log("Saving flashcards to localStorage");
    localStorage.setItem('flashcards', JSON.stringify(flashcards));
  }, [flashcards, isContextLoading]);

  useEffect(() => {
    if (isContextLoading) return;
    console.log("Saving programs to localStorage");
    localStorage.setItem('programs', JSON.stringify(programs));
  }, [programs, isContextLoading]);

  useEffect(() => {
     if (isContextLoading) return;
     console.log("Saving categories to localStorage");
     localStorage.setItem('categories', JSON.stringify(categories));
  }, [categories, isContextLoading]);

  useEffect(() => {
    if (isContextLoading) return;
    console.log("Saving userStats to localStorage", userStats);
    localStorage.setItem('userStats', JSON.stringify(userStats));
  }, [userStats, isContextLoading]);


  const addFlashcard = (flashcardData: Omit<Flashcard, 'id' | 'correctCount' | 'incorrectCount' | 'lastReviewed' | 'nextReview' | 'learned' | 'reviewLater'>) => {
    const newFlashcard: Flashcard = {
      ...flashcardData,
      id: `custom-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      correctCount: 0,
      incorrectCount: 0,
      lastReviewed: Date.now(),
      nextReview: Date.now(),
      learned: false,
      reviewLater: false,
    };

    setFlashcards((prev) => [...prev, newFlashcard]);
    toast({
      title: 'Flashcard skapad',
      description: 'Din nya flashcard har lagts till!',
    });
    updateUserStatsInternal({}); // Update last activity
  };

  const updateFlashcard = (id: string, updates: Partial<Flashcard>) => {
     // This logic needs careful review based on how correct/incorrect/learned counts are handled.
     // We update flashcards state first, then use a functional update for userStats
     // to ensure we base calculations on the *previous* stats state.

     let changeInCorrect = 0;
     let changeInIncorrect = 0;
     let changeInLearned = 0;

     setFlashcards((prevFlashcards) =>
        prevFlashcards.map((f) => {
          if (f.id === id) {
              const currentCorrect = f.correctCount || 0;
              const currentIncorrect = f.incorrectCount || 0;
              const currentLearned = f.learned || false;

              const updatedCard = { ...f, ...updates, lastReviewed: Date.now() };

              // Calculate *change* based on the update
              if (updates.correctCount !== undefined && updates.correctCount > currentCorrect) {
                  changeInCorrect = updates.correctCount - currentCorrect;
              }
              if (updates.incorrectCount !== undefined && updates.incorrectCount > currentIncorrect) {
                  changeInIncorrect = updates.incorrectCount - currentIncorrect;
              }
              if (updates.learned === true && !currentLearned) {
                  changeInLearned = 1;
              } else if (updates.learned === false && currentLearned) {
                  changeInLearned = -1;
              }

              return updatedCard;
          }
          return f;
      })
    );

    // Update user stats using the calculated *changes*
    setUserStats((prevStats) => {
       return {
           ...prevStats,
           totalCorrect: prevStats.totalCorrect + changeInCorrect,
           totalIncorrect: prevStats.totalIncorrect + changeInIncorrect,
           cardsLearned: Math.max(0, prevStats.cardsLearned + changeInLearned), // Ensure not negative
           lastActivity: Date.now() // Update activity on card interaction
       };
   });
  };


  const deleteFlashcard = (id: string) => {
    setFlashcards((prev) => prev.filter((flashcard) => flashcard.id !== id));
    toast({
      title: 'Flashcard borttagen',
      description: 'Flashcard har raderats från din samling.',
    });
    updateUserStatsInternal({}); // Update last activity
  };

  const getFlashcard = (id: string): Flashcard | undefined => {
    return flashcards.find((flashcard) => flashcard.id === id);
  };

  const getFlashcardsByCategory = (category: string): Flashcard[] => {
    return flashcards.filter((flashcard) => flashcard.category === category);
  };

  const getFlashcardsByProgram = (programId: string): Flashcard[] => {
    const program = programs.find((p) => p.id === programId);
    if (!program) return [];

    return program.flashcards
      .map((id) => flashcards.find((f) => f.id === id))
      .filter((f): f is Flashcard => f !== undefined);
  };

  const updateUserStatsInternal = (updates: Partial<UserStats>) => {
    setUserStats((prev) => ({
        ...prev,
        ...updates,
        lastActivity: Date.now() // Always update lastActivity
    }));
  };

  const markProgramCompleted = (programId: string) => {
    const program = programs.find((p) => p.id === programId);

    setUserStats((prev) => {
      if (!prev.completedPrograms.includes(programId)) {
        console.log(`Marking program ${programId} (${program?.name}) as completed.`);
        const updatedCompletedPrograms = [...prev.completedPrograms, programId];

        // Trigger achievement outside
        if (program) {
          addAuthAchievement({
            name: `Avklarat: ${program.name}`,
            description: `Slutfört programmet "${program.name}"!`,
            icon: 'trophy',
          });

          // Check for category mastery
          const categoryPrograms = programs.filter((p) => p.category === program.category);
          const allInCategoryCompleted = categoryPrograms.every(p => updatedCompletedPrograms.includes(p.id));
          if (allInCategoryCompleted && categoryPrograms.length > 0) {
            const category = categories.find((c) => c.id === program.category);
            if (category) {
              addAuthAchievement({
                name: `${category.name} Mästare`,
                description: `Slutfört alla program i kategorin ${category.name}!`,
                icon: 'award',
              });
            }
          }
        }

        return {
          ...prev,
          completedPrograms: updatedCompletedPrograms,
          lastActivity: Date.now()
        };
      } else {
        console.log(`Program ${programId} (${program?.name}) was already completed.`);
        return { ...prev, lastActivity: Date.now() }; // Update activity even if already done
      }
    });
  };

  const getProgram = (programId: string): Program | undefined => {
    return programs.find((program) => program.id === programId);
  };

  const getProgramsByCategory = (category: string): Program[] => {
    return programs.filter((program) => program.category === category);
  };

  const getCategory = (categoryId: string): Category | undefined => {
    return categories.find((category) => category.id === categoryId);
  };

  const contextValue: LocalStorageContextType = {
    flashcards,
    programs,
    categories,
    userStats,
    isContextLoading, // <-- Provide loading state
    addFlashcard,
    updateFlashcard,
    deleteFlashcard,
    getFlashcard,
    getFlashcardsByCategory,
    getFlashcardsByProgram,
    updateUserStats: updateUserStatsInternal,
    markProgramCompleted,
    getProgram,
    getProgramsByCategory,
    getCategory,
  };

  return (
    <LocalStorageContext.Provider value={contextValue}>
      {children}
    </LocalStorageContext.Provider>
  );
};