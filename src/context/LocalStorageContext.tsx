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
  addFlashcard: (flashcard: Omit<Flashcard, 'id' | 'correctCount' | 'incorrectCount' | 'lastReviewed' | 'nextReview' | 'learned' | 'reviewLater'>) => void;
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

// Create the context
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
  const [isDataLoaded, setIsDataLoaded] = useState(false); // Flag to track initial load

  // Single useEffect for loading data and initial streak check
  useEffect(() => {
    console.log("LocalStorageProvider Mount: Loading data...");
    let loadedFlashcards = allFlashcards;
    let loadedPrograms = initialPrograms;
    let loadedCategories = initialCategories;
    let loadedUserStats = { ...initialUserStats }; // Important: clone initial stats

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
      // Make sure the loaded stats have all required fields, merging with initial if needed
      if (storedUserStats) {
           const parsedStats = JSON.parse(storedUserStats);
           loadedUserStats = {
               ...initialUserStats, // Start with defaults
               ...parsedStats // Override with stored values
           };
       }
    } catch (e) { console.error("Error parsing stored userStats:", e); }

    // Set initial state from loaded data
    setFlashcards(loadedFlashcards);
    setPrograms(loadedPrograms);
    setCategories(loadedCategories);

    // --- Streak Logic START ---
    const checkAndUpdateStreak = (currentStats: UserStats): UserStats => {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
        // Ensure lastActivity is a number before creating a Date object
        const lastActivityTimestamp = typeof currentStats.lastActivity === 'number' ? currentStats.lastActivity : 0;
        const lastActivityDate = new Date(lastActivityTimestamp).getTime();
        const oneDayMs = 24 * 60 * 60 * 1000;

        // If lastActivity is 0 or invalid, it's the first session or reset needed
        if (lastActivityTimestamp === 0 || isNaN(lastActivityDate)) {
            console.log("Initializing streak");
            // Return updated stats based on currentStats, but with streak=1 and today's activity
             return { ...currentStats, streak: 1, lastActivity: today };
        }

        const lastActivityDay = new Date(new Date(lastActivityTimestamp).getFullYear(), new Date(lastActivityTimestamp).getMonth(), new Date(lastActivityTimestamp).getDate()).getTime();
        const daysSinceLastActivity = Math.floor((today - lastActivityDay) / oneDayMs);

        console.log(`Streak Check: Today=${today}, LastActivityDay=${lastActivityDay}, Days Since=${daysSinceLastActivity}, Current Streak=${currentStats.streak}`);

        if (daysSinceLastActivity === 0) {
            console.log("Already active today, streak unchanged.");
            // If already active today, ensure lastActivity is *today* but don't change streak
            return { ...currentStats, lastActivity: today };
        } else if (daysSinceLastActivity === 1) {
            const newStreak = currentStats.streak + 1;
            console.log(`Incrementing streak to ${newStreak}`);
            // Check for streak achievements (use addAuthAchievement)
            if (newStreak === 7) {
                 addAuthAchievement({ name: '7-dagars Streak', description: 'Använt Learny 7 dagar i rad!', icon: 'flame' });
            } else if (newStreak === 30) {
                 addAuthAchievement({ name: '30-dagars Streak', description: 'Använt Learny 30 dagar i rad!', icon: 'flame' });
            }
            return { ...currentStats, streak: newStreak, lastActivity: today };
        } else { // daysSinceLastActivity > 1
            console.log("Streak broken, resetting to 1.");
             return { ...currentStats, streak: 1, lastActivity: today };
        }
    };

    // Calculate the potentially updated stats *before* setting state
    const finalInitialStats = checkAndUpdateStreak(loadedUserStats);
    setUserStats(finalInitialStats); // Set the final calculated initial state
    // --- Streak Logic END ---

    setIsDataLoaded(true); // Mark data as loaded
    console.log("LocalStorageProvider Mount: Data loaded and streak checked.");

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only ONCE on mount


  // Save to local storage whenever data changes *after* initial load
  useEffect(() => {
    if (!isDataLoaded) return; // Don't save during initial load race condition
    console.log("Saving flashcards to localStorage", flashcards.length);
    localStorage.setItem('flashcards', JSON.stringify(flashcards));
  }, [flashcards, isDataLoaded]);

  useEffect(() => {
    if (!isDataLoaded) return;
    console.log("Saving programs to localStorage", programs.length);
    localStorage.setItem('programs', JSON.stringify(programs));
  }, [programs, isDataLoaded]);

  useEffect(() => {
     if (!isDataLoaded) return;
     console.log("Saving categories to localStorage", categories.length);
     localStorage.setItem('categories', JSON.stringify(categories));
  }, [categories, isDataLoaded]);

  useEffect(() => {
    if (!isDataLoaded) return;
    console.log("Saving userStats to localStorage", userStats);
    localStorage.setItem('userStats', JSON.stringify(userStats));
  }, [userStats, isDataLoaded]);


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
    // Update last activity when a card is added
    updateUserStatsInternal({});
  };

  const updateFlashcard = (id: string, updates: Partial<Flashcard>) => {
    let wasCorrectIncrement = false;
    let wasLearnedIncrement = false;
    let wasLearnedDecrement = false;

    // Update the flashcards state first
    setFlashcards((prevFlashcards) =>
      prevFlashcards.map((f) => {
        if (f.id === id) {
          const updatedCard = { ...f, ...updates, lastReviewed: Date.now() };
          // Check if correct count increased
          if (updates.correctCount !== undefined && updates.correctCount > (f.correctCount || 0)) {
             wasCorrectIncrement = true;
          }
          // Check if learned status changed
          if (updates.learned === true && f.learned !== true) {
             wasLearnedIncrement = true;
          }
          if (updates.learned === false && f.learned === true) {
             wasLearnedDecrement = true;
          }
          return updatedCard;
        }
        return f;
      })
    );

    // Then update user stats based on the changes
    setUserStats((prevStats) => {
       let newTotalCorrect = prevStats.totalCorrect;
       let newTotalIncorrect = prevStats.totalIncorrect; // Assuming incorrect updates also happen here if needed
       let newCardsLearned = prevStats.cardsLearned;

       // Find the original card to compare counts if necessary (e.g., for incorrect updates)
       const originalCard = flashcards.find(f => f.id === id);
       if (updates.incorrectCount !== undefined && originalCard && updates.incorrectCount > (originalCard.incorrectCount || 0)) {
           newTotalIncorrect = prevStats.totalIncorrect + 1; // Increment global count
       }

       if (wasCorrectIncrement) {
         newTotalCorrect = prevStats.totalCorrect + 1; // Increment global count
       }
       if (wasLearnedIncrement) {
           newCardsLearned = prevStats.cardsLearned + 1;
       } else if (wasLearnedDecrement) {
           newCardsLearned = Math.max(0, prevStats.cardsLearned - 1); // Ensure it doesn't go below 0
       }

       return {
           ...prevStats,
           totalCorrect: newTotalCorrect,
           totalIncorrect: newTotalIncorrect,
           cardsLearned: newCardsLearned,
           lastActivity: Date.now() // Always update activity on card interaction
       };
   });
};


  const deleteFlashcard = (id: string) => {
    setFlashcards((prev) => prev.filter((flashcard) => flashcard.id !== id));
    toast({
      title: 'Flashcard borttagen',
      description: 'Flashcard har raderats från din samling.',
    });
     // Update last activity when a card is deleted
    updateUserStatsInternal({});
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

  // This function is the main way to trigger stat updates and lastActivity timestamp
  const updateUserStatsInternal = (updates: Partial<UserStats>) => {
    setUserStats((prev) => ({
        ...prev,
        ...updates,
        // ALWAYS update lastActivity timestamp when stats are explicitly updated or user interacts
        lastActivity: Date.now()
    }));
  };

  const markProgramCompleted = (programId: string) => {
    const program = programs.find((p) => p.id === programId);

    setUserStats((prev) => {
      if (!prev.completedPrograms.includes(programId)) {
        console.log(`Marking program ${programId} (${program?.name}) as completed.`);
        const updatedCompletedPrograms = [...prev.completedPrograms, programId];

        // Trigger achievement outside of setUserStats using addAuthAchievement from Auth context
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

        // Return the updated state
        return {
          ...prev,
          completedPrograms: updatedCompletedPrograms,
          lastActivity: Date.now() // Update activity on completion
        };
      } else {
        console.log(`Program ${programId} (${program?.name}) was already completed.`);
        // Still update lastActivity even if already completed, as user interacted
        return { ...prev, lastActivity: Date.now() };
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