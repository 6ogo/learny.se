import React from 'react';
import { ArrowLeft, MapPin } from 'lucide-react';
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

export default function GeographyPage() {
  const { getFlashcardsByCategory, getTopicsByCategory } = useLocalStorage();
  const totalFlashcards = getFlashcardsByCategory('geography').length;
  const topics = getTopicsByCategory('geography');

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
            <div className="rounded-full bg-emerald-600 p-2">
              <MapPin className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold">Geografi</h1>
          </div>
          <p className="text-muted-foreground mt-2">
            Lär dig om länder, huvudstäder och landskap
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Totalt {totalFlashcards} flashcards i denna kategori
          </p>
          
          {topics.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {topics.map(topic => (
                <span key={topic} className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">
                  {topic}
                </span>
              ))}
            </div>
          )}
        </div>
        
        {difficultyLevels.map(level => (
          <FlashcardsByLevel
            key={level.id}
            categoryId="geography"
            difficulty={level.id as any}
          />
        ))}
      </div>
    </Layout>
  );
}