// src/context/LocalStorageContext.tsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Category } from '@/types/category';
import { Flashcard } from '@/types/flashcard';
import { Program } from '@/types/program';
import { UserStats } from '@/types/user';
import { supabase } from '@/integrations/supabase/client';

// Define initial state
interface LocalStorageState {
  // Collections of data
  categories: Category[];
  flashcards: Flashcard[];
  programs: Program[];
  userStats: UserStats;
  
  // Loading states
  isContextLoading: boolean;
}

// Define context methods
interface LocalStorageContextType extends LocalStorageState {
  // Data fetching methods
  fetchFlashcardsByCategory: (categoryId: string) => Promise<Flashcard[]>;
  fetchFlashcardsByProgramId: (programId: string) => Promise<Flashcard[]>;
  fetchProgramsByCategory: (categoryId: string) => Promise<Program[]>;
  fetchProgram: (programId: string) => Promise<Program | null>;
  
  // Data manipulation methods
  addCategory: (category: Category) => void;
  addFlashcard: (flashcard: Flashcard) => void;
  updateFlashcard: (id: string, updatedFlashcard: Partial<Flashcard>) => void;
  deleteFlashcard: (id: string) => void;
  
  // Helper methods
  getCategory: (id: string) => Category | undefined;
  getFlashcardsByCategory: (categoryId: string) => Flashcard[];
  markProgramCompleted: (programId: string) => void;
  updateUserStats: (partialStats: Partial<UserStats>) => void;
  
  // Context management
  initializeContext: (userId: string) => Promise<void>;
  resetContext: () => void;
}

// Create the context
const LocalStorageContext = createContext<LocalStorageContextType | undefined>(undefined);

// Default values
const defaultUserStats: UserStats = {
  streak: 0,
  lastActivity: Date.now(),
  totalCorrect: 0,
  totalIncorrect: 0,
  cardsLearned: 0,
  achievements: [],
  completedPrograms: [],
};

// Sample categories (will be replaced with DB data)
const sampleCategories: Category[] = [
  {
    id: 'medicine',
    name: 'Medicin',
    icon: 'stethoscope',
    description: 'Läkemedelslära, anatomi, fysiologi och mer',
    color: 'bg-learny-red',
  },
  {
    id: 'programming',
    name: 'Programmering',
    icon: 'code',
    description: 'Koda, algoritmer och datastrukturer',
    color: 'bg-learny-blue',
  },
  {
    id: 'languages',
    name: 'Språk',
    icon: 'languages',
    description: 'Lär dig nya språk med flashcards',
    color: 'bg-learny-purple',
  },
  {
    id: 'science',
    name: 'Vetenskap',
    icon: 'atom',
    description: 'Fysik, kemi, biologi och mer',
    color: 'bg-learny-green',
  },
];

