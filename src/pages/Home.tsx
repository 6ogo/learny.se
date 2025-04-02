
// src/pages/Home.tsx - replace with this clean version
import React, { useEffect, useState, useCallback } from 'react';
import { CategoryCard } from '@/components/CategoryCard';
import { useLocalStorage } from '@/context/LocalStorageContext';
import { useAuth } from '@/context/AuthContext';
import { BookOpen, Award, TrendingUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const Home = () => {
  const {
    categories,
    userStats,
    updateUserStats
  } = useLocalStorage();
  const { user } = useAuth();

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

  // Initial data loading effect
  useEffect(() => {
    updateUserStats({}); // Update activity/streak
  
    const loadData = async () => {
      await fetchTotalCardCount();
    };
    
    if (user?.id) {
      loadData();
    }
  }, [updateUserStats, fetchTotalCardCount, user?.id]);
  
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
