// src/pages/CategoryPage.tsx
import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLocalStorage } from '@/context/LocalStorageContext';
import { ProgramsByCategory } from '@/components/ProgramsByCategory';
import { FlashcardsByLevel } from '@/components/FlashcardsByLevel'; // Import the component
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Flashcard } from '@/types/flashcard'; // Import Flashcard type

const CategoryPage = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const { getCategory, updateUserStats, getFlashcardsByCategory } = useLocalStorage(); // Add getFlashcardsByCategory

  const category = getCategory(categoryId || '');
  const categoryFlashcards = getFlashcardsByCategory(categoryId || ''); // Get all flashcards for this category

  useEffect(() => {
    // Update streak on page visit
    updateUserStats({});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only depends on updateUserStats which is stable

  if (!category) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 dark:text-white">Kategori hittades inte</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-4">Den kategori du söker verkar inte finnas.</p>
          <Button asChild>
            <Link to="/">Tillbaka till startsidan</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Check if there are any flashcards at all for this category
  const hasFlashcards = categoryFlashcards.length > 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center">
        <Button variant="ghost" size="icon" asChild className="mr-2">
          <Link to="/">
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Tillbaka till startsidan</span>
          </Link>
        </Button>
        <h1 className="text-3xl font-bold dark:text-white">{category.name}</h1>
      </div>

      <p className="text-gray-600 dark:text-gray-300 mb-8">{category.description}</p>

      {/* Display Programs */}
      <ProgramsByCategory categoryId={category.id} />

      {/* Display Flashcards by Level */}
      <h2 className="text-2xl font-bold mt-12 mb-6 dark:text-white">Flashcards i {category.name}</h2>
      {hasFlashcards ? (
        <>
          <FlashcardsByLevel categoryId={category.id} difficulty="beginner" />
          <FlashcardsByLevel categoryId={category.id} difficulty="intermediate" />
          <FlashcardsByLevel categoryId={category.id} difficulty="advanced" />
          <FlashcardsByLevel categoryId={category.id} difficulty="expert" />
        </>
      ) : (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <p className="mb-4">Det finns inga flashcards i denna kategori ännu.</p>
          <Button asChild>
             <Link to="/create">Skapa nya flashcards</Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;