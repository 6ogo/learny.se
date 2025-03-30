// src/pages/Home.tsx
import React, { useEffect, useState } from 'react';
import { CategoryCard } from '@/components/CategoryCard';
import { ProgramCard } from '@/components/ProgramCard';
import { Flashcard } from '@/components/Flashcard';
import { useLocalStorage } from '@/context/LocalStorageContext';
import { BookOpen, Award, TrendingUp } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Home = () => {
  const { categories, programs, flashcards, userStats, updateUserStats } = useLocalStorage();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categoryFlashcard, setCategoryFlashcard] = useState<any | null>(null);

  useEffect(() => {
    // Update streak on page visit
    updateUserStats({});

    // Select a random category on first render if categories exist
    if (categories.length > 0 && !selectedCategory) {
      const randomCategoryId = categories[Math.floor(Math.random() * categories.length)].id;
      setSelectedCategory(randomCategoryId);
    }
  // Only run once on mount, or if categories change and selectedCategory is still null
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categories, updateUserStats]);

  // When selectedCategory changes, pick a random flashcard from that category
  useEffect(() => {
    if (selectedCategory) {
      const categoryCards = flashcards.filter(card => card.category === selectedCategory);
      if (categoryCards.length > 0) {
        const randomCard = categoryCards[Math.floor(Math.random() * categoryCards.length)];
        setCategoryFlashcard(randomCard);
      } else {
        setCategoryFlashcard(null); // No flashcards in this category
      }
    } else {
      setCategoryFlashcard(null);
    }
  }, [selectedCategory, flashcards]);

  // Get recently completed programs
  const recentlyCompletedPrograms = programs
    .filter(program => userStats.completedPrograms.includes(program.id))
    // Sort by completion date if available, otherwise just take the latest ones added
    // For simplicity, we just take the first few matches
    .slice(0, 3);

  // Get popular programs (e.g., beginner programs, or based on some metric if available)
  // For now, let's just show the first few beginner programs
  const popularPrograms = programs
    .filter(program => program.difficulty === 'beginner')
    .slice(0, 3);

  // Handle selecting another category for challenge
  const handleNewCategoryChallenge = () => {
    if (categories.length > 0) {
      let availableCategories = categories.filter(c => c.id !== selectedCategory);
      if (availableCategories.length === 0) {
        availableCategories = categories; // Fallback if only one category or none different
      }
      if (availableCategories.length > 0) {
        const newCategoryId = availableCategories[Math.floor(Math.random() * availableCategories.length)].id;
        setSelectedCategory(newCategoryId);
      }
    }
  };

  // Get the name of the selected category
  const selectedCategoryName = categories.find(c => c.id === selectedCategory)?.name || 'Kategori';

  return (
    <div className="container px-4 py-8 mx-auto">
      {/* Welcome Section */}
      <section className="mb-12">
        <div className="bg-gradient-to-r from-learny-purple to-learny-blue rounded-2xl p-8 text-white">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Välkommen till Learny.se
            </h1>
            <p className="text-lg mb-6 text-white/90">
              Lär dig snabbare och roligare med interaktiva flashcards.
              Välj ett ämne nedan eller skapa dina egna kort.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/create">
                <Button variant="secondary" size="lg" className="bg-white text-learny-purple hover:bg-white/90">
                  Skapa flashcards
                </Button>
              </Link>
              <Link to="/achievements">
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/20">
                  <Award className="mr-2 h-5 w-5" />
                  Mina prestationer
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="mb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center mb-2">
              <BookOpen className="h-5 w-5 text-learny-purple dark:text-learny-purple-dark mr-2" />
              <h3 className="text-lg font-medium dark:text-white">Streak</h3>
            </div>
            <p className="text-3xl font-bold dark:text-white">{userStats.streak} dagar</p>
            <p className="text-sm text-gray-500 dark:text-gray-300 mt-1">Fortsätt din inlärningsresa</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center mb-2">
              <Award className="h-5 w-5 text-learny-yellow dark:text-learny-yellow-dark mr-2" />
              <h3 className="text-lg font-medium dark:text-white">Prestationer</h3>
            </div>
            <p className="text-3xl font-bold dark:text-white">{userStats.achievements.length}</p>
            <p className="text-sm text-gray-500 dark:text-gray-300 mt-1">Upplåsta utmärkelser</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center mb-2">
              <TrendingUp className="h-5 w-5 text-learny-green dark:text-learny-green-dark mr-2" />
              <h3 className="text-lg font-medium dark:text-white">Flashcards</h3>
            </div>
            <p className="text-3xl font-bold dark:text-white">{userStats.cardsLearned} / {flashcards.length}</p>
            <p className="text-sm text-gray-500 dark:text-gray-300 mt-1">Inlärda kort</p>
          </div>
        </div>
      </section>

      {/* Category Challenge Section */}
      {categoryFlashcard && selectedCategory && (
        <section className="mb-12">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold dark:text-white">
              Kategoriutmaning: {selectedCategoryName}
            </h2>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNewCategoryChallenge}
              className="text-learny-purple dark:text-learny-purple-dark border-learny-purple hover:bg-learny-purple/10 dark:border-learny-purple-dark dark:text-learny-purple-dark dark:hover:bg-learny-purple-dark/10"
            >
              Byt kategori
            </Button>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <Flashcard flashcard={categoryFlashcard} />
          </div>
        </section>
      )}
       {!categoryFlashcard && selectedCategory && (
         <section className="mb-12 text-center text-gray-500 dark:text-gray-400">
             Inga flashcards hittades för kategorin "{selectedCategoryName}". Skapa några!
         </section>
       )}


      {/* Categories Section - REMOVED GROUPING */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6 dark:text-white">Välj ett ämne</h2>
        {categories.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            Inga kategorier hittades. Du kan skapa flashcards och kategorier via 'Skapa'-sidan.
          </div>
        )}
      </section>

      {/* Programs Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6 dark:text-white">Träningsprogram</h2>
        <Tabs defaultValue="popular">
          <TabsList className="mb-6">
            <TabsTrigger value="popular">Populära</TabsTrigger>
            <TabsTrigger value="completed">Nyligen slutförda</TabsTrigger>
          </TabsList>

          <TabsContent value="popular">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {popularPrograms.map((program) => (
                <ProgramCard key={program.id} program={program} />
              ))}
            </div>

            {popularPrograms.length === 0 && programs.length > 0 && (
               <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                 Inga program markerade som 'Nybörjare' hittades.
               </div>
            )}
            {programs.length === 0 && (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                Inga träningsprogram tillgängliga ännu.
              </div>
            )}
          </TabsContent>

          <TabsContent value="completed">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentlyCompletedPrograms.map((program) => (
                <ProgramCard key={program.id} program={program} />
              ))}
            </div>

            {recentlyCompletedPrograms.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400 mb-4">Du har inte slutfört några program ännu.</p>
                {categories.length > 0 && (
                   <Button asChild className="mt-4">
                     {/* Link to the first category available */}
                     <Link to={`/category/${categories[0].id}`}>Hitta program att slutföra</Link>
                   </Button>
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