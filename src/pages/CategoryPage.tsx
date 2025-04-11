
// src/pages/CategoryPage.tsx
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLocalStorage } from '@/context/LocalStorageContext';
import { ProgramsByCategory } from '@/components/ProgramsByCategory';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Filter } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Program } from '@/types/program';

const CategoryPage = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const { getCategory, updateUserStats, fetchProgramsByCategory } = useLocalStorage();
  const [subcategories, setSubcategories] = useState<string[]>([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('all');
  const [difficultiesInCategory, setDifficultiesInCategory] = useState<string[]>([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [allPrograms, setAllPrograms] = useState<Program[]>([]);

  const category = getCategory(categoryId || '');

  useEffect(() => {
    // Update streak on page visit
    updateUserStats({});

    // Load programs and extract available subcategories and difficulties
    const loadProgramsAndFilters = async () => {
      if (categoryId) {
        try {
          const programs = await fetchProgramsByCategory(categoryId);
          setAllPrograms(programs);
          
          // Extract unique subcategories
          const uniqueSubcategories = [...new Set(programs
            .map(program => program.subcategory)
            .filter(Boolean) as string[]
          )];
          
          // Extract unique difficulties
          const uniqueDifficulties = [...new Set(programs
            .map(program => program.difficulty)
            .filter(Boolean) as string[]
          )];
          
          setSubcategories(uniqueSubcategories);
          setDifficultiesInCategory(uniqueDifficulties);
        } catch (error) {
          console.error("Error loading programs for filters:", error);
        }
      }
    };
    
    loadProgramsAndFilters();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryId]);
  
  // Reset filters when category changes
  useEffect(() => {
    setSelectedSubcategory('all');
    setSelectedDifficulty('all');
  }, [categoryId]);

  const handleSubcategoryChange = (value: string) => {
    setSelectedSubcategory(value);
  };

  const handleDifficultyChange = (value: string) => {
    setSelectedDifficulty(value);
  };

  // Create filter object to pass to the ProgramsByCategory component
  const filters = {
    subcategory: selectedSubcategory !== 'all' ? selectedSubcategory : undefined,
    difficulty: selectedDifficulty !== 'all' ? selectedDifficulty : undefined
  };

  if (!category) {
    return (
      <div>
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 dark:text-white">Kategori hittades inte</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-4">Den kategori du söker verkar inte finnas.</p>
          <Button asChild>
            <Link to="/home">Tillbaka till startsidan</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center">
        <Button variant="ghost" size="icon" asChild className="mr-2">
          <Link to="/home">
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Tillbaka till startsidan</span>
          </Link>
        </Button>
        <h1 className="text-3xl font-bold dark:text-white">{category.name}</h1>
      </div>

      <p className="text-gray-600 dark:text-gray-300 mb-6">{category.description}</p>

      {/* Filter section */}
      {(subcategories.length > 0 || difficultiesInCategory.length > 0) && (
        <div className="mb-6 bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-5 w-5 text-gray-500" />
            <h2 className="text-lg font-medium">Filtrera program</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {subcategories.length > 0 && (
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                  Underkategori
                </label>
                <Select value={selectedSubcategory} onValueChange={handleSubcategoryChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Välj underkategori" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="all">Alla underkategorier</SelectItem>
                      {subcategories.map((subcategory) => (
                        <SelectItem key={subcategory} value={subcategory}>{subcategory}</SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            )}

            {difficultiesInCategory.length > 0 && (
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                  Svårighetsgrad
                </label>
                <Select value={selectedDifficulty} onValueChange={handleDifficultyChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Välj svårighetsgrad" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="all">Alla svårighetsgrader</SelectItem>
                      {difficultiesInCategory.map((difficulty) => (
                        <SelectItem key={difficulty} value={difficulty}>
                          {difficulty === 'beginner' && 'Nybörjare'}
                          {difficulty === 'intermediate' && 'Medel'}
                          {difficulty === 'advanced' && 'Avancerad'}
                          {difficulty === 'expert' && 'Expert'}
                          {!['beginner', 'intermediate', 'advanced', 'expert'].includes(difficulty) && difficulty}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Display Only Programs */}
      <ProgramsByCategory categoryId={category.id} filters={filters} />
    </div>
  );
};

export default CategoryPage;
