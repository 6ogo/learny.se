
import React, { createContext, useContext, useState, useEffect, ReactNode, FC } from 'react';
import { toast } from '@/hooks/use-toast';
import { Flashcard } from '@/types/flashcard';
import { Category } from '@/types/category';
import { Program } from '@/types/program';
import { UserStats, UserAchievement } from '@/types/user';
import { initialCategories } from '@/data/categories';
import { initialPrograms } from '@/data/programs';
import { initialFlashcards } from '@/data/flashcards';
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
      setFlashcards(initialFlashcards);
      localStorage.setItem('flashcards', JSON.stringify(initialFlashcards));
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
      localStorage.setItem('userStats', JSON.stringify(initialUserStats));
    }
  }, []);

  // Save to local storage whenever data changes
  useEffect(() => {
    localStorage.setItem('flashcards', JSON.stringify(flashcards));
  }, [flashcards]);

  useEffect(() => {
    localStorage.setItem('programs', JSON.stringify(programs));
  }, [programs]);

  useEffect(() => {
    localStorage.setItem('categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('userStats', JSON.stringify(userStats));
  }, [userStats]);

  // Handle streak updates
  useEffect(() => {
    const checkAndUpdateStreak = () => {
      const now = Date.now();
      const lastActivity = userStats.lastActivity;
      const oneDayMs = 24 * 60 * 60 * 1000;

      if (lastActivity === 0) {
        // First time user, set lastActivity to now
        updateUserStats({ lastActivity: now });
        return;
      }

      const daysSinceLastActivity = Math.floor((now - lastActivity) / oneDayMs);

      if (daysSinceLastActivity === 0) {
        // Already active today, no streak update needed
        return;
      } else if (daysSinceLastActivity === 1) {
        // Active consecutive days, increment streak
        updateUserStats({
          streak: userStats.streak + 1,
          lastActivity: now,
        });

        // Check if this is a streak milestone for achievement
        if (userStats.streak + 1 === 7) {
          addAchievement({
            name: '7-dagars Streak',
            description: 'Använt Learny 7 dagar i rad!',
            icon: 'flame',
          });
        } else if (userStats.streak + 1 === 30) {
          addAchievement({
            name: '30-dagars Streak',
            description: 'Använt Learny 30 dagar i rad!',
            icon: 'flame',
          });
        }
      } else {
        // Streak broken, reset to 1
        updateUserStats({
          streak: 1,
          lastActivity: now,
        });
      }
    };

    checkAndUpdateStreak();
  }, []);

  const addFlashcard = (flashcard: Omit<Flashcard, 'id'>) => {
    const newFlashcard = {
      ...flashcard,
      id: `custom-${Date.now()}`,
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
        flashcard.id === id ? { ...flashcard, ...updates } : flashcard
      )
    );
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

  const updateUserStats = (updates: Partial<UserStats>) => {
    setUserStats((prev) => ({ ...prev, ...updates }));
  };

  const addAchievement = (achievement: Omit<UserAchievement, 'id' | 'dateEarned'>) => {
    const newAchievement = {
      ...achievement,
      id: `achievement-${Date.now()}`,
      dateEarned: Date.now(),
      displayed: false,
    };

    // Check if the achievement already exists
    const exists = userStats.achievements.some((a) => a.name === achievement.name);
    if (exists) return;

    updateUserStats({
      achievements: [...userStats.achievements, newAchievement],
    });

    toast({
      title: 'Ny utmärkelse!',
      description: `Du har låst upp "${achievement.name}"!`,
    });
  };

  const markProgramCompleted = (programId: string) => {
    // First update the program to mark as completed
    setPrograms((prev) =>
      prev.map((program) =>
        program.id === programId ? { ...program, completedByUser: true } : program
      )
    );

    // Then add to user's completed programs if not already there
    if (!userStats.completedPrograms.includes(programId)) {
      updateUserStats({
        completedPrograms: [...userStats.completedPrograms, programId],
      });

      // Add achievement for program completion
      const program = programs.find((p) => p.id === programId);
      if (program) {
        addAchievement({
          name: `Avklarat: ${program.name}`,
          description: `Slutfört programmet "${program.name}"!`,
          icon: 'trophy',
        });

        // Check for category mastery (completing all programs in a category)
        const categoryPrograms = programs.filter((p) => p.category === program.category);
        const completedInCategory = categoryPrograms.filter(
          (p) => userStats.completedPrograms.includes(p.id) || p.id === programId
        );

        if (completedInCategory.length === categoryPrograms.length) {
          const category = categories.find((c) => c.id === program.category);
          if (category) {
            addAchievement({
              name: `${category.name} Mästare`,
              description: `Slutfört alla program i kategorin ${category.name}!`,
              icon: 'award',
            });
          }
        }
      }
    }
  };

  const getProgram = (programId: string) => {
    return programs.find((program) => program.id === programId);
  };

  const getProgramsByCategory = (category: string) => {
    return programs.filter((program) => program.category === category);
  };

  const getCategory = (categoryId: string) => {
    return categories.find((category) => category.id === categoryId);
  };

  const contextValue = {
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
    updateUserStats,
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
