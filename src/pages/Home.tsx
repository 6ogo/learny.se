
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

    // Select a random category on first render
    if (categories.length > 0) {
      const randomCategoryId = categories[Math.floor(Math.random() * categories.length)].id;
      setSelectedCategory(randomCategoryId);
    }
  }, []);

  // When selectedCategory changes, pick a random flashcard from that category
  useEffect(() => {
    if (selectedCategory) {
      const categoryCards = flashcards.filter(card => card.category === selectedCategory);
      if (categoryCards.length > 0) {
        const randomCard = categoryCards[Math.floor(Math.random() * categoryCards.length)];
        setCategoryFlashcard(randomCard);
      }
    }
  }, [selectedCategory, flashcards]);

  // Get recently completed programs
  const recentlyCompletedPrograms = programs
    .filter(program => userStats.completedPrograms.includes(program.id))
    .slice(0, 3);

  // Get popular programs (top 3 by difficulty level)
  const popularPrograms = programs
    .filter(program => program.difficulty === 'beginner')
    .slice(0, 3);

  // Handle selecting another category for challenge
  const handleNewCategoryChallenge = () => {
    if (categories.length > 0) {
      // Select a different category than the current one
      let availableCategories = categories.filter(c => c.id !== selectedCategory);
      if (availableCategories.length === 0) {
        availableCategories = categories; // Fallback if only one category exists
      }
      const newCategoryId = availableCategories[Math.floor(Math.random() * availableCategories.length)].id;
      setSelectedCategory(newCategoryId);
    }
  };

  // Group categories by type
  const academicCategories = categories.filter(cat => 
    ['medicine', 'math', 'science', 'history'].includes(cat.id)
  );
  
  const techLanguageCategories = categories.filter(cat => 
    ['coding', 'languages'].includes(cat.id)
  );
  
  const practicalCategories = categories.filter(cat => 
    ['geography', 'vehicles', 'economics'].includes(cat.id)
  );

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
                <Button variant="outline" size="lg" className="border-white text-learny-purple hover:bg-white/20">
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

      {/* Category Challenge Section */}
      {categoryFlashcard && selectedCategory && (
        <section className="mb-12">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold dark:text-white">
              Kategoriutmaning: {categories.find(c => c.id === selectedCategory)?.name || 'Kategori'}
            </h2>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleNewCategoryChallenge}
              className="text-learny-purple dark:text-learny-purple-dark"
            >
              Byt kategori
            </Button>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <Flashcard flashcard={categoryFlashcard} />
          </div>
        </section>
      )}

      {/* Categories Section - Organized by topic groups */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6 dark:text-white">Ämnen</h2>
        
        {/* Academic Subjects */}
        <h3 className="text-xl font-medium mb-4 dark:text-gray-200">Akademiska ämnen</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {academicCategories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
        
        {/* Technology & Languages */}
        <h3 className="text-xl font-medium mb-4 dark:text-gray-200">Teknologi & Språk</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
          {techLanguageCategories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
        
        {/* Practical Knowledge */}
        <h3 className="text-xl font-medium mb-4 dark:text-gray-200">Praktisk kunskap</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {practicalCategories.map((category) => (
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
