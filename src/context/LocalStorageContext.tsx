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
  debugFlashcardLoading: (programId: string) => Promise<void>; // Add this line

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
  const [initAttempt, setInitAttempt] = useState(0);

  // Initialize context with improved error handling
  const initializeContext = useCallback(async (userId: string) => {
    // Simple check to prevent duplicated initialization
    if (userId === currentUserId && flashcards.length > 0) {
      console.log("LocalStorageContext: Already initialized for", userId);
      return;
    }

    console.log("LocalStorageContext: Starting initialization for user", userId);
    setIsContextLoading(true);
    setCurrentUserId(userId);

    try {
      // Fetch user's flashcards
      const { data: userFlashcards, error: flashcardsError } = await supabase
        .from('flashcards')
        .select('*')
        .eq('user_id', userId);

      if (flashcardsError) {
        console.error("Error fetching flashcards:", flashcardsError);
        throw flashcardsError;
      }

      if (userFlashcards && userFlashcards.length > 0) {
        // Format for frontend
        const formattedFlashcards: Flashcard[] = userFlashcards.map(f => ({
          id: f.id,
          question: f.question,
          answer: f.answer,
          category: f.category,
          subcategory: f.subcategory || undefined,
          difficulty: f.difficulty as 'beginner' | 'intermediate' | 'advanced' | 'expert',
          correctCount: f.correct_count || 0,
          incorrectCount: f.incorrect_count || 0,
          lastReviewed: f.last_reviewed ? new Date(f.last_reviewed).getTime() : undefined,
          learned: Boolean(f.learned),
          reviewLater: Boolean(f.review_later),
          reportCount: f.report_count || 0,
          reportReason: f.report_reason,
          isApproved: Boolean(f.is_approved),
          module_id: f.module_id,
        }));

        setFlashcards(formattedFlashcards);
      } else {
        setFlashcards([]);
      }

      // Fetch flashcard modules
      const { data: modules, error: modulesError } = await supabase
        .from('flashcard_modules')
        .select('*')
        .eq('user_id', userId);

      if (modulesError) {
        console.error("Error fetching flashcard modules:", modulesError);
      } else if (modules && modules.length > 0) {
        // Create programs based on modules
        const modulePrograms: Program[] = modules.map(module => ({
          id: module.id,
          name: module.name,
          description: module.description || `${module.name} flashcards`,
          category: module.category,
          difficulty: 'beginner', // Default difficulty
          flashcards: [], // Will be populated later
          progress: 0,
          hasExam: false,
        }));

        setPrograms(modulePrograms);
      } else {
        // Generate placeholder programs if no modules exist
        const placeholderPrograms = generatePlaceholderPrograms(categories);
        setPrograms(placeholderPrograms);
      }

      // Load user stats
      try {
        const savedUserStats = localStorage.getItem(`user_stats_${userId}`);
        if (savedUserStats) {
          setUserStats(JSON.parse(savedUserStats));
        } else {
          localStorage.setItem(`user_stats_${userId}`, JSON.stringify(defaultUserStats));
          setUserStats(defaultUserStats);
        }
      } catch (storageError) {
        console.error("Error accessing localStorage:", storageError);
        setUserStats(defaultUserStats);
      }

      console.log("LocalStorageContext: Initialization completed successfully");
    } catch (error) {
      console.error("Error in LocalStorageContext initialization:", error);
    } finally {
      setIsContextLoading(false);
    }
  }, [categories, currentUserId]);

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
  const generatePlaceholderPrograms = (cats: Category[]): Program[] => {
    const programs: Program[] = [];

    cats.forEach(category => {
      // Create beginner program
      programs.push({
        id: `${category.id}-beginner`,
        name: `${category.name} för nybörjare`,
        description: `Grundläggande ${category.name.toLowerCase()}.`,
        category: category.id,
        difficulty: 'beginner',
        flashcards: [],
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
        flashcards: [],
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
          flashcards: [],
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
          flashcards: [],
          progress: Math.floor(Math.random() * 101),
          hasExam: Math.random() > 0.5,
        });
      }
    });

    return programs;
  };

  // Populate program flashcards based on fetched data
  useEffect(() => {
    if (programs.length > 0 && flashcards.length > 0) {
      // Update programs with their associated flashcards
      const updatedPrograms = programs.map(program => {
        const programFlashcards = flashcards
          .filter(card => {
            // If it's a placeholder program (has a dash in the ID), filter by category and difficulty
            if (program.id.includes('-')) {
              const [category, difficulty] = program.id.split('-');
              return card.category === category && card.difficulty === difficulty;
            }
            // If it's a real module, filter by module_id
            return card.module_id === program.id;
          })
          .map(card => card.id);

        return {
          ...program,
          flashcards: programFlashcards
        };
      });

      setPrograms(updatedPrograms);
    }
  }, [flashcards, programs]);

  // Get a specific category by ID
  const getCategory = useCallback((id: string): Category | undefined => {
    return categories.find(category => category.id === id);
  }, [categories]);

  // Get flashcards for a specific category
  const getFlashcardsByCategory = useCallback((categoryId: string): Flashcard[] => {
    return flashcards.filter(card => card.category === categoryId);
  }, [flashcards]);

  // Fetch flashcards by category from Supabase
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
        console.log(`Using ${cachedCards.length} cached flashcards for category ${categoryId}`);
        return cachedCards;
      }

      console.log(`Fetching flashcards for category ${categoryId} from Supabase`);

      // If no cached data, fetch from DB
      const { data, error } = await supabase
        .from('flashcards')
        .select('*')
        .eq('category', categoryId)
        .eq('user_id', currentUserId);

      if (error) {
        console.error("Error fetching flashcards by category:", error);
        throw error;
      }

      console.log(`Fetched ${data?.length || 0} flashcards for category ${categoryId}`);

      // Format for frontend
      const formattedCards = data.map(f => ({
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

      // Update local cache
      setFlashcards(prev => {
        const filtered = prev.filter(card => card.category !== categoryId);
        return [...filtered, ...formattedCards];
      });

      return formattedCards;
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

    try {
      // First, try filtering local programs
      const localCategoryPrograms = programs.filter(p => p.category === categoryId);
      if (localCategoryPrograms.length > 0) {
        return localCategoryPrograms;
      }

      // If no local programs for this category, try to fetch modules from Supabase
      const { data: modules, error } = await supabase
        .from('flashcard_modules')
        .select('*')
        .eq('category', categoryId)
        .eq('user_id', currentUserId);

      if (error) {
        console.error("Error fetching modules by category:", error);
        throw error;
      }

      if (modules && modules.length > 0) {
        console.log(`Fetched ${modules.length} modules for category ${categoryId}`);

        // Convert modules to programs
        const modulePrograms: Program[] = modules.map(module => ({
          id: module.id,
          name: module.name,
          description: module.description || `${module.name} flashcards`,
          category: module.category,
          difficulty: 'beginner', // Default difficulty
          flashcards: [], // Will be populated separately
          progress: 0,
          hasExam: false,
        }));

        // Update programs state with these new programs
        setPrograms(prev => {
          const filtered = prev.filter(p => p.category !== categoryId);
          return [...filtered, ...modulePrograms];
        });

        return modulePrograms;
      }

      // If no real modules found, return placeholder programs
      return generatePlaceholderPrograms([getCategory(categoryId)].filter(Boolean) as Category[]);

    } catch (error) {
      console.error("Error fetching programs by category:", error);
      // For now, just filter local programs state as fallback
      return programs.filter(program => program.category === categoryId);
    }
  }, [isContextLoading, programs, currentUserId, getCategory]);

  // Fetch flashcards for a program
  const fetchFlashcardsByProgramId = useCallback(async (programId: string): Promise<Flashcard[]> => {
    console.log(`Attempting to fetch flashcards for program: ${programId}`);

    // Return empty immediately if no programId
    if (!programId) {
      console.warn("No program ID provided to fetchFlashcardsByProgramId");
      return [];
    }

    // If we're still loading, return empty array but don't add delay
    if (isContextLoading) {
      console.log("Context still loading, returning empty flashcard array");
      return [];
    }

    try {
      // For placeholder programs with category-difficulty format (e.g. 'math-beginner')
      if (programId.includes('-')) {
        const [category, difficulty] = programId.split('-');
        console.log(`Fetching flashcards for category: ${category}, difficulty: ${difficulty}`);

        // First try cached data
        const cachedCards = flashcards.filter(
          card => card.category === category && card.difficulty === difficulty
        );

        if (cachedCards.length > 0) {
          console.log(`Found ${cachedCards.length} cached cards for ${category}/${difficulty}`);
          return cachedCards;
        }

        // Otherwise fetch from DB
        if (!currentUserId) {
          console.warn("No user ID available for DB fetch");
          return [];
        }

        const { data, error } = await supabase
          .from('flashcards')
          .select('*')
          .eq('category', category)
          .eq('difficulty', difficulty)
          .eq('user_id', currentUserId);

        if (error) {
          console.error("Error fetching flashcards by category/difficulty:", error);
          return [];
        }

        if (!data || data.length === 0) {
          console.log(`No flashcards found for ${category}/${difficulty}`);
          return [];
        }

        console.log(`Fetched ${data.length} flashcards for ${category}/${difficulty}`);

        // Format and return
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
          module_id: f.module_id,
        }));
      }

      // For real module IDs (without dashes)
      console.log(`Fetching flashcards for module: ${programId}`);

      // First try cached data
      const cachedCards = flashcards.filter(card => card.module_id === programId);
      if (cachedCards.length > 0) {
        console.log(`Found ${cachedCards.length} cached cards for module ${programId}`);
        return cachedCards;
      }

      // Otherwise fetch from DB
      const { data, error } = await supabase
        .from('flashcards')
        .select('*')
        .eq('module_id', programId);

      if (error) {
        console.error("Error fetching flashcards for module:", error);
        return [];
      }

      if (!data || data.length === 0) {
        console.log(`No flashcards found for module ${programId}`);
        return [];
      }

      console.log(`Fetched ${data.length} flashcards for module ${programId}`);

      // Format and return
      const formattedCards = data.map(f => ({
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
        module_id: f.module_id,
      }));

      return formattedCards;
    } catch (error) {
      console.error("Error in fetchFlashcardsByProgramId:", error);
      return [];
    }
  }, [flashcards, isContextLoading, currentUserId]);
  // Debug helper function to diagnose flashcard loading issues
  const debugFlashcardLoading = async (programId: string) => {
    console.group(`🔍 Debugging flashcard loading for program: ${programId}`);

    try {
      console.log("Checking if programId has valid format");
      if (!programId) {
        console.error("❌ Program ID is empty or undefined");
        return;
      }

      console.log("✅ Program ID exists:", programId);

      // Check local storage context state
      console.log("Checking local cache state:");
      console.log(`- Current User ID: ${currentUserId || 'none'}`);
      console.log(`- Is context loading: ${isContextLoading}`);
      console.log(`- Cached flashcards count: ${flashcards.length}`);
      console.log(`- Cached programs count: ${programs.length}`);

      // Check if we have this program in cache
      const cachedProgram = programs.find(p => p.id === programId);
      if (cachedProgram) {
        console.log("✅ Program found in local cache:", cachedProgram.name);
      } else {
        console.log("❌ Program not found in local cache");
      }

      // For category-difficulty format
      if (programId.includes('-')) {
        const [category, difficulty] = programId.split('-');
        console.log(`Program uses category-difficulty format: ${category}-${difficulty}`);

        // Check for flashcards with matching category/difficulty
        const matchingCards = flashcards.filter(
          card => card.category === category && card.difficulty === difficulty
        );

        console.log(`Found ${matchingCards.length} cached flashcards matching ${category}-${difficulty}`);

        // Try direct DB query
        if (currentUserId) {
          console.log("Attempting direct DB query for category/difficulty");
          const { data, error } = await supabase
            .from('flashcards')
            .select('id, question')
            .eq('category', category)
            .eq('difficulty', difficulty)
            .limit(5);

          if (error) {
            console.error("❌ DB query error:", error);
          } else {
            console.log(`✅ DB query returned ${data.length} flashcards`);
            if (data.length > 0) {
              console.log("Sample cards:", data.slice(0, 2));
            }
          }
        }
      }
      // For regular module ID
      else {
        console.log("Program uses standard module ID format");

        // Check for flashcards with matching module_id
        const matchingCards = flashcards.filter(card => card.module_id === programId);
        console.log(`Found ${matchingCards.length} cached flashcards with module_id=${programId}`);

        // Try direct DB query for module
        console.log("Attempting direct DB query for module");
        const { data: moduleData, error: moduleError } = await supabase
          .from('flashcard_modules')
          .select('*')
          .eq('id', programId)
          .single();

        if (moduleError) {
          console.error("❌ Module query error:", moduleError);
        } else if (moduleData) {
          console.log("✅ Module found in DB:", moduleData);

          // Query for flashcards with this module
          console.log("Querying flashcards for this module");
          const { data: cardData, error: cardError } = await supabase
            .from('flashcards')
            .select('id, question')
            .eq('module_id', programId)
            .limit(5);

          if (cardError) {
            console.error("❌ Flashcard query error:", cardError);
          } else {
            console.log(`✅ Found ${cardData.length} flashcards for this module`);
            if (cardData.length > 0) {
              console.log("Sample cards:", cardData.slice(0, 2));
            }
          }
        } else {
          console.error("❌ Module not found in database");
        }
      }
    } catch (error) {
      console.error("Debugging error:", error);
    } finally {
      console.groupEnd();
    }
  };

  // Fetch a single program
  const fetchProgram = useCallback(async (programId: string): Promise<Program | null> => {
    console.log(`fetchProgram: Attempting to fetch program: ${programId}`);

    // Return null immediately if no programId
    if (!programId) {
      console.warn("fetchProgram: No program ID provided");
      return null;
    }

    try {
      // First, check local programs (attempt to avoid unnecessary DB calls)
      console.log(`fetchProgram: Checking local programs first for ${programId}`);
      const program = programs.find(p => p.id === programId);
      if (program) {
        console.log(`fetchProgram: Found program locally: ${program.name}`);
        return program;
      }

      // Special handling for category-difficulty programId format (e.g., "math-beginner")
      if (programId.includes('-')) {
        const [category, difficulty] = programId.split('-');
        const categoryObj = categories.find(c => c.id === category);

        if (categoryObj) {
          console.log(`fetchProgram: Creating synthetic program for ${category}-${difficulty}`);

          // Create a synthetic program for this category-difficulty combination
          const difficultyLabel = {
            'beginner': 'Nybörjare',
            'intermediate': 'Medel',
            'advanced': 'Avancerad',
            'expert': 'Expert'
          }[difficulty] || difficulty;

          const program: Program = {
            id: programId,
            name: `${categoryObj.name} (${difficultyLabel})`,
            description: `Flashcards för ${categoryObj.name} på ${difficultyLabel} nivå`,
            category,
            difficulty: difficulty as 'beginner' | 'intermediate' | 'advanced' | 'expert',
            flashcards: [],
            hasExam: false
          };

          // Add to local programs state for future reference
          setPrograms(prev => [...prev, program]);

          return program;
        }
      }

      // For non-placeholder program IDs, try to fetch from Supabase
      console.log(`fetchProgram: Fetching module from Supabase: ${programId}`);
      const { data, error } = await supabase
        .from('flashcard_modules')
        .select('*')
        .eq('id', programId)
        .single();

      if (error) {
        console.error("fetchProgram: Error fetching module:", error);
        return null;
      }

      if (data) {
        console.log(`fetchProgram: Found module in DB: ${data.name}`);

        // Convert to program format
        const newProgram: Program = {
          id: data.id,
          name: data.name,
          description: data.description || `${data.name} flashcards`,
          category: data.category,
          difficulty: 'beginner', // Default difficulty
          flashcards: [], // Will be populated separately
          progress: 0,
          hasExam: false,
        };

        // Add to local state
        setPrograms(prev => [...prev, newProgram]);

        return newProgram;
      }

      console.log(`fetchProgram: No program found for ID: ${programId}`);
      return null;

    } catch (error) {
      console.error("fetchProgram: Error:", error);
      return null;
    }
  }, [programs, categories]);

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

  // Add a new flashcard with proper module handling
  const addFlashcard = useCallback(async (flashcard: Flashcard) => {
    if (!currentUserId) return;

    try {
      // First, find or create a default module for this category
      const { data: existingModule, error: moduleError } = await supabase
        .from('flashcard_modules')
        .select('id')
        .eq('category', flashcard.category)
        .eq('user_id', currentUserId)
        .limit(1)
        .maybeSingle();

      let moduleId: string;

      if (moduleError) {
        console.error("Error checking for existing module:", moduleError);
        return;
      }

      if (existingModule) {
        // Use existing module
        moduleId = existingModule.id;
      } else {
        // Create a new default module for this category
        const categoryName = categories.find(c => c.id === flashcard.category)?.name || flashcard.category;
        const { data: newModule, error: createError } = await supabase
          .from('flashcard_modules')
          .insert({
            name: `${categoryName} Default Module`,
            description: `Default module for ${categoryName}`,
            category: flashcard.category,
            subcategory: flashcard.subcategory || null,
            user_id: currentUserId,
          })
          .select()
          .single();

        if (createError) {
          console.error("Error creating default module:", createError);
          return;
        }

        moduleId = newModule.id;
      }

      // Convert flashcard to database format
      const dbFlashcard = {
        question: flashcard.question,
        answer: flashcard.answer,
        category: flashcard.category,
        subcategory: flashcard.subcategory || null,
        difficulty: flashcard.difficulty,
        module_id: moduleId, // Now we have a module_id
        user_id: currentUserId,
        correct_count: flashcard.correctCount || 0,
        incorrect_count: flashcard.incorrectCount || 0,
        last_reviewed: flashcard.lastReviewed ? new Date(flashcard.lastReviewed).toISOString() : null,
        learned: flashcard.learned || false,
        review_later: flashcard.reviewLater || false,
        report_count: flashcard.reportCount || 0,
        report_reason: flashcard.reportReason || [],
        is_approved: flashcard.isApproved || false
      };

      // Insert into Supabase
      const { data, error } = await supabase
        .from('flashcards')
        .insert(dbFlashcard)
        .select()
        .single();

      if (error) {
        console.error("Error adding flashcard to Supabase:", error);
        return;
      }

      // Convert back to frontend format with the new ID
      const newFlashcard: Flashcard = {
        id: data.id,
        question: data.question,
        answer: data.answer,
        category: data.category,
        subcategory: data.subcategory || undefined,
        difficulty: data.difficulty as 'beginner' | 'intermediate' | 'advanced' | 'expert',
        correctCount: data.correct_count || 0,
        incorrectCount: data.incorrect_count || 0,
        lastReviewed: data.last_reviewed ? new Date(data.last_reviewed).getTime() : undefined,
        learned: Boolean(data.learned),
        reviewLater: Boolean(data.review_later),
        reportCount: data.report_count || 0,
        reportReason: data.report_reason,
        isApproved: Boolean(data.is_approved),
        module_id: data.module_id,
      };

      // Update local state
      setFlashcards(prev => [...prev, newFlashcard]);

      console.log("Flashcard added successfully:", newFlashcard);

    } catch (error) {
      console.error("Error in addFlashcard:", error);
    }
  }, [currentUserId, categories]);

  // Update a flashcard
  const updateFlashcard = useCallback(async (id: string, updatedFlashcard: Partial<Flashcard>) => {
    if (!currentUserId) return;

    try {
      // Convert to database format (only the fields being updated)
      const dbUpdate: any = {};

      if (updatedFlashcard.question !== undefined) dbUpdate.question = updatedFlashcard.question;
      if (updatedFlashcard.answer !== undefined) dbUpdate.answer = updatedFlashcard.answer;
      if (updatedFlashcard.category !== undefined) dbUpdate.category = updatedFlashcard.category;
      if (updatedFlashcard.subcategory !== undefined) dbUpdate.subcategory = updatedFlashcard.subcategory;
      if (updatedFlashcard.difficulty !== undefined) dbUpdate.difficulty = updatedFlashcard.difficulty;
      if (updatedFlashcard.correctCount !== undefined) dbUpdate.correct_count = updatedFlashcard.correctCount;
      if (updatedFlashcard.incorrectCount !== undefined) dbUpdate.incorrect_count = updatedFlashcard.incorrectCount;
      if (updatedFlashcard.lastReviewed !== undefined) {
        dbUpdate.last_reviewed = updatedFlashcard.lastReviewed ?
          new Date(updatedFlashcard.lastReviewed).toISOString() : null;
      }
      if (updatedFlashcard.learned !== undefined) dbUpdate.learned = updatedFlashcard.learned;
      if (updatedFlashcard.reviewLater !== undefined) dbUpdate.review_later = updatedFlashcard.reviewLater;
      if (updatedFlashcard.reportCount !== undefined) dbUpdate.report_count = updatedFlashcard.reportCount;
      if (updatedFlashcard.reportReason !== undefined) dbUpdate.report_reason = updatedFlashcard.reportReason;
      if (updatedFlashcard.isApproved !== undefined) dbUpdate.is_approved = updatedFlashcard.isApproved;

      // Always update the updated_at timestamp
      dbUpdate.updated_at = new Date().toISOString();

      // Update in Supabase
      const { error } = await supabase
        .from('flashcards')
        .update(dbUpdate)
        .eq('id', id)
        .eq('user_id', currentUserId);

      if (error) {
        console.error("Error updating flashcard in Supabase:", error);
        return;
      }

      // Update local state
      setFlashcards(prev =>
        prev.map(card => card.id === id ? { ...card, ...updatedFlashcard } : card)
      );

      console.log("Flashcard updated successfully:", id);

    } catch (error) {
      console.error("Error in updateFlashcard:", error);
    }
  }, [currentUserId]);

  // Delete a flashcard
  const deleteFlashcard = useCallback(async (id: string) => {
    if (!currentUserId) return;

    try {
      // Delete from Supabase
      const { error } = await supabase
        .from('flashcards')
        .delete()
        .eq('id', id)
        .eq('user_id', currentUserId);

      if (error) {
        console.error("Error deleting flashcard from Supabase:", error);
        return;
      }

      // Update local state
      setFlashcards(prev => prev.filter(card => card.id !== id));

      console.log("Flashcard deleted successfully:", id);

    } catch (error) {
      console.error("Error in deleteFlashcard:", error);
    }
  }, [currentUserId]);

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
    debugFlashcardLoading, // Add this line

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
  return {
    debugFlashcardLoading: false,
    ...context
  };
};
