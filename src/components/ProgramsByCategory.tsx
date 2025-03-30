
import React from 'react';
import { useLocalStorage } from '@/context/LocalStorageContext';
import { ProgramCard } from '@/components/ProgramCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ProgramsByCategoryProps {
  categoryId: string;
}

export const ProgramsByCategory: React.FC<ProgramsByCategoryProps> = ({ categoryId }) => {
  const { getProgramsByCategory, getCategory } = useLocalStorage();
  
  const programs = getProgramsByCategory(categoryId);
  const category = getCategory(categoryId);
  
  if (programs.length === 0) {
    return null;
  }

  // Group programs by difficulty
  const beginnerPrograms = programs.filter(program => program.difficulty === 'beginner');
  const intermediatePrograms = programs.filter(program => program.difficulty === 'intermediate');
  const advancedPrograms = programs.filter(program => program.difficulty === 'advanced');
  const expertPrograms = programs.filter(program => program.difficulty === 'expert');

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Program i {category?.name}</CardTitle>
      </CardHeader>
      <CardContent>
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
