
import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialFlashcards } from '@/data/flashcards';
import { initialCategories } from '@/data/categories';
import { initialUserStats } from '@/data/user';
import type { Program } from '@/types/program';
import type { Category } from '@/types/category';
import { UserStats, UserAchievement } from '@/types/user';

export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  lastReviewed?: number;
  nextReview?: number;
  reviewCount?: number;
  knowledgeLevel?: number;
}

interface LocalStorageContextType {
  flashcards: Flashcard[];
  categories: Category[];
  programs: Program[];
  userStats: UserStats;
  getFlashcardsByCategory: (category: string) => Flashcard[];
  getTopicsByCategory: (category: string) => string[];
  markReviewed: (id: string, knowledgeLevel: number) => void;
  getDueFlashcards: () => Flashcard[];
  getRecentlyReviewedFlashcards: () => Flashcard[];
  addCustomFlashcard: (flashcard: Omit<Flashcard, 'id'>) => void;
  addFlashcard: (flashcard: Omit<Flashcard, 'id'>) => void;
  deleteFlashcard: (id: string) => void;
  editFlashcard: (id: string, flashcard: Partial<Flashcard>) => void;
  resetProgress: () => void;
  exportFlashcards: () => string;
  importFlashcards: (data: string) => boolean;
  getProgram: (id: string) => Program | undefined;
  getFlashcardsByProgram: (programId: string) => Flashcard[];
  getProgramsByCategory: (categoryId: string) => Program[];
  getCategory: (id: string) => Category | undefined;
  markProgramCompleted: (programId: string) => void;
  updateUserStats: (stats: Partial<UserStats>) => void;
  addAchievement: (achievement: { name: string; description: string; icon: string }) => void;
}

const LocalStorageContext = createContext<LocalStorageContextType | undefined>(undefined);

