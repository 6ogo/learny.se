// src/components/AIFlashcardGenerator.tsx
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { generateFlashcards, AIFlashcardRequest, AIFlashcardResponse } from '@/services/groqService';
import { useLocalStorage } from '@/context/LocalStorageContext';
import { BrainCircuit, Sparkles, Loader2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useNavigate } from 'react-router-dom';

interface AIFlashcardGeneratorProps {}

export const AIFlashcardGenerator: React.FC<AIFlashcardGeneratorProps> = () => {
  const { user } = useAuth();
  const { categories } = useLocalStorage();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [topic, setTopic] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [difficulty, setDifficulty] = useState<'beginner' | 'intermediate' | 'advanced' | 'expert'>('intermediate');
  const [count, setCount] = useState(10);
  const [context, setContext] = useState(''); 
  const [language, setLanguage] = useState('swedish');

  React.useEffect(() => {
    let progressInterval: NodeJS.Timeout;
    
    if (isGenerating) {
      setGenerationProgress(10);
      
      progressInterval = setInterval(() => {
        setGenerationProgress(prev => {
          if (prev < 40) return prev + 5;
          if (prev < 70) return prev + 2;
          if (prev < 90) return prev + 0.5;
          return prev;
        });
      }, 600);
    } else {
      setGenerationProgress(0);
    }

    return () => {
      if (progressInterval) clearInterval(progressInterval);
    };
  }, [isGenerating]);

  const handleGenerate = async () => {
    if (!topic) {
      toast({
        title: "Ämne saknas", 
        description: "Vänligen ange ett ämne."
      });
      return;
    }
    if (!selectedCategory) {
      toast({
        title: "Kategori saknas", 
        description: "Vänligen välj en kategori."
      });
      return;
    }

    setIsGenerating(true);
    try {
      const request: AIFlashcardRequest = {
        topic: topic,
        category: selectedCategory, 
        difficulty: difficulty,
        count: count,
        context: context,
        language: language
      };
      
      console.log("Starting flashcard generation with:", request);
      const response: AIFlashcardResponse = await generateFlashcards(request);

      setGenerationProgress(100);

      if (response.saved) {
        console.log("AI Flashcards generated and saved successfully.");
        setTopic('');
        setContext('');
        
        setTimeout(() => {
          navigate('/my-modules');
        }, 1500);
      } else if (response.flashcards?.length > 0 && !response.error) {
        console.log("AI Flashcards generated but not saved.");
      } else {
        console.log("AI Flashcard generation failed or returned empty.");
      }

    } catch (error) {
      console.error('Error in handleGenerate:', error);
      toast({ 
        title: "Oväntat fel", 
        description: "Kunde inte starta AI-generering.", 
        variant: "destructive" 
      });
    } finally {
      setTimeout(() => {
        setIsGenerating(false);
      }, 1000);
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
             <Label htmlFor="topic-ai">Ämne</Label>
             <Input
               id="topic-ai"
               placeholder="T.ex. 'Fotosyntesens ljusberoende reaktioner'"
               value={topic}
               onChange={(e) => setTopic(e.target.value)}
             />
           </div>
           
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

           <div className="grid gap-2">
             <Label htmlFor="language-ai">Språk</Label>
             <Select value={language} onValueChange={setLanguage}>
               <SelectTrigger id="language-ai">
                 <SelectValue placeholder="Välj språk" />
               </SelectTrigger>
               <SelectContent>
                 <SelectItem value="swedish">Svenska</SelectItem>
                 <SelectItem value="english">Engelska</SelectItem>
                 <SelectItem value="norwegian">Norska</SelectItem>
                 <SelectItem value="danish">Danska</SelectItem>
                 <SelectItem value="finnish">Finska</SelectItem>
                 <SelectItem value="german">Tyska</SelectItem>
                 <SelectItem value="french">Franska</SelectItem>
                 <SelectItem value="spanish">Spanska</SelectItem>
               </SelectContent>
             </Select>
           </div>

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

           {isGenerating && (
             <div className="space-y-2">
               <div className="flex justify-between text-xs text-muted-foreground">
                 <span>Genererar flashcards...</span>
                 <span>{Math.round(generationProgress)}%</span>
               </div>
               <Progress value={generationProgress} className="h-2" />
               <p className="text-xs text-muted-foreground italic mt-1">
                 {generationProgress < 40 ? 'Förbereder modellen...' : 
                  generationProgress < 70 ? 'Skapar flashcards...' : 
                  generationProgress < 90 ? 'Sparar innehållet...' : 
                  'Slutför generering...'}
               </p>
             </div>
           )}

           <div className="text-sm text-muted-foreground mt-2">
             <p>För utvecklare: Se hur du kan använda <a href="#" className="text-blue-600 hover:underline" onClick={(e) => {
               e.preventDefault();
               toast({
                 title: "API Integration",
                 description: "För att integrera med GROQ API: https://console.groq.com/docs/quickstart",
                 duration: 8000,
               });
             }}>GROQ API</a> direkt för att generera flashcards.</p>
           </div>

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
