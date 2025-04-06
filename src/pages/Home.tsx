
// src/pages/Home.tsx
import React, { useEffect, useState, useCallback } from 'react';
import { CategoryCard } from '@/components/CategoryCard';
import { useLocalStorage } from '@/context/LocalStorageContext';
import { useAuth } from '@/context/AuthContext';
import { BookOpen, Award, TrendingUp, BookMarked, UserCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { ModulesSection } from '@/components/ModulesSection';
import { Program } from '@/types/program';

const Home = () => {
  const {
    categories,
    userStats,
    updateUserStats,
    fetchGenericModules,
    fetchUserModules
  } = useLocalStorage();
  const { user } = useAuth();

  const [totalCardCount, setTotalCardCount] = useState<number | null>(null);
  const [moduleCount, setModuleCount] = useState<number | null>(null);
  const [genericModules, setGenericModules] = useState<Program[]>([]);
  const [userModules, setUserModules] = useState<Program[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

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

  // Fetch modules (both generic and user-specific)
  const loadModules = useCallback(async () => {
    setIsLoading(true);
    try {
      const [genericMods, userMods] = await Promise.all([
        fetchGenericModules(),
        fetchUserModules()
      ]);
      
      setGenericModules(genericMods);
      setUserModules(userMods);
    } catch (error) {
      console.error("Error loading modules:", error);
    } finally {
      setIsLoading(false);
    }
  }, [fetchGenericModules, fetchUserModules]);

  // Initial data loading effect
  useEffect(() => {
    updateUserStats({}); // Update activity/streak
  
    const loadData = async () => {
      await fetchTotalCardCount();
      await loadModules();
    };
    
    if (user?.id) {
      loadData();
    }
  }, [updateUserStats, fetchTotalCardCount, user?.id, loadModules]);
  
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
            <h3 className="text-lg font-medium dark:text-white">Moduler</h3>
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

      {/* User Modules Section */}
      <ModulesSection 
        title="Dina moduler" 
        icon={<UserCircle className="h-6 w-6" />} 
        modules={userModules} 
        emptyMessage="Du har inte skapat några egna moduler än."
        isLoading={isLoading}
      />

      {/* Generic Modules Section */}
      <ModulesSection 
        title="Learny Moduler" 
        icon={<BookMarked className="h-6 w-6" />} 
        modules={genericModules}
        emptyMessage="Det finns inga generiska moduler tillgängliga."
        isLoading={isLoading}
      />

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
