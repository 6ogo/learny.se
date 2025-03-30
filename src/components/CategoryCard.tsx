
import React from 'react';
import { Link } from 'react-router-dom';
import { Book, Code, Plus, Flask, Languages } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Category } from '@/context/LocalStorageContext';

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
        return <Flask className="h-6 w-6" />;
      case 'languages':
        return <Languages className="h-6 w-6" />;
      default:
        return <Book className="h-6 w-6" />;
    }
  };

  const getColorClass = () => {
    switch (category.color) {
      case 'bg-learny-red':
        return 'from-red-500 to-red-600';
      case 'bg-learny-blue':
        return 'from-blue-500 to-blue-600';
      case 'bg-learny-purple':
        return 'from-purple-500 to-purple-600';
      case 'bg-learny-green':
        return 'from-green-500 to-green-600';
      case 'bg-learny-yellow':
        return 'from-yellow-500 to-yellow-600';
      default:
        return 'from-purple-500 to-purple-600';
    }
  };

  return (
    <Link 
      to={`/category/${category.id}`}
      className="block transform transition-all duration-300 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 rounded-xl"
    >
      <div className={cn(
        "h-40 w-full rounded-xl relative overflow-hidden shadow-md",
        "bg-gradient-to-br", getColorClass()
      )}>
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute bottom-0 left-0 right-0 top-0 flex flex-col justify-center items-center p-4 text-white">
          <div className="bg-white/20 rounded-full p-3 mb-3">
            {getIcon()}
          </div>
          <h3 className="text-xl font-bold mb-1">{category.name}</h3>
          <p className="text-sm text-center text-white/90">{category.description}</p>
        </div>
      </div>
    </Link>
  );
};
