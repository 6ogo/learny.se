
import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, ChevronRight } from 'lucide-react';
import { useLocalStorage, Program } from '@/context/LocalStorageContext';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface ProgramCardProps {
  program: Program;
}

export const ProgramCard: React.FC<ProgramCardProps> = ({ program }) => {
  const { userStats } = useLocalStorage();
  
  const isCompleted = userStats.completedPrograms.includes(program.id);
  
  const getDifficultyColor = () => {
    switch (program.difficulty) {
      case 'beginner':
        return 'bg-learny-green dark:bg-learny-green-dark text-white';
      case 'intermediate':
        return 'bg-learny-blue dark:bg-learny-blue-dark text-white';
      case 'advanced':
        return 'bg-learny-purple dark:bg-learny-purple-dark text-white';
      case 'expert':
        return 'bg-learny-red dark:bg-learny-red-dark text-white';
      default:
        return 'bg-learny-blue dark:bg-learny-blue-dark text-white';
    }
  };
  
  const getDifficultyText = () => {
    switch (program.difficulty) {
      case 'beginner':
        return 'Nybörjare';
      case 'intermediate':
        return 'Medel';
      case 'advanced':
        return 'Avancerad';
      case 'expert':
        return 'Expert';
      default:
        return 'Medel';
    }
  };

  return (
    <Link 
      to={`/study/${program.id}`}
      className="block transform transition-all duration-300 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 rounded-xl"
    >
      <Card className="h-full border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-300 dark:bg-gray-800">
        <CardContent className="pt-6">
          <div className="flex justify-between items-start mb-2">
            <Badge variant="outline" className={getDifficultyColor()}>
              {getDifficultyText()}
            </Badge>
            
            {isCompleted && (
              <span className="flex items-center text-learny-green dark:text-learny-green-dark text-sm font-medium">
                <CheckCircle className="h-4 w-4 mr-1" />
                Slutförd
              </span>
            )}
          </div>
          
          <h3 className="text-lg font-semibold mb-2 dark:text-white">{program.name}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{program.description}</p>
          
          {program.progress !== undefined && (
            <div className="mb-2">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Framsteg</span>
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{program.progress}%</span>
              </div>
              <Progress value={program.progress} className="h-2" />
            </div>
          )}
          
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {program.flashcards.length} flashcards
          </div>
        </CardContent>
        
        <CardFooter className="pt-2 pb-4">
          <div className="w-full flex justify-end">
            <span className="text-learny-purple dark:text-learny-purple-dark font-medium text-sm flex items-center">
              Studera nu <ChevronRight className="h-4 w-4 ml-1" />
            </span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};
