import React, { createContext, useContext, useState, useEffect, ReactNode, FC } from 'react';
import { toast } from '@/hooks/use-toast';
import { Flashcard } from '@/types/flashcard';
import { Category } from '@/types/category';
import { Program } from '@/types/program';
import { UserStats, UserAchievement } from '@/types/user';
import { initialCategories } from '@/data/categories';
import { initialPrograms } from '@/data/programs';
// Import the NEW aggregated flashcard array
import { allFlashcards } from '@/data/flashcards/index';
import { initialUserStats } from '@/data/user';

type LocalStorageContextType = {
  flashcards: Flashcard[];
  programs: Program[];
  categories: Category[];
  userStats: UserStats;
  addFlashcard: (flashcard: Omit<Flashcard, 'id'>) => void;
  updateFlashcard: (id: string, updates: Partial<Flashcard>) => void;
  deleteFlashcard: (id: string) => void;
  getFlashcard: (id: string) => Flashcard | undefined;
  getFlashcardsByCategory: (category: string) => Flashcard[];
  getFlashcardsByProgram: (programId: string) => Flashcard[];
  updateUserStats: (updates: Partial<UserStats>) => void;
  addAchievement: (achievement: Omit<UserAchievement, 'id' | 'dateEarned'>) => void;
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
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [userStats, setUserStats] = useState<UserStats>(initialUserStats);

  // Load initial data from local storage or use default values
  useEffect(() => {
    const storedFlashcards = localStorage.getItem('flashcards');
    const storedPrograms = localStorage.getItem('programs');
    const storedCategories = localStorage.getItem('categories');
    const storedUserStats = localStorage.getItem('userStats');

    if (storedFlashcards) {
      setFlashcards(JSON.parse(storedFlashcards));
    } else {
      // Use the new aggregated list for initialization if local storage is empty
      setFlashcards(allFlashcards);
      localStorage.setItem('flashcards', JSON.stringify(allFlashcards));
    }

    if (storedPrograms) {
      setPrograms(JSON.parse(storedPrograms));
    } else {
      setPrograms(initialPrograms);
      localStorage.setItem('programs', JSON.stringify(initialPrograms));
    }

    if (storedCategories) {
      setCategories(JSON.parse(storedCategories));
    } else {
      setCategories(initialCategories);
      localStorage.setItem('categories', JSON.stringify(initialCategories));
    }

    if (storedUserStats) {
      setUserStats(JSON.parse(storedUserStats));
    } else {
      // Set initialUserStats state first
      setUserStats(initialUserStats);
      // Then save it to localStorage
      localStorage.setItem('userStats', JSON.stringify(initialUserStats));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on mount

  // Save to local storage whenever data changes
  useEffect(() => {
    // Avoid writing the initial default data back immediately if it was just loaded
    if (flashcards.length > 0) {
       localStorage.setItem('flashcards', JSON.stringify(flashcards));
    }
  }, [flashcards]);

  useEffect(() => {
    if (programs.length > 0) {
      localStorage.setItem('programs', JSON.stringify(programs));
    }
  }, [programs]);

  useEffect(() => {
     if (categories.length > 0) {
       localStorage.setItem('categories', JSON.stringify(categories));
     }
  }, [categories]);

  useEffect(() => {
    // Check if userStats is different from initial before saving, or just save
     localStorage.setItem('userStats', JSON.stringify(userStats));
  }, [userStats]);


  // Handle streak updates - This logic seems fine as is.
  useEffect(() => {
    const checkAndUpdateStreak = () => {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
        const lastActivityDate = new Date(userStats.lastActivity).getTime();
        const oneDayMs = 24 * 60 * 60 * 1000;

        // Ensure lastActivity is a valid timestamp before proceeding
        if (userStats.lastActivity === 0 || isNaN(lastActivityDate)) {
            // First activity or invalid stored date, set today as last activity, streak = 1
            console.log("Initializing streak");
            setUserStats(prev => ({ ...prev, streak: 1, lastActivity: today }));
            return;
        }

        const lastActivityDay = new Date(new Date(lastActivityDate).getFullYear(), new Date(lastActivityDate).getMonth(), new Date(lastActivityDate).getDate()).getTime();
        const daysSinceLastActivity = Math.floor((today - lastActivityDay) / oneDayMs);

        console.log(`Today: ${today}, LastActivityDay: ${lastActivityDay}, Days Since: ${daysSinceLastActivity}`);


        if (daysSinceLastActivity === 0) {
            // Already active today, no streak update needed
            console.log("Already active today");
            return;
        } else if (daysSinceLastActivity === 1) {
            // Active consecutive days, increment streak
            const newStreak = userStats.streak + 1;
            console.log(`Incrementing streak to ${newStreak}`);
            setUserStats(prev => ({ ...prev, streak: newStreak, lastActivity: today }));

            // Check for streak achievements
            if (newStreak === 7) {
                 addAchievement({
                     name: '7-dagars Streak',
                     description: 'Använt Learny 7 dagar i rad!',
                     icon: 'flame',
                 });
            } else if (newStreak === 30) {
                 addAchievement({
                     name: '30-dagars Streak',
                     description: 'Använt Learny 30 dagar i rad!',
                     icon: 'flame',
                 });
            }
         } else if (daysSinceLastActivity > 1) {
            // Streak broken, reset to 1
            console.log("Streak broken, resetting to 1");
            setUserStats(prev => ({ ...prev, streak: 1, lastActivity: today }));
         }
    };

    // We need a mechanism to trigger this check daily or on significant user action.
    // Running it only on mount of LocalStorageProvider might not be sufficient
    // if the app stays open across midnight.
    // For simplicity now, it checks when the app loads/context initializes.
    // A better approach might involve checking on specific user interactions (e.g., completing a card).
    // Let's trigger it here for now, assuming app reload/visit triggers context init.
    checkAndUpdateStreak();

  // Depend on userStats.lastActivity to re-run if it changes programmatically,
  // though the core logic depends on the *current time* vs the stored time.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const addFlashcard = (flashcard: Omit<Flashcard, 'id'>) => {
    const newFlashcard: Flashcard = {
      ...flashcard,
      id: `custom-${Date.now()}-${Math.random().toString(16).slice(2)}`, // More unique ID
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
  };

  const updateFlashcard = (id: string, updates: Partial<Flashcard>) => {
    setFlashcards((prev) =>
      prev.map((flashcard) =>
        flashcard.id === id ? { ...flashcard, ...updates, lastReviewed: Date.now() } : flashcard // Ensure lastReviewed updates
      )
    );
     // Optionally update user stats based on updates (e.g., if learned toggled)
     if (updates.learned !== undefined) {
         setUserStats(prev => ({
             ...prev,
             cardsLearned: prev.flashcards.filter(f => f.id === id ? updates.learned : f.learned).length
         }));
     }
     if (updates.correctCount !== undefined || updates.incorrectCount !== undefined) {
        setUserStats(prev => ({
            ...prev,
            totalCorrect: prev.flashcards.reduce((sum, f) => sum + (f.id === id ? (updates.correctCount ?? f.correctCount ?? 0) : (f.correctCount ?? 0)), 0),
            totalIncorrect: prev.flashcards.reduce((sum, f) => sum + (f.id === id ? (updates.incorrectCount ?? f.incorrectCount ?? 0) : (f.incorrectCount ?? 0)), 0),
        }));
     }
  };

  const deleteFlashcard = (id: string) => {
    setFlashcards((prev) => prev.filter((flashcard) => flashcard.id !== id));
    toast({
      title: 'Flashcard borttagen',
      description: 'Flashcard har raderats från din samling.',
    });
  };

  const getFlashcard = (id: string) => {
    return flashcards.find((flashcard) => flashcard.id === id);
  };

  const getFlashcardsByCategory = (category: string) => {
    return flashcards.filter((flashcard) => flashcard.category === category);
  };

  const getFlashcardsByProgram = (programId: string) => {
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
        // Always ensure lastActivity reflects the latest interaction time
        lastActivity: Date.now()
    }));
  };


  const addAchievement = (achievement: Omit<UserAchievement, 'id' | 'dateEarned' | 'displayed'>) => {
    const newAchievement: UserAchievement = {
      ...achievement,
      id: `achievement-${Date.now()}-${Math.random().toString(16).slice(2)}`, // More unique ID
      dateEarned: Date.now(),
      displayed: false, // New achievements are not displayed initially
    };

    // Check if an achievement with the same name already exists
    const exists = userStats.achievements.some((a) => a.name === achievement.name);
    if (exists) {
        console.log(`Achievement "${achievement.name}" already earned.`);
        return; // Don't add duplicates
    }

     console.log(`Adding achievement: ${achievement.name}`);
    setUserStats((prev) => ({
      ...prev,
      achievements: [...prev.achievements, newAchievement],
    }));

    // Show a toast immediately for the new achievement
    toast({
      title: 'Ny utmärkelse!',
      description: `Du har låst upp "${achievement.name}"!`,
    });
  };


  const markProgramCompleted = (programId: string) => {
    // First update the program state (if needed, though maybe not necessary if only tracking in userStats)
    // setPrograms((prev) =>
    //   prev.map((program) =>
    //     program.id === programId ? { ...program, completedByUser: true } : program
    //   )
    // );

    const program = programs.find((p) => p.id === programId);

    // Add to user's completed programs if not already there
    if (!userStats.completedPrograms.includes(programId)) {
       console.log(`Marking program ${programId} (${program?.name}) as completed.`);
       const updatedCompletedPrograms = [...userStats.completedPrograms, programId];

       setUserStats((prev) => ({
         ...prev,
         completedPrograms: updatedCompletedPrograms,
       }));


      // Add achievement for program completion
      if (program) {
        addAchievement({
          name: `Avklarat: ${program.name}`,
          description: `Slutfört programmet "${program.name}"!`,
          icon: 'trophy',
        });

        // Check for category mastery (completing all programs in a category)
        const categoryPrograms = programs.filter((p) => p.category === program.category);
        const allInCategoryCompleted = categoryPrograms.every(p => updatedCompletedPrograms.includes(p.id));

        if (allInCategoryCompleted && categoryPrograms.length > 0) {
          const category = categories.find((c) => c.id === program.category);
          if (category) {
            addAchievement({
              name: `${category.name} Mästare`,
              description: `Slutfört alla program i kategorin ${category.name}!`,
              icon: 'award', // Changed to 'award' for distinction
            });
          }
        }
      }
    } else {
        console.log(`Program ${programId} (${program?.name}) was already completed.`);
    }
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
    updateUserStats: updateUserStatsInternal, // Use the internal wrapper
    addAchievement,
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