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
import { supabase } from '@/integrations/supabase/client'; // Import supabase

const Home = () => {
  const {
    categories,
    userStats,
    updateUserStats,
    fetchProgramsByCategory,
    programs: localProgramsState // Get temporary local programs state
  } = useLocalStorage();
  const { user, achievements } = useAuth();

  const [popularPrograms, setPopularPrograms] = useState<Program[]>([]);
  const [recentlyCompletedPrograms, setRecentlyCompletedPrograms] = useState<Program[]>([]);
  const [isLoadingPrograms, setIsLoadingPrograms] = useState(true);
  const [totalCardCount, setTotalCardCount] = useState<number | null>(null);

   // Fetch total card count (optional, can be slow)
   const fetchTotalCardCount = useCallback(async () => {
       // ... (implementation is correct) ...
        try {
           const { count, error } = await supabase
               .from('flashcards')
               .select('*', { count: 'exact', head: true })
               .eq('is_approved', true);
           if (error) throw error;
           setTotalCardCount(count ?? 0);
       } catch (error) { /* ... */ }
   }, []);


  // Fetch popular programs
  const loadPopularPrograms = useCallback(async () => {
      setIsLoadingPrograms(true); // Set loading true at the start
      try {
        console.warn("Popular programs logic needs refinement after program migration.");
        if (categories.length > 0) {
             // Fetching all beginner programs (adjust this logic as needed)
             const allBeginnerPrograms: Program[] = [];
             // You might fetch from DB directly here later
             // For now, using the context's temporary fetch
             for (const cat of categories) {
                 const catPrograms = await fetchProgramsByCategory(cat.id);
                 allBeginnerPrograms.push(...catPrograms.filter(p => p.difficulty === 'beginner'));
             }
             // Simple sort or limit for popularity placeholder
             setPopularPrograms(allBeginnerPrograms.slice(0, 6)); // Show up to 6 'popular'
        } else {
            setPopularPrograms([]);
        }
     } catch (error) {
          console.error("Error fetching popular programs:", error);
          setPopularPrograms([]);
     } finally {
         // Consider setting loading false only after both loads finish in useEffect
     }
  }, [fetchProgramsByCategory, categories]);

  // Fetch recently completed programs (uses localProgramsState)
  const loadCompletedPrograms = useCallback(() => {
    const completedIds = userStats.completedPrograms || [];
    // Corrected: Use localProgramsState
    const completed = localProgramsState
        .filter(program => completedIds.includes(program.id))
        // Add sorting if completion dates were stored
        .slice(-3); // Get last 3 completed
    setRecentlyCompletedPrograms(completed);
    console.warn("Completed programs display relies on program migration & local state.")
  }, [userStats.completedPrograms, localProgramsState]); // Correct dependency

  // Initial data loading effect
  useEffect(() => {
    updateUserStats({}); // Update activity/streak

    const loadData = async () => {
        setIsLoadingPrograms(true);
        await Promise.all([
            loadPopularPrograms(),
            fetchTotalCardCount()
        ]);
        // Load completed *after* other fetches, relying on local state for now
        loadCompletedPrograms();
        setIsLoadingPrograms(false); // Set loading false after all fetches complete
    };
    loadData();
  }, [updateUserStats, loadPopularPrograms, loadCompletedPrograms, fetchTotalCardCount]);

  // --- Rest of the component's JSX ---
  // (Welcome, Stats, Categories sections remain the same)

  return (
    <div>
        {/* ... Welcome Section ... */}
        {/* ... Stats Section ... */}
        {/* ... Categories Section ... */}

        {/* Programs Section */}
        <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Träningsprogram</h2>
            <Tabs defaultValue="popular">
                <TabsList className="mb-6">
                    <TabsTrigger value="popular">Populära</TabsTrigger>
                    <TabsTrigger value="completed">Nyligen slutförda</TabsTrigger>
                </TabsList>

                <TabsContent value="popular">
                    {isLoadingPrograms ? (
                        <div className="flex justify-center items-center py-12"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
                    ) : popularPrograms.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {popularPrograms.map((program) => <ProgramCard key={program.id} program={program} />)}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-muted-foreground">Inga populära program hittades.</div>
                    )}
                </TabsContent>

                <TabsContent value="completed">
                    {isLoadingPrograms ? (
                        <div className="flex justify-center items-center py-12"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
                    ) : recentlyCompletedPrograms.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {recentlyCompletedPrograms.map((program) => <ProgramCard key={program.id} program={program} />)}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <p className="text-muted-foreground mb-4">Du har inte slutfört några program ännu.</p>
                            {categories.length > 0 && (
                                <Button asChild className="mt-4"><Link to={`/category/${categories[0].id}`}>Hitta program att slutföra</Link></Button>
                            )}
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </section>
    </div>
  );
};

export default Home;