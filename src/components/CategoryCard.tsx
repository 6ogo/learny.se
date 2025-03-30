
import React from 'react';
import { Link } from 'react-router-dom';
import { Book, Code, Plus, Beaker, Languages, Globe, Car, Banknote } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Category } from '@/context/LocalStorageContext';
import { Badge } from '@/components/ui/badge';

interface CategoryCardProps {
  category: Category;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  // Map category icon to Lucide icon component
  const getIcon = () => {
    switch (category.icon) {
      case 'stethoscope':
        return <Book className="h-6 w-6" />;
      case 'code':
        return <Code className="h-6 w-6" />;
      case 'plus':
        return <Plus className="h-6 w-6" />;
      case 'flask':
        return <Beaker className="h-6 w-6" />; // Changed Flask to Beaker which exists in lucide-react
      case 'languages':
        return <Languages className="h-6 w-6" />;
      case 'globe':
        return <Globe className="h-6 w-6" />;
      case 'car':
        return <Car className="h-6 w-6" />;
      case 'banknote':
        return <Banknote className="h-6 w-6" />;
      case 'book':
        return <Book className="h-6 w-6" />;
      default:
        return <Book className="h-6 w-6" />;
    }
  };

  const getColorClass = () => {
    switch (category.color) {
      case 'bg-learny-red':
        return 'from-red-500 to-red-600 dark:from-red-600 dark:to-red-700';
      case 'bg-learny-blue':
        return 'from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700';
      case 'bg-learny-purple':
        return 'from-purple-500 to-purple-600 dark:from-purple-600 dark:to-purple-700';
      case 'bg-learny-green':
        return 'from-green-500 to-green-600 dark:from-green-600 dark:to-green-700';
      case 'bg-learny-yellow':
        return 'from-yellow-500 to-yellow-600 dark:from-yellow-600 dark:to-yellow-700';
      default:
        return 'from-purple-500 to-purple-600 dark:from-purple-600 dark:to-purple-700';
    }
  };

  return (
    <Link 
      to={`/category/${category.id}`}
      className="block transform transition-all duration-300 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 rounded-xl"
    >
      <div className={cn(
        "h-48 w-full rounded-xl relative overflow-hidden shadow-md", // Increased height for more content
        "bg-gradient-to-br", getColorClass()
      )}>
        <div className="absolute inset-0 bg-black/10 dark:bg-black/20"></div>
        <div className="absolute bottom-0 left-0 right-0 top-0 flex flex-col justify-center items-center p-4 text-white">
          <div className="bg-white/20 rounded-full p-3 mb-3">
            {getIcon()}
          </div>
          <h3 className="text-xl font-bold mb-1">{category.name}</h3>
          <p className="text-sm text-center text-white/90 mb-3">{category.description}</p>
          
          {/* Learning path visualization */}
          <div className="flex space-x-1">
            <Badge variant="outline" className="bg-white/20 hover:bg-white/30 text-white text-xs border-none">
              Nybörjare
            </Badge>
            <span className="text-white">→</span>
            <Badge variant="outline" className="bg-white/20 hover:bg-white/30 text-white text-xs border-none">
              Medel
            </Badge>
            <span className="text-white">→</span>
            <Badge variant="outline" className="bg-white/20 hover:bg-white/30 text-white text-xs border-none">
              Avancerad
            </Badge>
            <span className="text-white">→</span>
            <Badge variant="outline" className="bg-white/20 hover:bg-white/30 text-white text-xs border-none">
              Expert
            </Badge>
          </div>
        </div>
      </div>
    </Link>
  );
};
