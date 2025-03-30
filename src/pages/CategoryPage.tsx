
import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLocalStorage } from '@/context/LocalStorageContext';
import { ProgramsByCategory } from '@/components/ProgramsByCategory';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const CategoryPage = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const { getCategory, updateUserStats } = useLocalStorage();
  
  const category = getCategory(categoryId || '');
  
  useEffect(() => {
    // Update streak on page visit
    updateUserStats({});
  }, []);
  
  if (!category) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 dark:text-white">Kategori hittades inte</h1>
          <Button asChild>
            <Link to="/">Tillbaka till startsidan</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center">
        <Button variant="ghost" size="icon" asChild className="mr-2">
          <Link to="/">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold dark:text-white">{category.name}</h1>
      </div>
      
      <p className="text-gray-600 dark:text-gray-300 mb-8">{category.description}</p>

      {/* Programs by category */}
      <ProgramsByCategory categoryId={category.id} />
    </div>
  );
};

export default CategoryPage;
