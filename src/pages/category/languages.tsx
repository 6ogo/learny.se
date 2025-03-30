
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FlashcardsByLevel } from '@/components/FlashcardsByLevel';
import { useLocalStorage } from '@/context/LocalStorageContext';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';

// Custom icon for languages
const LanguagesIcon = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    className="h-6 w-6 text-white"
  >
    <path d="M5 8l6 6" />
    <path d="M4 14h7" />
    <path d="M2 5h12" />
    <path d="M7 2v3" />
    <path d="M22 22l-5-10-5 10" />
    <path d="M14 18h6" />
  </svg>
);

const difficultyLevels = [
  { id: 'beginner', label: 'Nybörjare', color: 'bg-learny-green' },
  { id: 'intermediate', label: 'Medel', color: 'bg-learny-blue' },
  { id: 'advanced', label: 'Avancerad', color: 'bg-learny-purple' },
  { id: 'expert', label: 'Expert', color: 'bg-learny-red' },
];

export default function LanguagesPage() {
  const { getFlashcardsByCategory, getTopicsByCategory } = useLocalStorage();
  
  // Get total flashcard count for languages category
  const totalFlashcards = getFlashcardsByCategory('languages').length;
  
  // Get topics for this category
  const topics = getTopicsByCategory('languages');

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <Link to="/">
            <Button variant="ghost" className="px-0">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Tillbaka till ämnen
            </Button>
          </Link>
        </div>
        
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="rounded-full bg-pink-600 p-2">
              <LanguagesIcon />
            </div>
            <h1 className="text-4xl font-bold">Språk</h1>
          </div>
          <p className="text-muted-foreground mt-2">
            Lär dig nya språk och förbättra dina färdigheter
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Totalt {totalFlashcards} flashcards i denna kategori
          </p>
          
          {/* Show available topics/languages */}
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
        
        {/* Show flashcards by difficulty level */}
        {difficultyLevels.map(level => (
          <FlashcardsByLevel
            key={level.id}
            categoryId="languages"
            difficulty={level.id as any}
          />
        ))}
      </div>
    </Layout>
  );
}
