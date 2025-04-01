// src/context/LocalStorageContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode, FC, useCallback, useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/hooks/use-toast';
import { Flashcard } from '@/types/flashcard';
import { Category } from '@/types/category';
import { Program } from '@/types/program';
import { UserStats } from '@/types/user';
import { initialCategories } from '@/data/categories'; // Still using initial for simplicity
import { initialUserStats } from '@/data/user';
import { supabase } from '@/integrations/supabase/client';

// Define the shape of the context value
type LocalStorageContextType = {
  programs: Program[]; // Keep local programs state FOR NOW - requires migration
  categories: Category[];
  userStats: UserStats;
  isContextLoading: boolean;

  // Fetching functions
  fetchFlashcardsByProgramId: (programId: string) => Promise<Flashcard[]>;
  fetchFlashcardsByCategory: (category: string, subcategory?: string, difficulty?: string) => Promise<Flashcard[]>;
  fetchProgram: (programId: string) => Promise<Program | null>;
  fetchProgramsByCategory: (category: string) => Promise<Program[]>;
  fetchCategories: () => Promise<Category[]>;

  // Stats and Completion functions
  updateUserStats: (updates: Partial<UserStats>) => void;
  markProgramCompleted: (programId: string) => void;
  getCategory: (categoryId: string) => Category | undefined; // Simple getter
};

// Create the context
const LocalStorageContext = createContext<LocalStorageContextType | undefined>(undefined);

// Hook to use the context
export const useLocalStorage = () => {
  const context = useContext(LocalStorageContext);
  if (context === undefined) {
    throw new Error('useLocalStorage must be used within a LocalStorageProvider');
  }
  return context;
};

// Helper to map DB flashcards to Frontend type
const mapDbFlashcardToFrontend = (dbCard: any): Flashcard => ({
    id: dbCard.id,
    question: dbCard.question,
    answer: dbCard.answer,
    category: dbCard.category,
    subcategory: dbCard.subcategory || undefined,
    difficulty: dbCard.difficulty as 'beginner' | 'intermediate' | 'advanced' | 'expert',
    correctCount: dbCard.correct_count || 0,
    incorrectCount: dbCard.incorrect_count || 0,
    lastReviewed: dbCard.last_reviewed ? new Date(dbCard.last_reviewed).getTime() : undefined,
    nextReview: dbCard.next_review ? new Date(dbCard.next_review).getTime() : undefined,
    learned: Boolean(dbCard.learned),
    reviewLater: Boolean(dbCard.review_later),
    reportCount: dbCard.report_count || 0,
    reportReason: dbCard.report_reason || [],
    isApproved: Boolean(dbCard.is_approved),
    // Keep snake_case for potential direct DB updates elsewhere if needed
    correct_count: dbCard.correct_count,
    incorrect_count: dbCard.incorrect_count,
    last_reviewed: dbCard.last_reviewed,
    created_at: dbCard.created_at,
    module_id: dbCard.module_id,
    user_id: dbCard.user_id,
    next_review: dbCard.next_review,
    report_count: dbCard.report_count,
    report_reason: dbCard.report_reason,
    is_approved: dbCard.is_approved,
});

