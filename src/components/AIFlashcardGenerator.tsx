
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { toast } from '@/components/ui/use-toast';
import { generateFlashcards, AIFlashcardRequest } from '@/services/groqService';
import { useLocalStorage } from '@/context/LocalStorageContext';
import { Flashcard } from '@/types/flashcard';
import { BrainCircuit, Sparkles, Loader2 } from 'lucide-react';

interface AIFlashcardGeneratorProps {
  onFlashcardsGenerated?: (flashcards: Flashcard[]) => void;
}

export const AIFlashcardGenerator: React.FC<AIFlashcardGeneratorProps> = ({ onFlashcardsGenerated }) => {
  const { user } = useAuth();
  const { categories } = useLocalStorage();
  const [isGenerating, setIsGenerating] = useState(false);
  const [topic, setTopic] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [difficulty, setDifficulty] = useState<'beginner' | 'intermediate' | 'advanced' | 'expert'>('intermediate');
  const [count, setCount] = useState(10);

  const handleGenerate = async () => {
    if (!topic) {
      toast({
        title: "Ämne saknas",
        description: "Vänligen ange ett ämne för dina flashcards",
        variant: "destructive",
      });
      return;
    }

    if (!selectedCategory) {
      toast({
        title: "Kategori saknas",
        description: "Vänligen välj en kategori för dina flashcards",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsGenerating(true);
      
      const request: AIFlashcardRequest = {
        topic,
        category: selectedCategory,
        difficulty,
        count,
      };
      
      const response = await generateFlashcards(request);
      
      if (response.flashcards?.length > 0 && onFlashcardsGenerated) {
        const generatedFlashcards: Flashcard[] = response.flashcards.map(fc => ({
          id: Math.random().toString(36).substring(2, 9), // Temporary ID for local storage
          question: fc.question,
          answer: fc.answer,
          category: selectedCategory,
          difficulty: difficulty,
        }));
        
        onFlashcardsGenerated(generatedFlashcards);
      }
    } catch (error) {
      console.error('Error generating flashcards:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const getDifficultyLabel = (level: string) => {
    switch (level) {
      case 'beginner': return 'Nybörjare';
      case 'intermediate': return 'Mellan';
      case 'advanced': return 'Avancerad';
      case 'expert': return 'Expert';
      default: return level;
    }
  };

  return (
    <Card className="relative overflow-hidden">
      <div className="absolute top-0 right-0 p-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs font-semibold px-3 py-1 rounded-bl-lg">
        Super Learner
      </div>
      
      <CardHeader>
        <CardTitle className="flex items-center">
          <BrainCircuit className="h-5 w-5 mr-2 text-learny-purple" />
          AI Flashcard Generator
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="topic">Ämne</Label>
            <Input
              id="topic"
              placeholder="T.ex. 'Svenska revolutionen' eller 'Respiratoriska systemet'"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="category">Kategori</Label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger id="category">
                <SelectValue placeholder="Välj kategori" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <Label>Svårighetsgrad</Label>
            <Select value={difficulty} onValueChange={(val) => setDifficulty(val as any)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Nybörjare</SelectItem>
                <SelectItem value="intermediate">Mellan</SelectItem>
                <SelectItem value="advanced">Avancerad</SelectItem>
                <SelectItem value="expert">Expert</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <div className="flex justify-between">
              <Label>Antal flashcards ({count})</Label>
            </div>
            <Slider
              value={[count]}
              min={5}
              max={50}
              step={5}
              onValueChange={(vals) => setCount(vals[0])}
              className="py-4"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>5</span>
              <span>25</span>
              <span>50</span>
            </div>
          </div>
          
          <Button 
            onClick={handleGenerate}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
            disabled={isGenerating || !topic || !selectedCategory}
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Genererar...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Generera Flashcards
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
