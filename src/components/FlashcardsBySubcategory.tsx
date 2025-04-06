
// src/components/FlashcardsBySubcategory.tsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useLocalStorage } from '@/context/LocalStorageContext';
import { Flashcard } from '@/components/Flashcard'; 
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Flashcard as FlashcardType } from '@/types/flashcard';

interface FlashcardsBySubcategoryProps {
  categoryId: string;
}

// Helper functions
const getDifficultyLabel = (difficulty: string) => {
  switch (difficulty) {
    case 'beginner': return 'Nybörjare';
    case 'intermediate': return 'Medel';
    case 'advanced': return 'Avancerad';
    case 'expert': return 'Expert';
    default: return difficulty;
  }
};

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'beginner': return 'border-learny-green dark:border-learny-green-dark';
    case 'intermediate': return 'border-learny-blue dark:border-learny-blue-dark';
    case 'advanced': return 'border-learny-purple dark:border-learny-purple-dark';
    case 'expert': return 'border-learny-red dark:border-learny-red-dark';
    default: return 'border-gray-300 dark:border-gray-600';
  }
};

const difficultyOrder = ['beginner', 'intermediate', 'advanced', 'expert'];
const sortedDifficulties = (difficulties: string[]) => difficulties.sort((a, b) => difficultyOrder.indexOf(a) - difficultyOrder.indexOf(b));


