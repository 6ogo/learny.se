import React from 'react';
import { useRouter } from 'next/router';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FlashcardsByLevel } from '@/components/FlashcardsByLevel';
import { useLocalStorage } from '@/context/LocalStorageContext';
import Link from 'next/link';

const difficultyLevels = [
  { id: 'beginner', label: 'Nybörjare', color: 'bg-learny-green' },
  { id: 'intermediate', label: 'Medel', color: 'bg-learny-blue' },
  { id: 'advanced', label: 'Avancerad', color: 'bg-learny-purple' },
  { id: 'expert', label: 'Expert', color: 'bg-learny-red' },
];

// Define category mapping for titles and descriptions
const categoryInfo: Record<string, { title: string, description: string }> = {
  medicine: {
    title: 'Medicin',
    description: 'Lär dig medicinska termer, procedurer och koncept',
  },
  coding: {
    title: 'Kodning',
    description: 'Utforska programmeringsspråk, koncept och tekniker',
  },
  math: {
    title: 'Matematik',
    description: 'Från grundläggande aritmetik till avancerad kalkyl',
  },
  languages: {
    title: 'Språk',
    description: 'Lär dig nya språk och förbättra dina färdigheter',
  },
  science: {
    title: 'Vetenskap',
    description: 'Utforska vetenskapliga principer inom olika områden',
  },
  geography: {
    title: 'Geografi',
    description: 'Lär dig om länder, huvudstäder och landskap',
  },
  vehicles: {
    title: 'Fordon',
    description: 'Från bildelar till avancerad fordonsteknik',
  },
  economics: {
    title: 'Ekonomi',
    description: 'Grundläggande ekonomiska koncept och finansiell kunskap',
  },
  history: {
    title: 'Historia',
    description: 'Utforska viktiga historiska händelser och epoker',
  },
};

export default function CategoryPage() {
  const router = useRouter();
  const { categoryId } = router.query;
  const { getFlashcardsByCategory } = useLocalStorage();
  
  // Ensure categoryId is a string
  const category = typeof categoryId === 'string' ? categoryId : '';
  
  // Get info for this category
  const info = categoryInfo[category] || { 
    title: category ? category.charAt(0).toUpperCase() + category.slice(1) : 'Kategori',
    description: 'Utforska flashcards i olika svårighetsgrader' 
  };
  
  // Get total flashcard count for this category
  const totalFlashcards = getFlashcardsByCategory(category).length;

  return (
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
        <h1 className="text-4xl font-bold">{info.title}</h1>
        <p className="text-muted-foreground mt-2">{info.description}</p>
        <p className="text-sm text-muted-foreground mt-1">
          Totalt {totalFlashcards} flashcards i denna kategori
        </p>
      </div>
      
      {/* Show flashcards by difficulty level */}
      {difficultyLevels.map(level => (
        <FlashcardsByLevel
          key={level.id}
          categoryId={category}
          difficulty={level.id as any}
        />
      ))}
    </div>
  );
}