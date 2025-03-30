import React from 'react';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FlashcardsByLevel } from '@/components/FlashcardsByLevel';
import { useLocalStorage } from '@/context/LocalStorageContext';
import Link from 'next/link';
import { Layout } from '@/components/layout/Layout';

const difficultyLevels = [
  { id: 'beginner', label: 'Nybörjare', color: 'bg-learny-green' },
  { id: 'intermediate', label: 'Medel', color: 'bg-learny-blue' },
  { id: 'advanced', label: 'Avancerad', color: 'bg-learny-purple' },
  { id: 'expert', label: 'Expert', color: 'bg-learny-red' },
];

export default function MedicinePage() {
  const { getFlashcardsByCategory } = useLocalStorage();
  
  // Get total flashcard count for medicine category
  const totalFlashcards = getFlashcardsByCategory('medicine').length;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <Link href="/" passHref>
            <Button variant="ghost" className="px-0">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Tillbaka till ämnen
            </Button>
          </Link>
        </div>
        
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="rounded-full bg-learny-red p-2">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold">Medicin</h1>
          </div>
          <p className="text-muted-foreground mt-2">
            Lär dig medicinska termer, procedurer och koncept
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Totalt {totalFlashcards} flashcards i denna kategori
          </p>
        </div>
        
        {/* Show flashcards by difficulty level */}
        {difficultyLevels.map(level => (
          <FlashcardsByLevel
            key={level.id}
            categoryId="medicine"
            difficulty={level.id as any}
          />
        ))}
      </div>
    </Layout>
  );
}