export const LocalStorageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [categories] = useState<Category[]>(initialCategories);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [userStats, setUserStats] = useState<UserStats>(initialUserStats);
  
  // Load flashcards from local storage on initial load
  useEffect(() => {
    const storedFlashcards = localStorage.getItem('flashcards');
    if (storedFlashcards) {
      setFlashcards(JSON.parse(storedFlashcards));
    } else {
      // Initialize with default flashcards if none exist
      setFlashcards(initialFlashcards);
      localStorage.setItem('flashcards', JSON.stringify(initialFlashcards));
    }

    // Load programs
    const storedPrograms = localStorage.getItem('programs');
    if (storedPrograms) {
      setPrograms(JSON.parse(storedPrograms));
    } else {
      // We would normally initialize with default programs
      // but we'll just use an empty array for now
      setPrograms([]);
    }

    // Load user stats
    const storedUserStats = localStorage.getItem('userStats');
    if (storedUserStats) {
      setUserStats(JSON.parse(storedUserStats));
    } else {
      setUserStats(initialUserStats);
      localStorage.setItem('userStats', JSON.stringify(initialUserStats));
    }

    // Update streak on app start
    updateStreak();
  }, []);

  // Save flashcards to local storage whenever they change
  useEffect(() => {
    if (flashcards.length > 0) {
      localStorage.setItem('flashcards', JSON.stringify(flashcards));
    }
  }, [flashcards]);

  // Save programs to local storage whenever they change
  useEffect(() => {
    localStorage.setItem('programs', JSON.stringify(programs));
  }, [programs]);

  // Save user stats to local storage whenever they change
  useEffect(() => {
    localStorage.setItem('userStats', JSON.stringify(userStats));
  }, [userStats]);

  // Update user streak
  const updateStreak = () => {
    const now = new Date();
    const today = now.setHours(0, 0, 0, 0);
    const lastActivity = userStats.lastActivity;
    
    // If last activity was yesterday, increment streak
    if (lastActivity > 0) {
      const oneDayMs = 24 * 60 * 60 * 1000;
      const yesterday = today - oneDayMs;
      
      if (lastActivity < today && lastActivity >= yesterday) {
        // Streak continues
        setUserStats(prev => ({
          ...prev,
          streak: prev.streak + 1,
          lastActivity: today
        }));
      } else if (lastActivity < yesterday) {
        // Streak broken
        setUserStats(prev => ({
          ...prev,
          streak: 1,
          lastActivity: today
        }));
      }
    } else {
      // First activity
      setUserStats(prev => ({
        ...prev,
        streak: 1,
        lastActivity: today
      }));
    }
  };

  // Get flashcards by category
  const getFlashcardsByCategory = (category: string) => {
    return flashcards.filter(card => card.category === category);
  };

  // Extract topics from flashcards for a category
  const getTopicsByCategory = (category: string) => {
    const cards = getFlashcardsByCategory(category);
    const topics = new Set<string>();
    
    cards.forEach(card => {
      // Extract topic from question (format: "[Topic] Question")
      const match = card.question.match(/^\[([^\]]+)\]/);
      if (match) {
        topics.add(match[1]);
      }
    });
    
    return Array.from(topics);
  };

  // Mark a flashcard as reviewed
  const markReviewed = (id: string, knowledgeLevel: number) => {
    setFlashcards(prevCards => 
      prevCards.map(card => {
        if (card.id === id) {
          const now = Date.now();
          const reviewCount = (card.reviewCount || 0) + 1;
          
          // Calculate next review time based on knowledge level
          // 1 = difficult (review in 1 day)
          // 2 = moderate (review in 3 days)
          // 3 = easy (review in 7 days)
          let nextReviewDays = 1;
          if (knowledgeLevel === 2) nextReviewDays = 3;
          if (knowledgeLevel === 3) nextReviewDays = 7;
          
          const nextReview = now + (nextReviewDays * 24 * 60 * 60 * 1000);
          
          return {
            ...card,
            lastReviewed: now,
            nextReview,
            reviewCount,
            knowledgeLevel
          };
        }
        return card;
      })
    );
  };

  // Get flashcards due for review
  const getDueFlashcards = () => {
    const now = Date.now();
    return flashcards
      .filter(card => (card.nextReview || 0) <= now)
      .sort((a, b) => (a.nextReview || 0) - (b.nextReview || 0));
  };

  // Get recently reviewed flashcards
  const getRecentlyReviewedFlashcards = () => {
    return flashcards
      .filter(card => card.lastReviewed)
      .sort((a, b) => (b.lastReviewed || 0) - (a.lastReviewed || 0))
      .slice(0, 10);
  };

  // Add a custom flashcard
  const addCustomFlashcard = (flashcard: Omit<Flashcard, 'id'>) => {
    const newCard: Flashcard = {
      ...flashcard,
      id: `custom-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    };
    
    setFlashcards(prev => [...prev, newCard]);
  };

  // Add a regular flashcard (alias for addCustomFlashcard for backward compatibility)
  const addFlashcard = addCustomFlashcard;

  // Delete a flashcard
  const deleteFlashcard = (id: string) => {
    setFlashcards(prev => prev.filter(card => card.id !== id));
  };

  // Edit a flashcard
  const editFlashcard = (id: string, flashcardUpdates: Partial<Flashcard>) => {
    setFlashcards(prev => 
      prev.map(card => 
        card.id === id ? { ...card, ...flashcardUpdates } : card
      )
    );
  };

  // Reset all progress (review data)
  const resetProgress = () => {
    setFlashcards(prev => 
      prev.map(card => ({
        ...card,
        lastReviewed: undefined,
        nextReview: undefined,
        reviewCount: undefined,
        knowledgeLevel: undefined
      }))
    );
  };

  // Export flashcards to JSON string
  const exportFlashcards = () => {
    return JSON.stringify(flashcards);
  };

  // Import flashcards from JSON string
  const importFlashcards = (data: string) => {
    try {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        setFlashcards(parsed);
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  };

  // Get a program by ID
  const getProgram = (id: string) => {
    return programs.find(program => program.id === id);
  };

  // Get flashcards for a specific program
  const getFlashcardsByProgram = (programId: string) => {
    const program = getProgram(programId);
    if (!program) return [];
    
    return program.flashcards
      .map(cardId => flashcards.find(card => card.id === cardId))
      .filter((card): card is Flashcard => card !== undefined);
  };

  // Get programs by category
  const getProgramsByCategory = (categoryId: string) => {
    return programs.filter(program => program.category === categoryId);
  };

  // Get category by ID
  const getCategory = (id: string) => {
    return categories.find(category => category.id === id);
  };

  // Mark a program as completed
  const markProgramCompleted = (programId: string) => {
    if (!userStats.completedPrograms.includes(programId)) {
      setUserStats(prev => ({
        ...prev,
        completedPrograms: [...prev.completedPrograms, programId]
      }));
    }
  };

  // Update user stats
  const updateUserStats = (stats: Partial<UserStats>) => {
    setUserStats(prev => ({
      ...prev,
      ...stats,
      lastActivity: Date.now() // Always update last activity
    }));
  };

  // Add an achievement
  const addAchievement = (achievement: { name: string; description: string; icon: string }) => {
    const newAchievement: UserAchievement = {
      id: `achievement-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      name: achievement.name,
      description: achievement.description,
      icon: achievement.icon,
      dateEarned: Date.now(),
      displayed: false
    };
    
    setUserStats(prev => ({
      ...prev,
      achievements: [...prev.achievements, newAchievement]
    }));
  };

  const value = {
    flashcards,
    categories,
    programs,
    userStats,
    getFlashcardsByCategory,
    getTopicsByCategory,
    markReviewed,
    getDueFlashcards,
    getRecentlyReviewedFlashcards,
    addCustomFlashcard,
    addFlashcard,
    deleteFlashcard,
    editFlashcard,
    resetProgress,
    exportFlashcards,
    importFlashcards,
    getProgram,
    getFlashcardsByProgram,
    getProgramsByCategory,
    getCategory,
    markProgramCompleted,
    updateUserStats,
    addAchievement
  };

  return (
    <LocalStorageContext.Provider value={value}>
      {children}
    </LocalStorageContext.Provider>
  );
};

export const useLocalStorage = () => {
  const context = useContext(LocalStorageContext);
  if (!context) {
    throw new Error('useLocalStorage must be used within a LocalStorageProvider');
  }
  return context;
};