export const FlashcardsBySubcategory: React.FC<FlashcardsBySubcategoryProps> = ({ categoryId }) => {
  const { fetchFlashcardsByCategory } = useLocalStorage();
  const [flashcardGroups, setFlashcardGroups] = useState<Record<string, Record<string, FlashcardType[]>>>({});
  const [currentIndices, setCurrentIndices] = useState<Record<string, Record<string, number>>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const dataFetchedRef = useRef(false);

  // Fetch and Group Flashcards - with optimization to prevent excessive fetching
  const loadAndGroupFlashcards = useCallback(async () => {
    // Only fetch if we haven't already or if there was an error
    if (dataFetchedRef.current && Object.keys(flashcardGroups).length > 0 && !error) {
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const allFlashcards = await fetchFlashcardsByCategory(categoryId);
      if (!allFlashcards) throw new Error("Kunde inte hämta flashcards.");
      
      if (allFlashcards.length === 0) {
          // Set empty groups and stop loading if no cards found
          setFlashcardGroups({});
          setCurrentIndices({});
          setIsLoading(false);
          return;
      }

      // Group flashcards by subcategory and difficulty
      const grouped = allFlashcards.reduce((groups, flashcard) => {
        const subcategory = flashcard.subcategory || 'Allmänt';
        const difficulty = flashcard.difficulty;
        if (!groups[subcategory]) groups[subcategory] = {};
        if (!groups[subcategory][difficulty]) groups[subcategory][difficulty] = [];
        groups[subcategory][difficulty].push(flashcard);
        return groups;
      }, {} as Record<string, Record<string, FlashcardType[]>>);

      setFlashcardGroups(grouped);
      
      // Initialize indices for navigation
      const initialIndices: Record<string, Record<string, number>> = {};
      Object.keys(grouped).forEach(sub => {
        initialIndices[sub] = {};
        Object.keys(grouped[sub]).forEach(diff => { initialIndices[sub][diff] = 0; });
      });
      
      setCurrentIndices(initialIndices);
      dataFetchedRef.current = true; // Mark that we've successfully fetched the data
    } catch (err: any) {
        console.error("Error loading flashcards for subcategory view:", err);
        setError(err.message || "Kunde inte ladda flashcards.");
        setFlashcardGroups({});
        setCurrentIndices({});
    } finally {
      setIsLoading(false);
    }
  }, [categoryId, fetchFlashcardsByCategory, error, flashcardGroups]);

  // Initial load
  useEffect(() => {
    loadAndGroupFlashcards();
  }, [loadAndGroupFlashcards]);

  // Reset data fetch flag when category changes
  useEffect(() => {
    dataFetchedRef.current = false;
  }, [categoryId]);

  // Navigation Handlers
  const handlePrevious = (subcategory: string, difficulty: string) => {
    setCurrentIndices(prev => {
      const cardsInGroup = flashcardGroups[subcategory]?.[difficulty] || [];
      if (cardsInGroup.length <= 1) return prev;
      const currentIndex = prev[subcategory]?.[difficulty] || 0;
      return {
        ...prev,
        [subcategory]: {
          ...(prev[subcategory] || {}),
          [difficulty]: currentIndex > 0 ? currentIndex - 1 : cardsInGroup.length - 1
        }
      };
    });
  };

  const handleNext = (subcategory: string, difficulty: string) => {
    setCurrentIndices(prev => {
      const cardsInGroup = flashcardGroups[subcategory]?.[difficulty] || [];
      if (cardsInGroup.length <= 1) return prev;
      const currentIndex = prev[subcategory]?.[difficulty] || 0;
      return {
        ...prev,
        [subcategory]: {
          ...(prev[subcategory] || {}),
          [difficulty]: currentIndex < cardsInGroup.length - 1 ? currentIndex + 1 : 0
        }
      };
    });
  };

  // Sorting subcategories, placing 'Allmänt' first if it exists
  const sortedSubcategories = Object.keys(flashcardGroups).sort((a, b) => {
    if (a === 'Allmänt') return -1;
    if (b === 'Allmänt') return 1;
    return a.localeCompare(b);
  });

  // --- Rendering Logic ---
  if (isLoading) {
      return (
        <Card className="mb-8">
          <CardHeader><CardTitle>Flashcards</CardTitle></CardHeader>
          <CardContent className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <span className="ml-2 text-muted-foreground">Laddar flashcards...</span>
          </CardContent>
        </Card>
      );
  }

  if (error) {
      return (
        <Card className="mb-8 border-l-4 border-destructive">
          <CardHeader><CardTitle>Fel</CardTitle></CardHeader>
          <CardContent>
            <p className="text-destructive">{error}</p>
            <Button variant="outline" onClick={loadAndGroupFlashcards} className="mt-4">Försök igen</Button>
          </CardContent>
        </Card>
      );
  }

  if (Object.keys(flashcardGroups).length === 0) {
      return (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Flashcards</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center py-8 dark:text-gray-400">
              Inga flashcards tillgängliga i denna kategori ännu.
            </p>
          </CardContent>
        </Card>
      );
  }

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Flashcards</CardTitle>
        <CardDescription>
          Utforska flashcards efter ämne och svårighetsnivå
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="multiple" className="w-full" defaultValue={sortedSubcategories}>
          {sortedSubcategories.map(subcategory => (
            Object.keys(flashcardGroups[subcategory] || {}).length > 0 && (
              <AccordionItem key={subcategory} value={subcategory}>
                <AccordionTrigger className="text-lg font-medium">{subcategory}</AccordionTrigger>
                <AccordionContent>
                  {sortedDifficulties(Object.keys(flashcardGroups[subcategory])).map(difficulty => {
                    const cardsInGroup = flashcardGroups[subcategory]?.[difficulty];
                    const currentCardIndex = currentIndices[subcategory]?.[difficulty] || 0;

                    if (!cardsInGroup || cardsInGroup.length === 0) return null;

                    return (
                      <Card key={`${subcategory}-${difficulty}`} className={cn("mb-4 border-l-4", getDifficultyColor(difficulty))}>
                        <CardHeader>
                          <CardTitle className="flex flex-wrap justify-between items-center gap-2">
                            <span>{getDifficultyLabel(difficulty)} ({cardsInGroup.length} kort)</span>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handlePrevious(subcategory, difficulty)}
                                disabled={cardsInGroup.length <= 1}
                                aria-label={`Föregående kort i ${subcategory} - ${difficulty}`}
                              >
                                <ChevronLeft className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handleNext(subcategory, difficulty)}
                                disabled={cardsInGroup.length <= 1}
                                aria-label={`Nästa kort i ${subcategory} - ${difficulty}`}
                              >
                                <ChevronRight className="h-4 w-4" />
                              </Button>
                            </div>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          {(currentCardIndex >= 0 && currentCardIndex < cardsInGroup.length) ? (
                            <Flashcard 
                              flashcard={cardsInGroup[currentCardIndex]}
                              showInteractions={true}
                            />
                          ) : (
                            <p className="text-center text-red-500">Fel: Kunde inte visa flashcard.</p>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </AccordionContent>
              </AccordionItem>
            )
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
};