// Provider component
export const LocalStorageProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { user, addAchievement: addAuthAchievement } = useAuth();
  const [programs, setPrograms] = useState<Program[]>([]); // Keep local state *temporarily*
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [userStats, setUserStats] = useState<UserStats>(initialUserStats);
  const [isContextLoading, setIsContextLoading] = useState(true);

  // --- Load initial user stats and static data ---
  useEffect(() => {
    console.log("LocalStorageContext Mount: Loading user stats and static data...");
    let loadedUserStats = { ...initialUserStats };
    try {
      const storedUserStats = localStorage.getItem('userStats');
      if (storedUserStats) {
        const parsedStats = JSON.parse(storedUserStats);
        loadedUserStats = { ...initialUserStats, ...parsedStats };
      }
    } catch (e) { console.error("LocalStorageContext: Error parsing stored userStats:", e); }

    setUserStats(loadedUserStats);
    setCategories(initialCategories); // Load static categories

    // ** REMOVE THIS AFTER PROGRAM MIGRATION **
    // TEMPORARY: Load initial programs from hardcoded data
    try {
        import('@/data/programs').then(module => {
            if (module.initialPrograms) {
                setPrograms(module.initialPrograms);
                 console.warn("LocalStorageContext: Using hardcoded initial programs. Migrate programs to Supabase.")
            }
        }).catch(err => console.warn("Could not load initial programs, likely deleted after migration.", err));
    } catch (error) {
         console.warn("Error attempting to load initial programs.", error);
    }
    // ** END OF TEMPORARY BLOCK **

    setIsContextLoading(false);
    console.log("LocalStorageContext Mount: Initial load complete.");
  }, []);

  // --- Streak Check (Same logic as before) ---
  useEffect(() => {
     if (isContextLoading) return;
     setUserStats(currentStats => {
       const now = new Date();
       const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
       const lastActivityTimestamp = typeof currentStats.lastActivity === 'number' ? currentStats.lastActivity : 0;
       if (lastActivityTimestamp === 0 || isNaN(lastActivityTimestamp)) {
         return currentStats.lastActivity === today ? currentStats : { ...currentStats, lastActivity: today };
       }
       const lastActivityDay = new Date(new Date(lastActivityTimestamp).getFullYear(), new Date(lastActivityTimestamp).getMonth(), new Date(lastActivityTimestamp).getDate()).getTime();
       const oneDayMs = 24 * 60 * 60 * 1000;
       const daysSinceLastActivity = Math.floor((today - lastActivityDay) / oneDayMs);

       if (daysSinceLastActivity === 0) { return currentStats; }
       else if (daysSinceLastActivity === 1) {
         const newStreak = (currentStats.streak || 0) + 1;
         if (newStreak === 7) addAuthAchievement({ name: '7-dagars Streak', description: 'Använt Learny 7 dagar i rad!', icon: 'flame' });
         else if (newStreak === 30) addAuthAchievement({ name: '30-dagars Streak', description: 'Använt Learny 30 dagar i rad!', icon: 'flame' });
         return { ...currentStats, streak: newStreak, lastActivity: today };
       } else { return { ...currentStats, streak: 1, lastActivity: today }; }
     });
   }, [isContextLoading, addAuthAchievement]);

  // --- Save User Stats ---
  useEffect(() => {
    if (isContextLoading) return;
    localStorage.setItem('userStats', JSON.stringify(userStats));
  }, [userStats, isContextLoading]);


  // --- Data Fetching Functions ---

  // Define fetchFlashcardsByCategory FIRST
  const fetchFlashcardsByCategory = useCallback(async (category: string, subcategory?: string, difficulty?: string): Promise<Flashcard[]> => {
    try {
      let query = supabase
        .from('flashcards')
        .select('*')
        .eq('category', category)
        .eq('is_approved', true);

      if (subcategory) query = query.eq('subcategory', subcategory);
      if (difficulty) query = query.eq('difficulty', difficulty);

      const { data, error } = await query;
      if (error) throw error;
      return data.map(mapDbFlashcardToFrontend);
    } catch (error: any) {
      console.error("Error fetching flashcards by category:", error);
      toast({ title: 'Fel', description: `Kunde inte hämta flashcards: ${error.message}`, variant: 'destructive' });
      return [];
    }
  }, []); // No dependencies needed here if it doesn't use other useCallback functions

  // Define fetchFlashcardsByProgramId AFTER fetchFlashcardsByCategory
  const fetchFlashcardsByProgramId = useCallback(async (progId: string): Promise<Flashcard[]> => {
    console.warn("Fetching flashcards by program ID relies on program migration.");
    const localProgram = programs.find(p => p.id === progId);
    if (localProgram) {
      const cards = await fetchFlashcardsByCategory(localProgram.category, undefined, localProgram.difficulty); // NOW fetchFlashcardsByCategory is defined
      // Further filter by hardcoded IDs if needed (VERY FRAGILE)
      if(localProgram.flashcards && localProgram.flashcards.length > 0){
          const idSet = new Set(localProgram.flashcards);
          return cards.filter(card => idSet.has(card.id));
      }
      return cards.slice(0, 20); // Limit fallback results
    }
    return [];
  }, [programs, fetchFlashcardsByCategory]); // Include fetchFlashcardsByCategory dependency

  const fetchProgram = useCallback(async (programId: string): Promise<Program | null> => {
    console.warn("Fetching program relies on program migration.");
    const localProg = programs.find(p => p.id === programId) || null;
    if (localProg) {
      localProg.completedByUser = userStats.completedPrograms.includes(localProg.id);
    }
    return localProg;
  }, [programs, userStats.completedPrograms]);

  const fetchProgramsByCategory = useCallback(async (category: string): Promise<Program[]> => {
    console.warn("Fetching programs by category relies on program migration.");
    return programs
      .filter(p => p.category === category)
      .map(p => ({ ...p, completedByUser: userStats.completedPrograms.includes(p.id) }));
  }, [programs, userStats.completedPrograms]);

  const fetchCategories = useCallback(async (): Promise<Category[]> => {
    return initialCategories;
  }, []);

  // --- Update User Stats (Internal & Exported) ---
  const updateUserStatsInternal = useCallback((updates: Partial<UserStats>) => {
    setUserStats((prev) => {
      const newState = { ...prev, ...updates };
      if (Object.keys(updates).length > 0 || !prev.lastActivity) {
        newState.lastActivity = Date.now();
      }
      return newState;
    });
  }, []);

  // --- Mark Program Completed ---
  const markProgramCompleted = useCallback((programId: string) => {
    const program = programs.find((p) => p.id === programId);
    setUserStats((prev) => {
      if (!prev.completedPrograms.includes(programId)) {
        const updatedCompletedPrograms = [...prev.completedPrograms, programId];
        if (program && user) {
          console.log(`Marking program ${program.name} as completed, triggering achievement.`);
          addAuthAchievement({ name: `Avklarat: ${program.name}`, description: `Slutfört programmet "${program.name}"!`, icon: 'trophy' });
        }
        return { ...prev, completedPrograms: updatedCompletedPrograms, lastActivity: Date.now() };
      }
      return { ...prev, lastActivity: Date.now() };
    });
  }, [programs, addAuthAchievement, user]);

  // --- Simple Getters ---
  const getCategory = useCallback((categoryId: string): Category | undefined => {
    return categories.find((category) => category.id === categoryId);
  }, [categories]);

  // --- Context Value ---
  const contextValue = useMemo(() => ({
    programs,
    categories,
    userStats,
    isContextLoading,
    fetchFlashcardsByProgramId,
    fetchFlashcardsByCategory,
    fetchProgram,
    fetchProgramsByCategory,
    fetchCategories,
    updateUserStats: updateUserStatsInternal,
    markProgramCompleted,
    getCategory,
  }), [
    programs, categories, userStats, isContextLoading,
    fetchFlashcardsByProgramId, fetchFlashcardsByCategory, fetchProgram,
    fetchProgramsByCategory, fetchCategories, updateUserStatsInternal,
    markProgramCompleted, getCategory
  ]);

  return (
    <LocalStorageContext.Provider value={contextValue}>
      {children}
    </LocalStorageContext.Provider>
  );
};