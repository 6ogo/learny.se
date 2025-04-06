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
  fetchGenericModules: () => Promise<Program[]>;
  fetchUserModules: () => Promise<Program[]>;

  // Data manipulation methods
  addCategory: (category: Category) => void;
  addFlashcard: (flashcard: Flashcard) => void;
  updateFlashcard: (id: string, updatedFlashcard: Partial<Flashcard>) => void;
  deleteFlashcard: (id: string) => void;
  importFlashcards: (flashcards: Flashcard[]) => Promise<void>;
  updateFlashcardUserInteraction: (flashcardId: string, updates: { learned?: boolean, reviewLater?: boolean }) => Promise<void>;

  // Helper methods
  getCategory: (id: string) => Category | undefined;
  getFlashcardsByCategory: (categoryId: string) => Flashcard[];
  markProgramCompleted: (programId: string) => void;
  updateUserStats: (partialStats: Partial<UserStats>) => void;
  debugFlashcardLoading: (programId: string) => Promise<void>;

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

      // Fetch both user modules and generic modules
      await Promise.all([
        fetchUserModules(),
        fetchGenericModules()
      ]);

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
  }, [categories]);

  // Fetch generic modules that are available to all users
  const fetchGenericModules = useCallback(async (): Promise<Program[]> => {
    try {
      const { data: genericModules, error } = await supabase
        .from('flashcard_modules')
        .select('*')
        .eq('is_generic', true);
      
      if (error) {
        console.error("Error fetching generic modules:", error);
        return [];
      }

      if (genericModules && genericModules.length > 0) {
        console.log(`Fetched ${genericModules.length} generic modules`);
        
        // Create programs based on generic modules
        const modulePrograms: Program[] = genericModules.map(module => ({
          id: module.id,
          name: module.name,
          description: module.description || `${module.name} flashcards`,
          category: module.category,
          difficulty: 'beginner', // Default difficulty
          flashcards: [],
          progress: 0,
          hasExam: false,
          isGeneric: true // Mark as generic
        }));

        // Update programs state to include these generic modules
        setPrograms(prev => {
          const filtered = prev.filter(p => !p.isGeneric); // Remove previous generic modules
          return [...filtered, ...modulePrograms];
        });

        return modulePrograms;
      }
      
      return [];
    } catch (error) {
      console.error("Error in fetchGenericModules:", error);
      return [];
    }
  }, []);

  // Fetch modules specific to the current user
  const fetchUserModules = useCallback(async (): Promise<Program[]> => {
    if (!currentUserId) return [];
    
    try {
      const { data: userModules, error } = await supabase
        .from('flashcard_modules')
        .select('*')
        .eq('user_id', currentUserId)
        .eq('is_generic', false);
      
      if (error) {
        console.error("Error fetching user modules:", error);
        return [];
      }

      if (userModules && userModules.length > 0) {
        console.log(`Fetched ${userModules.length} user modules`);
        
        // Create programs based on user modules
        const modulePrograms: Program[] = userModules.map(module => ({
          id: module.id,
          name: module.name,
          description: module.description || `${module.name} flashcards`,
          category: module.category,
          difficulty: 'beginner', // Default difficulty
          flashcards: [],
          progress: 0,
          hasExam: false,
          isGeneric: false // Mark as user-specific
        }));

        // Update programs state to include these user modules
        setPrograms(prev => {
          const filtered = prev.filter(p => p.isGeneric || (p.isGeneric === undefined)); // Keep generic modules and placeholders
          return [...filtered, ...modulePrograms];
        });

        return modulePrograms;
      } else {
        console.log("No user modules found");
      }
      
      return [];
    } catch (error) {
      console.error("Error in fetchUserModules:", error);
      return [];
    }
  }, [currentUserId]);

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
        .eq('category', categoryId);

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
        learned: Boolean(f.learned),
        reviewLater: Boolean(f.review_later),
        reportCount: f.report_count,
        reportReason: f.report_reason,
        isApproved: Boolean(f.is_approved),
        module_id: f.module_id,
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
            progress: 0,
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
          isGeneric: Boolean(data.is_generic), // Add isGeneric flag
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

      // Fetch both generic and user-specific modules for this category
      const [genericModulesResponse, userModulesResponse] = await Promise.all([
        supabase
          .from('flashcard_modules')
          .select('*')
          .eq('category', categoryId)
          .eq('is_generic', true),
        currentUserId ? 
          supabase
            .from('flashcard_modules')
            .select('*')
            .eq('category', categoryId)
            .eq('user_id', currentUserId)
            .eq('is_generic', false) : 
          { data: [], error: null }
      ]);

      const allModules = [];
      
      // Process generic modules
      if (genericModulesResponse.error) {
        console.error("Error fetching generic modules by category:", genericModulesResponse.error);
      } else if (genericModulesResponse.data?.length) {
        const genericPrograms = genericModulesResponse.data.map(module => ({
          id: module.id,
          name: module.name,
          description: module.description || `${module.name} flashcards`,
          category: module.category,
          difficulty: 'beginner', // Default difficulty
          flashcards: [], // Will be populated separately
          progress: 0,
          hasExam: false,
          isGeneric: true
        }));
        allModules.push(...genericPrograms);
      }

      // Process user modules
      if (userModulesResponse.error) {
        console.error("Error fetching user modules by category:", userModulesResponse.error);
      } else if (userModulesResponse.data?.length) {
        const userPrograms = userModulesResponse.data.map(module => ({
          id: module.id,
          name: module.name,
          description: module.description || `${module.name} flashcards`,
          category: module.category,
          difficulty: 'beginner', // Default difficulty
          flashcards: [], // Will be populated separately
          progress: 0,
          hasExam: false,
          isGeneric: false
        }));
        allModules.push(...userPrograms);
      }
      
      if (allModules.length > 0) {
        console.log(`Fetched ${allModules.length} total modules for category ${categoryId}`);
        
        // Update programs state with these new programs
        setPrograms(prev => {
          const filtered = prev.filter(p => p.category !== categoryId);
          return [...filtered, ...allModules];
        });

        return allModules;
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
      if (programId.includes('-') && programId.split('-').length === 2) {
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
        const { data, error } = await supabase
          .from('flashcards')
          .select('*')
          .eq('category', category)
          .eq('difficulty', difficulty);

        if (error) {
          console.error("Error fetching flashcards by category/difficulty:", error);
          return [];
        }

        if (!data || data.length === 0) {
          console.log(`No flashcards found for ${category}/${difficulty}`);
          return [];
        }

        console.log(`Fetched ${data.length} flashcards for ${category}/${difficulty}`);

        // Format and update local state
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
          learned: Boolean(f.learned),
          reviewLater: Boolean(f.review_later),
          reportCount: f.report_count,
          reportReason: f.report_reason,
          isApproved: Boolean(f.is_approved),
          module_id: f.module_id,
        }));

        // Update cache
        setFlashcards(prev => {
          const filtered = prev.filter(card => !(card.category === category && card.difficulty === difficulty));
          return [...filtered, ...formattedCards];
        });

        return formattedCards;
      }
      // For real module IDs or UUIDs
      else {
        // For UUID format IDs that aren't in category-difficulty format
        // First try to find the program to get its category and difficulty
        const program = await fetchProgram(programId);
        
        if (program && program.category) {
          console.log(`Fetching flashcards for module: ${programId} with category ${program.category}`);
          
          // First try cached data
          const cachedCards = flashcards.filter(card => card.module_id === programId);
          if (cachedCards.length > 0) {
            console.log(`Found ${cachedCards.length} cached cards for module ${programId}`);
            return cachedCards;
          }

          // If no module_id matches, try with category/difficulty if available
          if (program.difficulty && cachedCards.length === 0) {
            const categoryDifficultyCards = flashcards.filter(
              card => card.category === program.category && card.difficulty === program.difficulty
            );
            
            if (categoryDifficultyCards.length > 0) {
              console.log(`Found ${categoryDifficultyCards.length} cached cards for ${program.category}/${program.difficulty}`);
              return categoryDifficultyCards;
            }
          }

          // If still no cards, fetch from DB by module_id
          const { data, error } = await supabase
            .from('flashcards')
            .select('*')
            .eq('module_id', programId);

          // If no results with module_id, try by category/difficulty
          if ((!data || data.length === 0) && program.difficulty) {
            const { data: categoryData, error: categoryError } = await supabase
              .from('flashcards')
              .select('*')
              .eq('category', program.category)
              .eq('difficulty', program.difficulty);

            if (categoryError) {
              console.error("Error fetching flashcards by category/difficulty:", categoryError);
              return [];
            }

            if (categoryData && categoryData.length > 0) {
              console.log(`Fetched ${categoryData.length} flashcards for ${program.category}/${program.difficulty}`);
              
              // Format and update local state
              const formattedCards = categoryData.map(f => ({
                id: f.id,
                question: f.question,
                answer: f.answer,
                category: f.category,
                subcategory: f.subcategory || undefined,
                difficulty: f.difficulty as 'beginner' | 'intermediate' | 'advanced' | 'expert',
                correctCount: f.correct_count,
                incorrectCount: f.incorrect_count,
                lastReviewed: f.last_reviewed ? new Date(f.last_reviewed).getTime() : undefined,
                learned: Boolean(f.learned),
                reviewLater: Boolean(f.review_later),
                reportCount: f.report_count,
                reportReason: f.report_reason,
                isApproved: Boolean(f.is_approved),
                module_id: f.module_id,
              }));

              // Update cache
              setFlashcards(prev => {
                const filtered = prev.filter(card => !(card.category === program.category && card.difficulty === program.difficulty));
                return [...filtered, ...formattedCards];
              });

              return formattedCards;
            }
          }

          if (error) {
            console.error("Error fetching flashcards for module:", error);
            return [];
          }

          if (data && data.length > 0) {
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
              learned: Boolean(f.learned),
              reviewLater: Boolean(f.review_later),
              reportCount: f.report_count,
              reportReason: f.report_reason,
              isApproved: Boolean(f.is_approved),
              module_id: f.module_id,
            }));

            // Update cache
            setFlashcards(prev => {
              const filtered = prev.filter(card => card.module_id !== programId);
              return [...filtered, ...formattedCards];
            });

            return formattedCards;
          }
        }
        
        // Fallback to just module_id query without program info
        console.log(`Fetching flashcards for module ID directly: ${programId}`);
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
          learned: Boolean(f.learned),
          reviewLater: Boolean(f.review_later),
          reportCount: f.report_count,
          reportReason: f.report_reason,
          isApproved: Boolean(f.is_approved),
          module_id: f.module_id,
        }));

        // Update cache
        setFlashcards(prev => {
          const filtered = prev.filter(card => card.module_id !== programId);
          return [...filtered, ...formattedCards];
        });

        return formattedCards;
      }
    } catch (error) {
      console.error("Error in fetchFlashcardsByProgramId:", error);
      return [];
    }
  }, [flashcards, isContextLoading, fetchProgram]);

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

      // Update local storage
      if (currentUserId) {
        localStorage.setItem(`user_stats_${currentUserId}`, JSON.stringify(updated));
      }
      
      return updated;
    });
  }, [currentUserId]);

  // Add a new category
  const addCategory = useCallback((category: Category) => {
    setCategories(prev => [...prev, category]);
  }, []);

  // Add a flashcard
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

  // Import a batch of flashcards, potentially creating modules
  const importFlashcards = useCallback(async (flashcardsToImport: Flashcard[]): Promise<void> => {
    if (!currentUserId || flashcardsToImport.length === 0) {
      return;
    }

    try {
      // Group flashcards by category
      const flashcardsByCategory = flashcardsToImport.reduce<Record<string, Flashcard[]>>((groups, card) => {
        const category = card.category || 'uncategorized';
        if (!groups[category]) {
          groups[category] = [];
        }
        groups[category].push(card);
        return groups;
      }, {});

      for (const [category, cards] of Object.entries(flashcardsByCategory)) {
        // Check if we need to create a module
        const moduleName = `Imported ${cards.length} flashcards - ${new Date().toLocaleDateString()}`;
        
        // Create module in Supabase
        const { data: moduleData, error: moduleError } = await supabase
          .from('flashcard_modules')
          .insert({
            name: moduleName,
            description: `Imported flashcards for ${category}`,
            category,
            user_id: currentUserId
          })
          .select()
          .single();

        if (moduleError) {
          console.error("Error creating module:", moduleError);
          throw moduleError;
        }

        const moduleId = moduleData.id;

        // Format cards for Supabase with the new module_id
        const cardsForInsertion = cards.map(card => ({
          question: card.question,
          answer: card.answer,
          category: card.category,
          subcategory: card.subcategory || null,
          difficulty: card.difficulty,
          user_id: currentUserId,
          module_id: moduleId,
          learned: false,
          review_later: false
        }));

        // Insert cards into Supabase
        const { error: cardsError } = await supabase
          .from('flashcards')
          .insert(cardsForInsertion);

        if (cardsError) {
          console.error("Error importing flashcards:", cardsError);
          throw cardsError;
        }

        // Add new module to local state
        const newProgram: Program = {
          id: moduleId,
          name: moduleName,
          description: `Imported flashcards for ${category}`,
          category,
          difficulty: 'beginner',
          flashcards: [],
          progress: 0,
          hasExam: false
        };

        setPrograms(prev => [...prev, newProgram]);

        // Also add the new flashcards to local state
        const formattedCards = cards.map(card => ({
          ...card,
          module_id: moduleId,
          correctCount: 0,
          incorrectCount: 0,
          learned: false,
          reviewLater: false
        }));

        setFlashcards(prev => [...prev, ...formattedCards]);
      }

      console.log(`Successfully imported ${flashcardsToImport.length} flashcards`);
    } catch (error) {
      console.error("Error during flashcard import:", error);
      throw error;
    }
  }, [currentUserId]);

  // Update flashcard user interaction (learned/review later)
  const updateFlashcardUserInteraction = useCallback(async (flashcardId: string, updates: { learned?: boolean, reviewLater?: boolean }) => {
    if (!currentUserId || !flashcardId) {
      return;
    }

    try {
      // Local state update
      setFlashcards(prev => 
        prev.map(card => 
          card.id === flashcardId ? { ...card, ...updates } : card
        )
      );
      
      // Prepare database update
      const dbUpdates: Record<string, boolean> = {};
      if (updates.learned !== undefined) {
        dbUpdates.learned = updates.learned;
      }
      if (updates.reviewLater !== undefined) {
        dbUpdates.review_later = updates.reviewLater;
      }
      
      // Send to database
      const { error } = await supabase
        .from('flashcards')
        .update(dbUpdates)
        .eq('id', flashcardId);
      
      if (error) {
        console.error("Error updating flashcard interaction:", error);
        throw error;
      }
      
      // Update stats if marking as learned
      if (updates.learned) {
        updateUserStats({ cardsLearned: 1 });
      }
      
    } catch (error) {
      console.error("Error in updateFlashcardUserInteraction:", error);
    }
  }, [currentUserId, updateUserStats]);

  // Provide all methods and state to children
  return (
    <LocalStorageContext.Provider
      value={{
        // State
        categories,
        flashcards,
        programs,
        userStats,
        isContextLoading,

        // Methods
        fetchFlashcardsByCategory,
        fetchFlashcardsByProgramId,
        fetchProgramsByCategory,
        fetchProgram,
        fetchGenericModules,
        fetchUserModules,
        addCategory,
        addFlashcard,
        updateFlashcard,
        deleteFlashcard,
        importFlashcards,
        getCategory,
        getFlashcardsByCategory,
        markProgramCompleted,
        updateUserStats,
        initializeContext,
        resetContext,
        debugFlashcardLoading,
        updateFlashcardUserInteraction,
      }}
    >
      {children}
    </LocalStorageContext.Provider>
  );
};

// Custom hook for consuming context
export const useLocalStorage = (): LocalStorageContextType => {
  const context = useContext(LocalStorageContext);
  if (!context) {
    throw new Error('useLocalStorage must be used within a LocalStorageProvider');
  }
  return context;
};
