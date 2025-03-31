import React, { createContext, useContext, useState, useEffect, ReactNode, FC, useCallback, useMemo } from 'react';
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
  isContextLoading: boolean; // Loading state for this context
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
  const [isContextLoading, setIsContextLoading] = useState(true); // Separate loading state

  // Effect 1: Load initial data from localStorage
  useEffect(() => {
    console.log("LocalStorageContext Mount: Starting initial data load...");
    let loadedFlashcards = allFlashcards;
    let loadedPrograms = initialPrograms;
    let loadedCategories = initialCategories;
    let loadedUserStats = { ...initialUserStats };

    try {
      const storedFlashcards = localStorage.getItem('flashcards');
      if (storedFlashcards) loadedFlashcards = JSON.parse(storedFlashcards);
    } catch (e) { console.error("LocalStorageContext: Error parsing stored flashcards:", e); }
    try {
      const storedPrograms = localStorage.getItem('programs');
      if (storedPrograms) loadedPrograms = JSON.parse(storedPrograms);
    } catch (e) { console.error("LocalStorageContext: Error parsing stored programs:", e); }
    try {
      const storedCategories = localStorage.getItem('categories');
      if (storedCategories) loadedCategories = JSON.parse(storedCategories);
    } catch (e) { console.error("LocalStorageContext: Error parsing stored categories:", e); }
    try {
      const storedUserStats = localStorage.getItem('userStats');
      if (storedUserStats) {
        const parsedStats = JSON.parse(storedUserStats);
        loadedUserStats = { ...initialUserStats, ...parsedStats };
      }
    } catch (e) { console.error("LocalStorageContext: Error parsing stored userStats:", e); }

    setFlashcards(loadedFlashcards);
    setPrograms(loadedPrograms);
    setCategories(loadedCategories);
    setUserStats(loadedUserStats); // Set loaded stats FIRST

    console.log("LocalStorageContext Mount: Initial data set from localStorage.");
    setIsContextLoading(false); // Finish loading AFTER setting state

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only ONCE on mount

  // Effect 2: Check and update streak *after* initial load
  useEffect(() => {
    if (isContextLoading) return; // Don't run until initial data is loaded

    console.log("LocalStorageContext: Running streak check effect (Post-Load)...");

    setUserStats(currentStats => {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
        const lastActivityTimestamp = typeof currentStats.lastActivity === 'number' ? currentStats.lastActivity : 0;
        const lastActivityDate = new Date(lastActivityTimestamp).getTime();
        const oneDayMs = 24 * 60 * 60 * 1000;

        if (lastActivityTimestamp === 0 || isNaN(lastActivityDate)) {
            // This case should ideally be handled by initial load setting lastActivity to 'today'
            // if userStats was empty. If we reach here with 0, it might mean no activity yet.
            console.log("Streak Check (Post-Load): lastActivity is 0 or invalid. No change unless action triggers update.");
            return currentStats; // Don't change streak just because it's 0 post-load
        }

        const lastActivityDay = new Date(new Date(lastActivityTimestamp).getFullYear(), new Date(lastActivityTimestamp).getMonth(), new Date(lastActivityTimestamp).getDate()).getTime();
        const daysSinceLastActivity = Math.floor((today - lastActivityDay) / oneDayMs);

        console.log(`Streak Check (Post-Load): Today=${today}, LastActivityDay=${lastActivityDay}, Days Since=${daysSinceLastActivity}, Current Streak=${currentStats.streak}`);

        if (daysSinceLastActivity === 0) {
            console.log("Streak Check (Post-Load): Active today.");
            // Only update lastActivity if it's not already today to prevent loop
            return currentStats.lastActivity === today ? currentStats : { ...currentStats, lastActivity: today };
        } else if (daysSinceLastActivity === 1) {
            const newStreak = currentStats.streak + 1;
            console.log(`Streak Check (Post-Load): Incrementing streak to ${newStreak}`);
            if (newStreak === 7) addAuthAchievement({ name: '7-dagars Streak', description: 'Använt Learny 7 dagar i rad!', icon: 'flame' });
            else if (newStreak === 30) addAuthAchievement({ name: '30-dagars Streak', description: 'Använt Learny 30 dagar i rad!', icon: 'flame' });
            return { ...currentStats, streak: newStreak, lastActivity: today };
        } else { // daysSinceLastActivity > 1
            console.log("Streak Check (Post-Load): Streak broken, resetting to 1.");
            // Reset streak but only if last activity wasn't today (handled above)
            return { ...currentStats, streak: 1, lastActivity: today };
        }
    });
    // Depend only on loading state and the achievement function reference
  }, [isContextLoading, addAuthAchievement]);


  // Save effects - Depend on isContextLoading and the specific state
  useEffect(() => {
    if (isContextLoading) return;
    console.log("LocalStorageContext: Saving flashcards");
    localStorage.setItem('flashcards', JSON.stringify(flashcards));
  }, [flashcards, isContextLoading]);

  useEffect(() => {
    if (isContextLoading) return;
    console.log("LocalStorageContext: Saving programs");
    localStorage.setItem('programs', JSON.stringify(programs));
  }, [programs, isContextLoading]);

  useEffect(() => {
     if (isContextLoading) return;
     console.log("LocalStorageContext: Saving categories");
     localStorage.setItem('categories', JSON.stringify(categories));
  }, [categories, isContextLoading]);

  useEffect(() => {
    if (isContextLoading) return;
    console.log("LocalStorageContext: Saving userStats", userStats);
    localStorage.setItem('userStats', JSON.stringify(userStats));
  }, [userStats, isContextLoading]);


  // --- Functions wrapped in useCallback ---
  const updateUserStatsInternal = useCallback((updates: Partial<UserStats>) => {
    console.log("LocalStorageContext: Updating user stats internally", updates);
    setUserStats((prev) => ({
        ...prev,
        ...updates,
        lastActivity: Date.now() // Ensure lastActivity is always updated
    }));
  }, []);

  const addFlashcard = useCallback((flashcardData: Omit<Flashcard, 'id' | 'correctCount' | 'incorrectCount' | 'lastReviewed' | 'nextReview' | 'learned' | 'reviewLater'>) => {
    const newFlashcard: Flashcard = {
      ...flashcardData,
      id: `custom-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      correctCount: 0, incorrectCount: 0, lastReviewed: Date.now(),
      nextReview: Date.now(), learned: false, reviewLater: false,
    };
    setFlashcards((prev) => [...prev, newFlashcard]);
    toast({ title: 'Flashcard skapad', description: 'Din nya flashcard har lagts till!' });
    updateUserStatsInternal({});
  }, [updateUserStatsInternal]);


  const updateFlashcard = useCallback((id: string, updates: Partial<Flashcard>) => {
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

              if (updates.correctCount !== undefined && updates.correctCount > currentCorrect) changeInCorrect = updates.correctCount - currentCorrect;
              if (updates.incorrectCount !== undefined && updates.incorrectCount > currentIncorrect) changeInIncorrect = updates.incorrectCount - currentIncorrect;
              if (updates.learned === true && !currentLearned) changeInLearned = 1;
              else if (updates.learned === false && currentLearned) changeInLearned = -1;

              return updatedCard;
          }
          return f;
      })
    );

    // Update user stats based on the calculated *changes*
    updateUserStatsInternal({
        // Calculate new totals based on the changes
        totalCorrect: userStats.totalCorrect + changeInCorrect,
        totalIncorrect: userStats.totalIncorrect + changeInIncorrect,
        cardsLearned: Math.max(0, userStats.cardsLearned + changeInLearned),
    });
  }, [userStats.totalCorrect, userStats.totalIncorrect, userStats.cardsLearned, updateUserStatsInternal]); // Depend on specific stats being updated


  const deleteFlashcard = useCallback((id: string) => {
    setFlashcards((prev) => prev.filter((flashcard) => flashcard.id !== id));
    toast({ title: 'Flashcard borttagen', description: 'Flashcard har raderats från din samling.' });
    updateUserStatsInternal({});
  }, [updateUserStatsInternal]);


  const getFlashcard = useCallback((id: string): Flashcard | undefined => {
    return flashcards.find((flashcard) => flashcard.id === id);
  }, [flashcards]);


  const getFlashcardsByCategory = useCallback((category: string): Flashcard[] => {
    return flashcards.filter((flashcard) => flashcard.category === category);
  }, [flashcards]);


  const getFlashcardsByProgram = useCallback((programId: string): Flashcard[] => {
    const program = programs.find((p) => p.id === programId);
    if (!program) return [];
    return program.flashcards
      .map((id) => flashcards.find((f) => f.id === id))
      .filter((f): f is Flashcard => f !== undefined);
  }, [programs, flashcards]);


  const markProgramCompleted = useCallback((programId: string) => {
    const program = programs.find((p) => p.id === programId);
    setUserStats((prev) => {
      if (!prev.completedPrograms.includes(programId)) {
        const updatedCompletedPrograms = [...prev.completedPrograms, programId];
        if (program) {
          addAuthAchievement({ name: `Avklarat: ${program.name}`, description: `Slutfört programmet "${program.name}"!`, icon: 'trophy' });
          // Category mastery check
          const categoryPrograms = programs.filter((p) => p.category === program.category);
          const allInCategoryCompleted = categoryPrograms.every(p => updatedCompletedPrograms.includes(p.id));
          if (allInCategoryCompleted && categoryPrograms.length > 0) {
            const category = categories.find((c) => c.id === program.category);
            if (category) addAuthAchievement({ name: `${category.name} Mästare`, description: `Slutfört alla program i kategorin ${category.name}!`, icon: 'award' });
          }
        }
        return { ...prev, completedPrograms: updatedCompletedPrograms, lastActivity: Date.now() };
      }
      return { ...prev, lastActivity: Date.now() }; // Update activity even if already done
    });
  }, [programs, categories, addAuthAchievement]);


  const getProgram = useCallback((programId: string): Program | undefined => {
    return programs.find((program) => program.id === programId);
  }, [programs]);


  const getProgramsByCategory = useCallback((category: string): Program[] => {
    return programs.filter((program) => program.category === category);
  }, [programs]);


  const getCategory = useCallback((categoryId: string): Category | undefined => {
    return categories.find((category) => category.id === categoryId);
  }, [categories]);

  // Memoize context value
  const contextValue = useMemo(() => ({
    flashcards,
    programs,
    categories,
    userStats,
    isContextLoading, // Provide loading state
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
  }), [
      flashcards, programs, categories, userStats, isContextLoading,
      addFlashcard, updateFlashcard, deleteFlashcard, getFlashcard,
      getFlashcardsByCategory, getFlashcardsByProgram, updateUserStatsInternal,
      markProgramCompleted, getProgram, getProgramsByCategory, getCategory
  ]);

  console.log("LocalStorageContext: Rendering Provider. isContextLoading:", isContextLoading, "UserStats:", userStats);


  return (
    <LocalStorageContext.Provider value={contextValue}>
      {children}
    </LocalStorageContext.Provider>
  );
};