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
  
  // Get all flashcards for this category
  const flashcards = getFlashcardsByCategory(categoryId);
  
  // Function to identify subcategories (based on flashcard ID prefixes or other logic)
  const identifySubcategory = (flashcard: FlashcardType): string => {
    // This is a simple example - you may need to adjust based on your actual data structure
    // Looking at program names like "JavaScript Grunder", "Python Grundkurs", "Algebra Grunder"
    // We can extract subcategories like JavaScript, Python, Algebra
    
    const id = flashcard.id;
    
    // Check for common prefixes in your flashcard IDs
    if (id.startsWith('js_') || id.startsWith('code')) return 'JavaScript';
    if (id.startsWith('py') || id.startsWith('py_')) return 'Python';
    if (id.startsWith('html_')) return 'HTML';
    if (id.startsWith('css_')) return 'CSS';
    
    if (id.startsWith('math_alg_')) return 'Algebra';
    if (id.startsWith('math_geo_')) return 'Geometri';
    if (id.startsWith('math_arith_')) return 'Aritmetik';
    if (id.startsWith('math_calc_')) return 'Kalkyl';
    if (id.startsWith('math_linalg_')) return 'Linjär Algebra';
    if (id.startsWith('math_disc_')) return 'Diskret Matematik';
    if (id.startsWith('math_prob_')) return 'Sannolikhet';
    if (id.startsWith('calc')) return 'Kalkyl';
    if (id.startsWith('math')) return 'Grundläggande Matematik';
    
    if (id.startsWith('med_') || id.startsWith('med-')) return 'Medicinska Termer';
    
    if (id.startsWith('swe_')) return 'Svenska';
    if (id.startsWith('eng_')) return 'Engelska';
    
    if (id.startsWith('sci_bio_')) return 'Biologi';
    if (id.startsWith('sci_chem_')) return 'Kemi';
    if (id.startsWith('sci_phy_')) return 'Fysik';
    if (id.startsWith('phys')) return 'Fysik';
    if (id.startsWith('chem')) return 'Kemi';
    if (id.startsWith('bio')) return 'Biologi';
    if (id.startsWith('sci')) return 'Allmän Vetenskap';
    
    if (id.startsWith('geo_')) return 'Allmän Geografi';
    if (id.startsWith('geo')) return 'Allmän Geografi';
    
    if (id.startsWith('car_')) return 'Bilar';
    if (id.startsWith('boat_')) return 'Båtar';
    if (id.startsWith('plane_')) return 'Flygplan';
    if (id.startsWith('veh')) return 'Fordon';
    
    if (id.startsWith('econ_')) return 'Ekonomi';
    if (id.startsWith('econ')) return 'Ekonomi';
    
    if (id.startsWith('hist_')) return 'Historia';
    if (id.startsWith('hist')) return 'Historia';
    
    // Default subcategory if no match
    return 'Allmänt';
  };
  
  // Group flashcards by subcategory and difficulty
  const flashcardGroups = flashcards.reduce((groups, flashcard) => {
    const subcategory = identifySubcategory(flashcard);
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
  
  // Initialize currentIndices
  useEffect(() => {
    const initialIndices: Record<string, Record<string, number>> = {};
    Object.keys(flashcardGroups).forEach(subcategory => {
      initialIndices[subcategory] = {};
      Object.keys(flashcardGroups[subcategory]).forEach(difficulty => {
        initialIndices[subcategory][difficulty] = 0;
      });
    });
    setCurrentIndices(initialIndices);
  }, [flashcardGroups]);
  
  const handlePrevious = (subcategory: string, difficulty: string) => {
    setCurrentIndices(prev => {
      const currentIndex = prev[subcategory]?.[difficulty] || 0;
      const cardsInGroup = flashcardGroups[subcategory][difficulty].length;
      
      return {
        ...prev,
        [subcategory]: {
          ...prev[subcategory],
          [difficulty]: currentIndex > 0 ? currentIndex - 1 : cardsInGroup - 1
        }
      };
    });
  };
  
  const handleNext = (subcategory: string, difficulty: string) => {
    setCurrentIndices(prev => {
      const currentIndex = prev[subcategory]?.[difficulty] || 0;
      const cardsInGroup = flashcardGroups[subcategory][difficulty].length;
      
      return {
        ...prev,
        [subcategory]: {
          ...prev[subcategory],
          [difficulty]: currentIndex < cardsInGroup - 1 ? currentIndex + 1 : 0
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
      default: return difficulty;
    }
  };
  
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'border-learny-green dark:border-learny-green-dark';
      case 'intermediate': return 'border-learny-blue dark:border-learny-blue-dark';
      case 'advanced': return 'border-learny-purple dark:border-learny-purple-dark';
      case 'expert': return 'border-learny-red dark:border-learny-red-dark';
      default: return '';
    }
  };
  
  // Sort difficulties in a logical order
  const difficultyOrder = ['beginner', 'intermediate', 'advanced', 'expert'];
  const sortedDifficulties = (difficulties: string[]) => {
    return difficulties.sort((a, b) => difficultyOrder.indexOf(a) - difficultyOrder.indexOf(b));
  };

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
          {Object.keys(flashcardGroups).sort().map(subcategory => (
            <AccordionItem key={subcategory} value={subcategory}>
              <AccordionTrigger className="text-lg font-medium">{subcategory}</AccordionTrigger>
              <AccordionContent>
                {sortedDifficulties(Object.keys(flashcardGroups[subcategory])).map(difficulty => {
                  const cardsInGroup = flashcardGroups[subcategory][difficulty];
                  const currentCardIndex = currentIndices[subcategory]?.[difficulty] || 0;
                  
                  return (
                    <Card key={difficulty} className={cn("mb-4 border-l-4", getDifficultyColor(difficulty))}>
                      <CardHeader>
                        <CardTitle className="flex justify-between items-center">
                          <span>{getDifficultyLabel(difficulty)} ({cardsInGroup.length} kort)</span>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="icon" 
                              onClick={() => handlePrevious(subcategory, difficulty)}
                              disabled={cardsInGroup.length <= 1}
                            >
                              <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="icon" 
                              onClick={() => handleNext(subcategory, difficulty)}
                              disabled={cardsInGroup.length <= 1}
                            >
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {cardsInGroup.length > 0 && (
                          <Flashcard 
                            flashcard={cardsInGroup[currentCardIndex]} 
                            showControls={true}
                          />
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
};