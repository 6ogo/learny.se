import React, { useState, useEffect } from 'react';
import { useLocalStorage } from '@/context/LocalStorageContext';
import { Flashcard } from '@/components/Flashcard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FlashcardsByLevelProps {
  categoryId: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

export const FlashcardsByLevel: React.FC<FlashcardsByLevelProps> = ({ categoryId, difficulty }) => {
  const { getFlashcardsByCategory } = useLocalStorage();
  const [currentTopic, setCurrentTopic] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Get flashcards for this category and difficulty
  const flashcards = getFlashcardsByCategory(categoryId).filter(card => card.difficulty === difficulty);
  
  // Group flashcards by topic (extracted from question)
  const flashcardsByTopic = React.useMemo(() => {
    const grouped: Record<string, typeof flashcards> = {};
    
    flashcards.forEach(card => {
      // Extract topic from question (format: "[Topic] Question")
      const match = card.question.match(/^\[([^\]]+)\]/);
      const topic = match ? match[1] : 'Övrigt'; // Default to 'Other' if no topic found
      
      if (!grouped[topic]) {
        grouped[topic] = [];
      }
      grouped[topic].push(card);
    });
    
    return grouped;
  }, [flashcards]);
  
  // Get all topics
  const topics = React.useMemo(() => Object.keys(flashcardsByTopic), [flashcardsByTopic]);
  
  // Set initial topic if none selected
  useEffect(() => {
    if (topics.length > 0 && !currentTopic) {
      setCurrentTopic(topics[0]);
      setCurrentIndex(0);
    }
  }, [topics, currentTopic]);
  
  if (flashcards.length === 0) {
    return null;
  }

  // Get current topic's flashcards
  const currentTopicFlashcards = currentTopic ? flashcardsByTopic[currentTopic] || [] : [];

  const getDifficultyLabel = () => {
    switch (difficulty) {
      case 'beginner': return 'Nybörjare';
      case 'intermediate': return 'Medel';
      case 'advanced': return 'Avancerad';
      case 'expert': return 'Expert';
    }
  };
  
  const getDifficultyColor = () => {
    switch (difficulty) {
      case 'beginner': return 'border-learny-green dark:border-learny-green-dark';
      case 'intermediate': return 'border-learny-blue dark:border-learny-blue-dark';
      case 'advanced': return 'border-learny-purple dark:border-learny-purple-dark';
      case 'expert': return 'border-learny-red dark:border-learny-red-dark';
    }
  };

  const handlePrevious = () => {
    setCurrentIndex(prev => (prev > 0 ? prev - 1 : currentTopicFlashcards.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex(prev => (prev < currentTopicFlashcards.length - 1 ? prev + 1 : 0));
  };

  const handleChangeTopic = (topic: string) => {
    setCurrentTopic(topic);
    setCurrentIndex(0);
  };

  return (
    <Card className={cn("mb-8 border-l-4", getDifficultyColor())}>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>{getDifficultyLabel()} ({flashcards.length} kort)</span>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={handlePrevious}
              disabled={currentTopicFlashcards.length <= 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={handleNext}
              disabled={currentTopicFlashcards.length <= 1}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Topic Selection */}
        {topics.length > 1 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {topics.map(topic => (
              <Button 
                key={topic}
                variant={currentTopic === topic ? "default" : "outline"}
                size="sm"
                onClick={() => handleChangeTopic(topic)}
              >
                {topic}
              </Button>
            ))}
          </div>
        )}
        
        {/* Current Flashcard */}
        {currentTopic && currentTopicFlashcards.length > 0 && (
          <Flashcard 
            flashcard={{
              ...currentTopicFlashcards[currentIndex],
              // Remove topic prefix from displayed question
              question: currentTopicFlashcards[currentIndex].question.replace(/^\[[^\]]+\]\s*/, '')
            }} 
          />
        )}
      </CardContent>
    </Card>
  );
};