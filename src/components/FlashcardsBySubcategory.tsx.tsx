// src/components/FlashcardsBySubcategory.tsx
import React, { useState, useEffect } from 'react';
import { useLocalStorage } from '@/context/LocalStorageContext';
import { Flashcard } from '@/components/Flashcard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Flashcard as FlashcardType } from '@/types/flashcard';

interface FlashcardsBySubcategoryProps {
  categoryId: string;
}

export const FlashcardsBySubcategory: React.FC<FlashcardsBySubcategoryProps> = ({ categoryId }) => {
  const { getFlashcardsByCategory } = useLocalStorage();
  const [currentIndices, setCurrentIndices] = useState<Record<string, Record<string, number>>>({});
  const [flashcardGroups, setFlashcardGroups] = useState<Record<string, Record<string, FlashcardType[]>>>({});

  // Get all flashcards for this category and group them
  useEffect(() => {
    const allFlashcards = getFlashcardsByCategory(categoryId);

    const grouped = allFlashcards.reduce((groups, flashcard) => {
      // Use the explicit subcategory, fallback to 'Allmänt' if undefined/missing
      const subcategory = flashcard.subcategory || 'Allmänt';
      const difficulty = flashcard.difficulty;

      if (!groups[subcategory]) {
        groups[subcategory] = {};
      }

      if (!groups[subcategory][difficulty]) {
        groups[subcategory][difficulty] = [];
      }

      groups[subcategory][difficulty].push(flashcard);
      return groups;
    }, {} as Record<string, Record<string, FlashcardType[]>>);

    setFlashcardGroups(grouped);

    // Initialize currentIndices based on the new groups
    const initialIndices: Record<string, Record<string, number>> = {};
    Object.keys(grouped).forEach(subcategory => {
      initialIndices[subcategory] = {};
      Object.keys(grouped[subcategory]).forEach(difficulty => {
        initialIndices[subcategory][difficulty] = 0;
      });
    });
    setCurrentIndices(initialIndices);

  }, [categoryId, getFlashcardsByCategory]); // Re-run if categoryId changes

  const handlePrevious = (subcategory: string, difficulty: string) => {
    setCurrentIndices(prev => {
      const cardsInGroup = flashcardGroups[subcategory]?.[difficulty] || []; // Safety check
      if (cardsInGroup.length === 0) return prev; // Avoid errors if group somehow becomes empty
      const currentIndex = prev[subcategory]?.[difficulty] || 0;
      return {
        ...prev,
        [subcategory]: {
          ...(prev[subcategory] || {}), // Ensure subcategory exists
          [difficulty]: currentIndex > 0 ? currentIndex - 1 : cardsInGroup.length - 1
        }
      };
    });
  };

  const handleNext = (subcategory: string, difficulty: string) => {
    setCurrentIndices(prev => {
      const cardsInGroup = flashcardGroups[subcategory]?.[difficulty] || []; // Safety check
      if (cardsInGroup.length === 0) return prev; // Avoid errors if group somehow becomes empty
      const currentIndex = prev[subcategory]?.[difficulty] || 0;
      return {
        ...prev,
        [subcategory]: {
          ...(prev[subcategory] || {}), // Ensure subcategory exists
          [difficulty]: currentIndex < cardsInGroup.length - 1 ? currentIndex + 1 : 0
        }
      };
    });
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'Nybörjare';
      case 'intermediate': return 'Medel';
      case 'advanced': return 'Avancerad';
      case 'expert': return 'Expert';
      default: return difficulty; // Fallback
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'border-learny-green dark:border-learny-green-dark';
      case 'intermediate': return 'border-learny-blue dark:border-learny-blue-dark';
      case 'advanced': return 'border-learny-purple dark:border-learny-purple-dark';
      case 'expert': return 'border-learny-red dark:border-learny-red-dark';
      default: return 'border-gray-300 dark:border-gray-600'; // Fallback border color
    }
  };

  // Sort difficulties in a logical order
  const difficultyOrder = ['beginner', 'intermediate', 'advanced', 'expert'];
  const sortedDifficulties = (difficulties: string[]) => {
    return difficulties.sort((a, b) => difficultyOrder.indexOf(a) - difficultyOrder.indexOf(b));
  };

  // Sort subcategories alphabetically for display
  const sortedSubcategories = Object.keys(flashcardGroups).sort((a, b) => {
      // Optional: Keep 'Allmänt' first or last if desired
      if (a === 'Allmänt') return -1;
      if (b === 'Allmänt') return 1;
      return a.localeCompare(b);
  });


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
        <Accordion type="multiple" className="w-full">
          {/* Iterate over sorted subcategories */}
          {sortedSubcategories.map(subcategory => (
            // Check if the subcategory actually has any flashcards before rendering the AccordionItem
            Object.keys(flashcardGroups[subcategory]).length > 0 && (
              <AccordionItem key={subcategory} value={subcategory}>
                <AccordionTrigger className="text-lg font-medium">{subcategory}</AccordionTrigger>
                <AccordionContent>
                  {/* Iterate over sorted difficulties for the current subcategory */}
                  {sortedDifficulties(Object.keys(flashcardGroups[subcategory])).map(difficulty => {
                    const cardsInGroup = flashcardGroups[subcategory]?.[difficulty];
                    const currentCardIndex = currentIndices[subcategory]?.[difficulty] || 0;

                    // Ensure cardsInGroup exists and has items before rendering the Card
                    if (!cardsInGroup || cardsInGroup.length === 0) return null;

                    return (
                      <Card key={`${subcategory}-${difficulty}`} className={cn("mb-4 border-l-4", getDifficultyColor(difficulty))}>
                        <CardHeader>
                          <CardTitle className="flex justify-between items-center">
                            <span>{getDifficultyLabel(difficulty)} ({cardsInGroup.length} kort)</span>
                            {/* Navigation Buttons */}
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handlePrevious(subcategory, difficulty)}
                                disabled={cardsInGroup.length <= 1}
                                aria-label={`Previous card in ${subcategory} - ${difficulty}`}
                              >
                                <ChevronLeft className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handleNext(subcategory, difficulty)}
                                disabled={cardsInGroup.length <= 1}
                                aria-label={`Next card in ${subcategory} - ${difficulty}`}
                              >
                                <ChevronRight className="h-4 w-4" />
                              </Button>
                            </div>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          {/* Check if the current index is valid before accessing */}
                          {(currentCardIndex >= 0 && currentCardIndex < cardsInGroup.length) && (
                            <Flashcard
                              flashcard={cardsInGroup[currentCardIndex]}
                              showControls={true} // Show controls for individual flashcards here
                            />
                          )}
                          {/* Optional: Handle case where index might be out of bounds */}
                           {!(currentCardIndex >= 0 && currentCardIndex < cardsInGroup.length) && (
                              <p className="text-center text-red-500">Error: Could not display flashcard.</p>
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