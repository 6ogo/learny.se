
import React, { useEffect } from 'react';
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

  useEffect(() => {
    // Update streak on page visit - men bara en gång när komponenten laddas
    // med tom dependency array för att undvika loopar
    updateUserStats({});
  }, []); // Tom dependency array för att undvika infinite loop

  // Använd memo för att få samma flashcard varje gång komponenten renderas
  // istället för att välja ett nytt kort varje render
  const randomFlashcard = React.useMemo(() => {
    return flashcards.length > 0 
      ? flashcards[Math.floor(Math.random() * flashcards.length)]
      : null;
  }, [flashcards]);

  // Get recently completed programs
  const recentlyCompletedPrograms = programs
    .filter(program => userStats.completedPrograms.includes(program.id))
    .slice(0, 3);

  // Get popular programs (top 3 by difficulty level)
  const popularPrograms = programs
    .filter(program => program.difficulty === 'beginner')
    .slice(0, 3);

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
              <h3 className="text-lg font-medium">Streak</h3>
            </div>
            <p className="text-3xl font-bold dark:text-white">{userStats.streak} dagar</p>
            <p className="text-sm text-gray-500 dark:text-gray-300 mt-1">Fortsätt din inlärningsresa</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center mb-2">
              <Award className="h-5 w-5 text-learny-yellow dark:text-learny-yellow-dark mr-2" />
              <h3 className="text-lg font-medium">Prestationer</h3>
            </div>
            <p className="text-3xl font-bold dark:text-white">{userStats.achievements.length}</p>
            <p className="text-sm text-gray-500 dark:text-gray-300 mt-1">Upplåsta utmärkelser</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center mb-2">
              <TrendingUp className="h-5 w-5 text-learny-green dark:text-learny-green-dark mr-2" />
              <h3 className="text-lg font-medium">Flashcards</h3>
            </div>
            <p className="text-3xl font-bold dark:text-white">{userStats.cardsLearned} / {flashcards.length}</p>
            <p className="text-sm text-gray-500 dark:text-gray-300 mt-1">Inlärda kort</p>
          </div>
        </div>
      </section>

      {/* Daily Challenge Section */}
      {randomFlashcard && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 dark:text-white">Dagens utmaning</h2>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <Flashcard flashcard={randomFlashcard} />
          </div>
        </section>
      )}

      {/* Categories Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6 dark:text-white">Ämnen</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </section>

      {/* Programs Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6 dark:text-white">Träningsprogram</h2>
        <Tabs defaultValue="popular">
          <TabsList className="mb-6">
            <TabsTrigger value="popular">Populära</TabsTrigger>
            <TabsTrigger value="completed">Slutförda</TabsTrigger>
          </TabsList>
          
          <TabsContent value="popular">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {popularPrograms.map((program) => (
                <ProgramCard key={program.id} program={program} />
              ))}
            </div>
            
            {popularPrograms.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">Inga program tillgängliga ännu.</p>
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
              <div className="text-center py-8 dark:text-gray-300">
                <p className="text-gray-500 dark:text-gray-400">Du har inte slutfört några program ännu.</p>
                <Button asChild className="mt-4">
                  <Link to="/category/medicine">Hitta program att slutföra</Link>
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
};

export default Home;
