import { useEffect } from 'react';
import { CategoryCard } from '@/components/CategoryCard';
import { ProgramCard } from '@/components/ProgramCard';
// Removed Flashcard import as it's no longer used here
import { useLocalStorage } from '@/context/LocalStorageContext';
import { useAuth } from '@/context/AuthContext';
import { BookOpen, Award, TrendingUp } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Home = () => {
  const { categories, programs, flashcards, userStats, updateUserStats } = useLocalStorage();
  const { achievements } = useAuth();
  // Removed state for category challenge

  useEffect(() => {
    // Update streak on page visit
    updateUserStats({});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateUserStats]); // Only updateUserStats dependency left


  // Get recently completed programs
  const recentlyCompletedPrograms = programs
    .filter(program => userStats.completedPrograms.includes(program.id))
    .slice(0, 3); // Simplified for now

  // Get popular programs (beginner programs)
  const popularPrograms = programs
    .filter(program => program.difficulty === 'beginner')
    .slice(0, 3);


  return (
    // Apply the gradient background here
    <div>
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
          <div className="bg-card text-card-foreground rounded-xl p-6 shadow-sm border border-border">
            <div className="flex items-center mb-2">
              <BookOpen className="h-5 w-5 text-learny-purple mr-2" />
              <h3 className="text-lg font-medium">Streak</h3>
            </div>
            <p className="text-3xl font-bold">{userStats.streak} dagar</p>
            <p className="text-sm text-muted-foreground mt-1">Fortsätt din inlärningsresa</p>
          </div>

          <div className="bg-card text-card-foreground rounded-xl p-6 shadow-sm border border-border">
            <div className="flex items-center mb-2">
              <Award className="h-5 w-5 text-learny-yellow mr-2" />
              <h3 className="text-lg font-medium">Prestationer</h3>
            </div>
            <p className="text-3xl font-bold">{achievements.length}</p>
            <p className="text-sm text-muted-foreground mt-1">Upplåsta utmärkelser</p>
          </div>

          <div className="bg-card text-card-foreground rounded-xl p-6 shadow-sm border border-border">
            <div className="flex items-center mb-2">
              <TrendingUp className="h-5 w-5 text-learny-green mr-2" />
              <h3 className="text-lg font-medium">Flashcards</h3>
            </div>
            <p className="text-3xl font-bold">{userStats.cardsLearned} / {flashcards.length}</p>
            <p className="text-sm text-muted-foreground mt-1">Inlärda kort</p>
          </div>
        </div>
      </section>

      {/* Category Challenge Section - REMOVED */}

      {/* Categories Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Välj ett ämne</h2>
        {categories.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            Inga kategorier hittades. Du kan skapa flashcards och kategorier via 'Skapa'-sidan.
          </div>
        )}
      </section>

      {/* Programs Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Träningsprogram</h2>
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
               <div className="text-center py-8 text-muted-foreground">
                 Inga program markerade som 'Nybörjare' hittades.
               </div>
            )}
            {programs.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
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
                <p className="text-muted-foreground mb-4">Du har inte slutfört några program ännu.</p>
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