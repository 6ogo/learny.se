
// src/pages/Home.tsx
import React, { useEffect, useState, useCallback } from 'react';
import { CategoryCard } from '@/components/CategoryCard';
import { ProgramCard } from '@/components/ProgramCard';
import { useLocalStorage } from '@/context/LocalStorageContext';
import { useAuth } from '@/context/AuthContext';
import { BookOpen, Award, TrendingUp, Loader2, Home as HomeIcon } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Program } from '@/types/program';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const Home = () => {
  const {
    categories,
    userStats,
    updateUserStats,
    fetchProgramsByCategory,
    programs: localProgramsState
  } = useLocalStorage();
  const { user, achievements } = useAuth();
  const { toast } = useToast();

  const [popularPrograms, setPopularPrograms] = useState<Program[]>([]);
  const [recentlyCompletedPrograms, setRecentlyCompletedPrograms] = useState<Program[]>([]);
  const [isLoadingPrograms, setIsLoadingPrograms] = useState(true);
  const [totalCardCount, setTotalCardCount] = useState<number | null>(null);
  const [moduleCount, setModuleCount] = useState<number | null>(null);

  // Fetch total card count
  const fetchTotalCardCount = useCallback(async () => {
    try {
      const { count, error } = await supabase
        .from('flashcards')
        .select('*', { count: 'exact', head: true })
        .eq('is_approved', true);
      
      if (error) throw error;
      setTotalCardCount(count ?? 0);

      // Also fetch module count
      const { count: modCount, error: modError } = await supabase
        .from('flashcard_modules')
        .select('*', { count: 'exact', head: true });
        
      if (modError) throw modError;
      setModuleCount(modCount ?? 0);
    } catch (error) {
      console.error("Error fetching counts:", error);
    }
  }, []);

  // Fetch popular programs
  const loadPopularPrograms = useCallback(async () => {
    setIsLoadingPrograms(true);
    try {
      if (!user?.id) return;
      
      // First, try to fetch real modules from Supabase
      const { data: modules, error } = await supabase
        .from('flashcard_modules')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(6);
        
      if (error) {
        console.error("Error fetching modules:", error);
        throw error;
      }
      
      if (modules && modules.length > 0) {
        // Convert modules to programs format
        const modulePrograms: Program[] = await Promise.all(
          modules.map(async module => {
            // Count flashcards for this module
            const { count, error: countError } = await supabase
              .from('flashcards')
              .select('*', { count: 'exact', head: true })
              .eq('module_id', module.id);
              
            if (countError) {
              console.error("Error counting flashcards:", countError);
            }
            
            return {
              id: module.id,
              name: module.name,
              description: module.description || `${module.name} flashcards`,
              category: module.category,
              difficulty: 'beginner', // Default difficulty
              flashcards: [], // IDs will be fetched when needed
              progress: 0,
              hasExam: false,
              flashcardCount: count || 0
            };
          })
        );
        
        setPopularPrograms(modulePrograms);
      } else {
        // Fallback to sample programs if no real modules exist
        console.warn("No modules found, using local program state.");
        setPopularPrograms(localProgramsState.slice(0, 6));
      }
    } catch (error) {
      console.error("Error fetching popular programs:", error);
      toast({
        title: "Kunde inte ladda program",
        description: "Ett fel uppstod när program skulle hämtas.",
        variant: "destructive"
      });
      // Fallback to local state
      setPopularPrograms(localProgramsState.slice(0, 6));
    } finally {
      setIsLoadingPrograms(false);
    }
  }, [user?.id, localProgramsState, toast]);

  // Fetch recently completed programs
  const loadCompletedPrograms = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      // First check if we have completed programs in user stats
      if (userStats.completedPrograms && userStats.completedPrograms.length > 0) {
        // Try to match completed program IDs with real modules
        const { data: modules, error } = await supabase
          .from('flashcard_modules')
          .select('*')
          .in('id', userStats.completedPrograms)
          .limit(3);
          
        if (error) {
          console.error("Error fetching completed modules:", error);
          throw error;
        }
        
        if (modules && modules.length > 0) {
          // Convert modules to programs format
          const modulePrograms: Program[] = modules.map(module => ({
            id: module.id,
            name: module.name,
            description: module.description || `${module.name} flashcards`,
            category: module.category,
            difficulty: 'beginner', // Default difficulty
            flashcards: [], // IDs will be fetched when needed
            progress: 100, // Completed
            hasExam: false
          }));
          
          setRecentlyCompletedPrograms(modulePrograms);
          return;
        }
      }
      
      // If no completed programs in user stats or no matching modules, 
      // try to fetch recent completed sessions
      const { data: sessions, error: sessionsError } = await supabase
        .from('flashcard_sessions')
        .select('*')
        .eq('user_id', user.id)
        .eq('completed', true)
        .order('end_time', { ascending: false })
        .limit(3);
        
      if (sessionsError) {
        console.error("Error fetching completed sessions:", sessionsError);
        throw sessionsError;
      }
      
      if (sessions && sessions.length > 0) {
        // For each session, try to find or create a corresponding program
        const sessionPrograms: Program[] = [];
        
        for (const session of sessions) {
          if (session.category) {
            // This was a category-based session
            const categoryName = categories.find(c => c.id === session.category)?.name || session.category;
            
            sessionPrograms.push({
              id: `${session.category}-recent-${session.id}`,
              name: `${categoryName} session`,
              description: `Completed on ${new Date(session.end_time).toLocaleDateString()}`,
              category: session.category,
              difficulty: 'beginner',
              flashcards: [],
              progress: 100,
              hasExam: false,
              flashcardCount: session.cards_studied
            });
          }
        }
        
        if (sessionPrograms.length > 0) {
          setRecentlyCompletedPrograms(sessionPrograms);
          return;
        }
      }
      
      // Final fallback: use local state
      console.warn("No completed programs found, using local state.");
      const completedIds = userStats.completedPrograms || [];
      const completed = localProgramsState
        .filter(program => completedIds.includes(program.id))
        .slice(0, 3);
      setRecentlyCompletedPrograms(completed);
      
    } catch (error) {
      console.error("Error loading completed programs:", error);
      // Fallback to local state
      const completedIds = userStats.completedPrograms || [];
      const completed = localProgramsState
        .filter(program => completedIds.includes(program.id))
        .slice(0, 3);
      setRecentlyCompletedPrograms(completed);
    }
  }, [user?.id, userStats.completedPrograms, localProgramsState, categories]);

  // Initial data loading effect
  useEffect(() => {
    updateUserStats({}); // Update activity/streak

    const loadData = async () => {
      setIsLoadingPrograms(true);
      await Promise.all([
        loadPopularPrograms(),
        fetchTotalCardCount()
      ]);
      
      await loadCompletedPrograms();
      setIsLoadingPrograms(false);
    };
    
    if (user?.id) {
      loadData();
    } else {
      setIsLoadingPrograms(false);
    }
  }, [updateUserStats, loadPopularPrograms, loadCompletedPrograms, fetchTotalCardCount, user?.id]);

  return (
    <div>
      {/* Welcome Section */}
      <section className="mb-12">
        <h1 className="text-3xl font-bold mb-2">Välkommen{user ? `, ${user.email?.split('@')[0]}` : ''}</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Välj en kategori eller fortsätt med dina pågående program.
        </p>
      </section>

      {/* Stats Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
          <div className="flex items-center mb-4">
            <div className="bg-learny-purple/10 dark:bg-learny-purple-dark/10 p-3 rounded-full mr-4">
              <BookOpen className="h-6 w-6 text-learny-purple dark:text-learny-purple-dark" />
            </div>
            <h3 className="text-lg font-medium dark:text-white">Flashcards</h3>
          </div>
          <p className="text-3xl font-bold dark:text-white">{totalCardCount !== null ? totalCardCount.toLocaleString() : '-'}</p>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">Tillgängliga flashcards</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
          <div className="flex items-center mb-4">
            <div className="bg-learny-green/10 dark:bg-learny-green-dark/10 p-3 rounded-full mr-4">
              <TrendingUp className="h-6 w-6 text-learny-green dark:text-learny-green-dark" />
            </div>
            <h3 className="text-lg font-medium dark:text-white">Modul</h3>
          </div>
          <p className="text-3xl font-bold dark:text-white">{moduleCount !== null ? moduleCount.toLocaleString() : '-'}</p>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">Tillgängliga moduler</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
          <div className="flex items-center mb-4">
            <div className="bg-learny-red/10 dark:bg-learny-red-dark/10 p-3 rounded-full mr-4">
              <Award className="h-6 w-6 text-learny-red dark:text-learny-red-dark" />
            </div>
            <h3 className="text-lg font-medium dark:text-white">Prestation</h3>
          </div>
          <p className="text-3xl font-bold dark:text-white">{userStats.streak || 0}</p>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">Dagars aktivitetssvit</p>
        </div>
      </section>

      {/* Categories Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Kategorier</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