// Provider Component
export const LocalStorageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // State initialization
  const [categories, setCategories] = useState<Category[]>(sampleCategories);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [userStats, setUserStats] = useState<UserStats>(defaultUserStats);
  const [isContextLoading, setIsContextLoading] = useState<boolean>(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  
  // Initialize context
  const initializeContext = useCallback(async (userId: string) => {
    if (userId === currentUserId && !isContextLoading) {
      console.log("LocalStorageContext: Context already initialized for", userId);
      return; // Skip if already initialized for this user and not currently loading
    }
    
    console.log("LocalStorageContext: Initializing context for user", userId);
    setIsContextLoading(true);
    setCurrentUserId(userId);
    
    try {
      // Setup timeout to prevent hanging
      const initTimeout = setTimeout(() => {
        console.log("LocalStorageContext: Init timed out");
        setIsContextLoading(false);
      }, 10000); // 10s timeout
      
      // Fetch user's flashcards
      try {
        const { data: userFlashcards, error: flashcardsError } = await supabase
          .from('flashcards')
          .select('*')
          .eq('user_id', userId);
        
        if (flashcardsError) {
          console.error("Error fetching flashcards:", flashcardsError);
        } else if (userFlashcards) {
          // Format for frontend
          const formattedFlashcards: Flashcard[] = userFlashcards.map(f => ({
            id: f.id,
            question: f.question,
            answer: f.answer,
            category: f.category,
            subcategory: f.subcategory || undefined,
            difficulty: f.difficulty as 'beginner' | 'intermediate' | 'advanced' | 'expert',
            correctCount: f.correct_count,
            incorrectCount: f.incorrect_count,
            lastReviewed: f.last_reviewed ? new Date(f.last_reviewed).getTime() : undefined,
            learned: f.learned,
            reviewLater: f.review_later,
            reportCount: f.report_count,
            reportReason: f.report_reason,
            isApproved: f.is_approved,
          }));
          
          setFlashcards(formattedFlashcards);
          
          // Generate programs based on flashcards
          const placeholderPrograms = generatePlaceholderPrograms(categories, userFlashcards);
          setPrograms(placeholderPrograms);
        }
      } catch (flashcardsError) {
        console.error("Flashcards fetch failed:", flashcardsError);
      }
      
      // Load user stats from localStorage for now
      // Will be migrated to DB later
      try {
        const savedUserStats = localStorage.getItem(`user_stats_${userId}`);
        if (savedUserStats) {
          setUserStats(JSON.parse(savedUserStats));
        } else {
          // If no saved stats, use defaults and store them
          localStorage.setItem(`user_stats_${userId}`, JSON.stringify(defaultUserStats));
          setUserStats(defaultUserStats);
        }
      } catch (storageError) {
        console.error("Error accessing localStorage:", storageError);
        setUserStats(defaultUserStats);
      }
      
      clearTimeout(initTimeout);
      console.log("LocalStorageContext: Context initialized for user", userId);
    } catch (error) {
      console.error("Error initializing LocalStorageContext:", error);
    } finally {
      setIsContextLoading(false);
    }
  }, [categories, currentUserId, isContextLoading]);
  
  // Reset context (used on logout)
  const resetContext = useCallback(() => {
    setCategories(sampleCategories);
    setFlashcards([]);
    setPrograms([]);
    setUserStats(defaultUserStats);
    setCurrentUserId(null);
    setIsContextLoading(false);
  }, []);
  
  // Helper function to generate placeholder programs
  // This will be replaced with real DB data in the future
  const generatePlaceholderPrograms = (cats: Category[], cards: any[]): Program[] => {
    const programs: Program[] = [];
    
    cats.forEach(category => {
      // Create beginner program
      programs.push({
        id: `${category.id}-beginner`,
        name: `${category.name} för nybörjare`,
        description: `Grundläggande ${category.name.toLowerCase()}.`,
        category: category.id,
        difficulty: 'beginner',
        flashcards: filterCardsByCategory(cards, category.id, 'beginner'),
        progress: Math.floor(Math.random() * 101),
        hasExam: Math.random() > 0.5,
      });
      
      // Create intermediate program
      programs.push({
        id: `${category.id}-intermediate`,
        name: `${category.name} fortsättning`,
        description: `Fortsättningskurs i ${category.name.toLowerCase()}.`,
        category: category.id,
        difficulty: 'intermediate',
        flashcards: filterCardsByCategory(cards, category.id, 'intermediate'),
        progress: Math.floor(Math.random() * 101),
        hasExam: Math.random() > 0.5,
      });
      
      // Add advanced and expert programs for some categories
      if (Math.random() > 0.5) {
        programs.push({
          id: `${category.id}-advanced`,
          name: `Avancerad ${category.name.toLowerCase()}`,
          description: `För dig som behärskar ${category.name.toLowerCase()} väl.`,
          category: category.id,
          difficulty: 'advanced',
          flashcards: filterCardsByCategory(cards, category.id, 'advanced'),
          progress: Math.floor(Math.random() * 101),
          hasExam: Math.random() > 0.5,
        });
      }
      
      if (Math.random() > 0.7) {
        programs.push({
          id: `${category.id}-expert`,
          name: `${category.name} för experter`,
          description: `Expertmaterial inom ${category.name.toLowerCase()}.`,
          category: category.id,
          difficulty: 'expert',
          flashcards: filterCardsByCategory(cards, category.id, 'expert'),
          progress: Math.floor(Math.random() * 101),
          hasExam: Math.random() > 0.5,
        });
      }
    });
    
    return programs;
  };
  
  // Helper to filter cards by category and difficulty
  const filterCardsByCategory = (cards: any[], categoryId: string, difficulty?: string): string[] => {
    return cards
      .filter(card => card.category === categoryId && (!difficulty || card.difficulty === difficulty))
      .map(card => card.id);
  };
  
  // Get a specific category by ID
  const getCategory = useCallback((id: string): Category | undefined => {
    return categories.find(category => category.id === id);
  }, [categories]);
  
  // Get flashcards for a specific category
  const getFlashcardsByCategory = useCallback((categoryId: string): Flashcard[] => {
    return flashcards.filter(card => card.category === categoryId);
  }, [flashcards]);
  
  // Mock fetch method - will be replaced with real API calls later
  const fetchFlashcardsByCategory = useCallback(async (categoryId: string): Promise<Flashcard[]> => {
    // If we're still loading or no user, return empty array after a delay
    if (isContextLoading || !currentUserId) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return [];
    }
    
    try {
      // First try to use cached data if available
      const cachedCards = flashcards.filter(card => card.category === categoryId);
      if (cachedCards.length > 0) {
        return cachedCards;
      }
      
      // If no cached data, fetch from DB
      const { data, error } = await supabase
        .from('flashcards')
        .select('*')
        .eq('category', categoryId)
        .eq('user_id', currentUserId);
      
      if (error) throw error;
      
      // Format for frontend
      return data.map(f => ({
        id: f.id,
        question: f.question,
        answer: f.answer,
        category: f.category,
        subcategory: f.subcategory || undefined,
        difficulty: f.difficulty as 'beginner' | 'intermediate' | 'advanced' | 'expert',
        correctCount: f.correct_count,
        incorrectCount: f.incorrect_count,
        lastReviewed: f.last_reviewed ? new Date(f.last_reviewed).getTime() : undefined,
        learned: f.learned,
        reviewLater: f.review_later,
        reportCount: f.report_count,
        reportReason: f.report_reason,
        isApproved: f.is_approved,
      }));
    } catch (error) {
      console.error("Error fetching flashcards by category:", error);
      return [];
    }
  }, [currentUserId, flashcards, isContextLoading]);
  
  // Fetch programs for a category
  const fetchProgramsByCategory = useCallback(async (categoryId: string): Promise<Program[]> => {
    // If we're still loading, return empty array after a delay
    if (isContextLoading) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return [];
    }
    
    // For now, just filter local programs state
    return programs.filter(program => program.category === categoryId);
  }, [isContextLoading, programs]);
  
  // Fetch flashcards for a program
  const fetchFlashcardsByProgramId = useCallback(async (programId: string): Promise<Flashcard[]> => {
    // If we're still loading, return empty array after a delay
    if (isContextLoading) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return [];
    }
    
    const program = programs.find(p => p.id === programId);
    if (!program) return [];
    
    // Get flashcards that are part of this program
    return flashcards.filter(card => program.flashcards.includes(card.id));
  }, [flashcards, isContextLoading, programs]);
  
  // Fetch a single program
  const fetchProgram = useCallback(async (programId: string): Promise<Program | null> => {
    // If we're still loading, return null after a delay
    if (isContextLoading) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return null;
    }
    
    const program = programs.find(p => p.id === programId);
    return program || null;
  }, [isContextLoading, programs]);
  
  // Mark a program as completed
  const markProgramCompleted = useCallback((programId: string) => {
    setUserStats(prev => {
      if (prev.completedPrograms.includes(programId)) {
        return prev;
      }
      
      const updated = {
        ...prev,
        completedPrograms: [...prev.completedPrograms, programId]
      };
      
      // Update local storage
      if (currentUserId) {
        localStorage.setItem(`user_stats_${currentUserId}`, JSON.stringify(updated));
      }
      
      return updated;
    });
  }, [currentUserId]);
  
  // Update user stats
  const updateUserStats = useCallback((partialStats: Partial<UserStats>) => {
    setUserStats(prev => {
      const updated = { ...prev, ...partialStats };
      
      // Always update lastActivity on any stats update
      updated.lastActivity = Date.now();
      
      // Check streak
      const today = new Date().toISOString().split('T')[0];
      const lastDate = prev.lastActivity ? new Date(prev.lastActivity).toISOString().split('T')[0] : null;
      
      if (lastDate !== today) {
        if (!lastDate || isYesterday(new Date(prev.lastActivity))) {
          // Either first activity or continued streak
          updated.streak = prev.streak + 1;
        } else {
          // Streak broken
          updated.streak = 1;
        }
      }
      
      // Update local storage
      if (currentUserId) {
        localStorage.setItem(`user_stats_${currentUserId}`, JSON.stringify(updated));
      }
      
      return updated;
    });
  }, [currentUserId]);
  
  // Check if date is yesterday
  const isYesterday = (date: Date): boolean => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday.toISOString().split('T')[0] === date.toISOString().split('T')[0];
  };
  
  // Add a new category
  const addCategory = useCallback((category: Category) => {
    setCategories(prev => [...prev, category]);
  }, []);
  
  // Add a new flashcard
  const addFlashcard = useCallback((flashcard: Flashcard) => {
    setFlashcards(prev => [...prev, flashcard]);
  }, []);
  
  // Update a flashcard
  const updateFlashcard = useCallback((id: string, updatedFlashcard: Partial<Flashcard>) => {
    setFlashcards(prev => 
      prev.map(card => card.id === id ? { ...card, ...updatedFlashcard } : card)
    );
  }, []);
  
  // Delete a flashcard
  const deleteFlashcard = useCallback((id: string) => {
    setFlashcards(prev => prev.filter(card => card.id !== id));
  }, []);
  
  // Context value
  const value: LocalStorageContextType = {
    // State
    categories,
    flashcards,
    programs,
    userStats,
    isContextLoading,
    
    // Data fetching methods
    fetchFlashcardsByCategory,
    fetchFlashcardsByProgramId,
    fetchProgramsByCategory,
    fetchProgram,
    
    // Data manipulation methods
    addCategory,
    addFlashcard,
    updateFlashcard,
    deleteFlashcard,
    
    // Helper methods
    getCategory,
    getFlashcardsByCategory,
    markProgramCompleted,
    updateUserStats,
    
    // Context management
    initializeContext,
    resetContext,
  };
  
  return (
    <LocalStorageContext.Provider value={value}>
      {children}
    </LocalStorageContext.Provider>
  );
};

// Hook to use the context
export const useLocalStorage = () => {
  const context = useContext(LocalStorageContext);
  if (context === undefined) {
    throw new Error('useLocalStorage must be used within a LocalStorageProvider');
  }
  return context;
};