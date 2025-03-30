
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLocalStorage } from '@/context/LocalStorageContext';
import { ProgramCard } from '@/components/ProgramCard';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

const CategoryPage = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const { getCategory, getProgramsByCategory } = useLocalStorage();

  const category = getCategory(categoryId || '');
  const programs = getProgramsByCategory(categoryId || '');

  const difficultyOrder = ['beginner', 'intermediate', 'advanced', 'expert'];
  
  // Group programs by difficulty
  const programsByDifficulty = difficultyOrder.map(difficulty => ({
    difficulty,
    programs: programs.filter(program => program.difficulty === difficulty)
  }));

  if (!category) {
    return (
      <div className="container px-4 py-12 mx-auto text-center">
        <p className="text-xl text-gray-600">Kategorin hittades inte.</p>
        <Button asChild className="mt-4">
          <Link to="/">Tillbaka till startsidan</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container px-4 py-8 mx-auto">
      <Link to="/" className="inline-flex items-center text-gray-600 hover:text-learny-purple mb-6">
        <ChevronLeft className="h-5 w-5 mr-1" />
        Tillbaka till startsidan
      </Link>

      <h1 className="text-3xl font-bold mb-6">{category.name}</h1>
      <p className="text-lg text-gray-600 mb-8">{category.description}</p>

      {programsByDifficulty.map(({ difficulty, programs }) => (
        programs.length > 0 && (
          <section key={difficulty} className="mb-12">
            <h2 className="text-2xl font-bold mb-6">
              {difficulty === 'beginner' && 'Nybörjare'}
              {difficulty === 'intermediate' && 'Medel'}
              {difficulty === 'advanced' && 'Avancerad'}
              {difficulty === 'expert' && 'Expert'}
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {programs.map((program) => (
                <ProgramCard key={program.id} program={program} />
              ))}
            </div>
          </section>
        )
      ))}

      {programs.length === 0 && (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600 mb-4">Inga träningsprogram tillgängliga ännu för denna kategori.</p>
          <Button asChild>
            <Link to="/create">Skapa dina egna flashcards</Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
