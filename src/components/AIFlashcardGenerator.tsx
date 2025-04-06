
// src/components/AIFlashcardGenerator.tsx
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea'; // Added Textarea import
import { useToast } from '@/hooks/use-toast';
import { generateFlashcards, AIFlashcardRequest, AIFlashcardResponse } from '@/services/groqService';
import { useLocalStorage } from '@/context/LocalStorageContext';
import { BrainCircuit, Sparkles, Loader2 } from 'lucide-react';

interface AIFlashcardGeneratorProps {} // Keep interface if needed for future props

export const AIFlashcardGenerator: React.FC<AIFlashcardGeneratorProps> = () => {
  const { user } = useAuth();
  const { categories } = useLocalStorage();
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [topic, setTopic] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [difficulty, setDifficulty] = useState<'beginner' | 'intermediate' | 'advanced' | 'expert'>('intermediate');
  const [count, setCount] = useState(10);
  const [context, setContext] = useState(''); // Added context state

  const handleGenerate = async () => {
    if (!topic) {
      toast({ title: "Ämne saknas", description: "Vänligen ange ett ämne.", variant: "destructive" });
      return;
    }
    if (!selectedCategory) {
      toast({ title: "Kategori saknas", description: "Vänligen välj en kategori.", variant: "destructive" });
      return;
    }

    setIsGenerating(true);
    try {
      // Corrected: Use explicit property assignment
      const request: AIFlashcardRequest = {
        topic: topic, // Assign value of topic state
        category: selectedCategory, // Assign value of selectedCategory state
        difficulty: difficulty, // Assign value of difficulty state
        count: count, // Assign value of count state
        context: context // Add additional context if provided
      };

      const response: AIFlashcardResponse = await generateFlashcards(request);

      if (response.saved) {
        console.log("AI Flashcards generated and saved successfully.");
        setTopic(''); // Reset topic on success
        setContext(''); // Reset context on success
      } else if (response.flashcards?.length > 0 && !response.error) {
        console.log("AI Flashcards generated but not saved.");
      } else {
        console.log("AI Flashcard generation failed or returned empty.");
      }

    } catch (error) {
      console.error('Error in handleGenerate:', error);
      toast({ title: "Oväntat fel", description: "Kunde inte starta AI-generering.", variant: "destructive" });
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
           {/* Topic Input */}
           <div className="grid gap-2">
             <Label htmlFor="topic-ai">Ämne</Label>
             <Input
               id="topic-ai"
               placeholder="T.ex. 'Fotosyntesens ljusberoende reaktioner'"
               value={topic}
               onChange={(e) => setTopic(e.target.value)}
             />
           </div>
           
           {/* Context Input - New */}
           <div className="grid gap-2">
             <Label htmlFor="context-ai">Ytterligare kontext (valfritt)</Label>
             <Textarea
               id="context-ai"
               placeholder="Lägg till mer detaljerad kontext eller exempeltext (max 1000 tecken)"
               value={context}
               onChange={(e) => setContext(e.target.value)}
               maxLength={1000}
               className="min-h-[100px] resize-y"
             />
             <div className="text-xs text-muted-foreground text-right">
               {context.length}/1000 tecken
             </div>
           </div>

           {/* Category Select */}
           <div className="grid gap-2">
             <Label htmlFor="category-ai">Kategori</Label>
             <Select value={selectedCategory} onValueChange={setSelectedCategory}>
               <SelectTrigger id="category-ai">
                 <SelectValue placeholder="Välj kategori" />
               </SelectTrigger>
               <SelectContent>
                 {categories.map((category) => (
                   <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                 ))}
               </SelectContent>
             </Select>
           </div>

           {/* Difficulty Select */}
           <div className="grid gap-2">
             <Label htmlFor="difficulty-ai">Svårighetsgrad</Label>
             <Select value={difficulty} onValueChange={(val) => setDifficulty(val as any)}>
               <SelectTrigger id="difficulty-ai"><SelectValue /></SelectTrigger>
               <SelectContent>
                 <SelectItem value="beginner">Nybörjare</SelectItem>
                 <SelectItem value="intermediate">Mellan</SelectItem>
                 <SelectItem value="advanced">Avancerad</SelectItem>
                 <SelectItem value="expert">Expert</SelectItem>
               </SelectContent>
             </Select>
           </div>

           {/* Count Slider */}
           <div className="grid gap-2">
              <Label htmlFor="count-slider-ai">Antal flashcards ({count})</Label>
              <Slider
                id="count-slider-ai"
                value={[count]}
                min={5}
                max={25}
                step={5}
                onValueChange={(vals) => setCount(vals[0])}
                className="py-4"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>5</span>
                <span>15</span>
                <span>25</span>
              </div>
           </div>

           {/* Generate Button */}
           <Button
             onClick={handleGenerate}
             className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
             disabled={isGenerating || !topic || !selectedCategory}
           >
             {isGenerating ? (
               <> <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Genererar... </>
             ) : (
               <> <Sparkles className="h-4 w-4 mr-2" /> Generera Flashcards </>
             )}
           </Button>
         </div>
       </CardContent>
     </Card>
  );
};
