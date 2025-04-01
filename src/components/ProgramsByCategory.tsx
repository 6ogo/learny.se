// src/components/ProgramsByCategory.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { useLocalStorage } from '@/context/LocalStorageContext';
import { ProgramCard } from '@/components/ProgramCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Program } from '@/types/program'; // Import Program type
import { Loader2 } from 'lucide-react';

interface ProgramsByCategoryProps {
  categoryId: string;
}

export const ProgramsByCategory: React.FC<ProgramsByCategoryProps> = ({ categoryId }) => {
  const { fetchProgramsByCategory, getCategory } = useLocalStorage();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const category = getCategory(categoryId); // Still okay to get static category data

  const loadPrograms = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
        // **** THIS WILL USE THE PLACEHOLDER/LOCAL STATE FETCH ****
        // **** Replace with real DB fetch after program migration ****
      const fetchedPrograms = await fetchProgramsByCategory(categoryId);
      setPrograms(fetchedPrograms);
    } catch (err: any) {
      setError(err.message || "Failed to load programs.");
      setPrograms([]);
    } finally {
      setIsLoading(false);
    }
  }, [categoryId, fetchProgramsByCategory]);

  useEffect(() => {
    loadPrograms();
  }, [loadPrograms]);

  if (isLoading) {
    return (
      <Card className="mb-8">
        <CardHeader><CardTitle>Program i {category?.name || '...'}</CardTitle></CardHeader>
        <CardContent className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
           <span className="ml-2 text-muted-foreground">Laddar program...</span>
        </CardContent>
      </Card>
    );
  }

   if (error) {
     return (
       <Card className="mb-8 border-l-4 border-destructive">
         <CardHeader><CardTitle>Fel</CardTitle></CardHeader>
         <CardContent>
           <p className="text-destructive">{error}</p>
         </CardContent>
       </Card>
     );
   }


  if (programs.length === 0) {
    return (
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Program i {category?.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center py-8 dark:text-gray-400">
            Inga program tillgängliga i denna kategori ännu.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Group programs by difficulty (logic remains the same)
  const beginnerPrograms = programs.filter(p => p.difficulty === 'beginner');
  const intermediatePrograms = programs.filter(p => p.difficulty === 'intermediate');
  const advancedPrograms = programs.filter(p => p.difficulty === 'advanced');
  const expertPrograms = programs.filter(p => p.difficulty === 'expert');

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Program i {category?.name}</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Beginner Programs */}
        {beginnerPrograms.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 dark:text-white">Nybörjare</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {beginnerPrograms.map(program => (
                <ProgramCard key={program.id} program={program} />
              ))}
            </div>
          </div>
        )}

        {/* Intermediate Programs */}
        {intermediatePrograms.length > 0 && (
           <div className="mb-6">
             <h3 className="text-lg font-semibold mb-3 dark:text-white">Medel</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
               {intermediatePrograms.map(program => (
                 <ProgramCard key={program.id} program={program} />
               ))}
             </div>
           </div>
        )}

        {/* Advanced Programs */}
        {advancedPrograms.length > 0 && (
           <div className="mb-6">
             <h3 className="text-lg font-semibold mb-3 dark:text-white">Avancerad</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
               {advancedPrograms.map(program => (
                 <ProgramCard key={program.id} program={program} />
               ))}
             </div>
           </div>
        )}

        {/* Expert Programs */}
        {expertPrograms.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-3 dark:text-white">Expert</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {expertPrograms.map(program => (
                <ProgramCard key={program.id} program={program} />
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};