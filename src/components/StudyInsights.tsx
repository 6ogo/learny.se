
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, ChevronDown, ChevronUp, BookOpen, BrainCircuit, Award } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { useSubscription } from '@/context/SubscriptionContext';
import { useAuth } from '@/context/AuthContext';
import { Flashcard } from '@/types/flashcard';
import { Program } from '@/types/program';

interface FlashcardWithResponse extends Flashcard {
  userResponse?: boolean;
}

interface StudyInsightsProps {
  program: Program;
  correctCount: number;
  incorrectCount: number;
  flashcards: FlashcardWithResponse[];
  onClose: () => void;
  onRestart: () => void;
}

export const StudyInsights: React.FC<StudyInsightsProps> = ({
  program,
  correctCount,
  incorrectCount,
  flashcards,
  onClose,
  onRestart,
}) => {
  const { currentTier } = useSubscription();
  const { user } = useAuth();
  const [aiHelp, setAiHelp] = useState<string>('');
  const [loadingAi, setLoadingAi] = useState(false);
  
  const totalCards = correctCount + incorrectCount;
  const correctPercent = totalCards > 0 ? Math.round((correctCount / totalCards) * 100) : 0;
  
  const incorrectFlashcards = flashcards.filter(card => card.userResponse === false);
  const correctFlashcards = flashcards.filter(card => card.userResponse === true);
  
  // For PLUS and SUPER tier - Calculate statistics by difficulty level
  const difficultyStats = flashcards.reduce((acc, card) => {
    if (!acc[card.difficulty]) {
      acc[card.difficulty] = { total: 0, correct: 0 };
    }
    
    acc[card.difficulty].total += 1;
    if (card.userResponse) {
      acc[card.difficulty].correct += 1;
    }
    
    return acc;
  }, {} as Record<string, { total: number; correct: number }>);
  
  // For SUPER tier - Generate personalized AI insights
  const generateAiInsights = async () => {
    if (aiHelp || currentTier !== 'super') return;
    
    setLoadingAi(true);
    try {
      // Call the GROQ API through our Supabase Edge Function
      const { data, error } = await fetch('/api/generate-study-insights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          programName: program.name,
          category: program.category,
          correctCount,
          incorrectCount,
          incorrectQuestions: incorrectFlashcards.map(f => f.question),
          difficulty: program.difficulty
        }),
      }).then(res => res.json());
      
      if (error) throw new Error(error);
      setAiHelp(data.insights || "Kunde inte generera insikter just nu. Försök igen senare.");
    } catch (error) {
      console.error('Error generating AI insights:', error);
      setAiHelp("Ett fel uppstod när vi försökte generera insikter. Försök igen senare.");
    } finally {
      setLoadingAi(false);
    }
  };
  
  // Get difficulty label function
  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'Nybörjare';
      case 'intermediate': return 'Medel';
      case 'advanced': return 'Avancerad';
      case 'expert': return 'Expert';
      default: return difficulty;
    }
  };
  
  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Studieresultat</CardTitle>
            <CardDescription>{program.name}</CardDescription>
          </div>
          {currentTier !== 'free' && (
            <Badge variant={currentTier === 'super' ? 'default' : 'outline'} className="capitalize">
              {currentTier === 'super' ? 'Super Learner' : 'Plus'}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Basic stats - Available for all tiers */}
        <div className="space-y-4">
          <h3 className="font-medium text-lg flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Grundläggande resultat
          </h3>
          
          <div className="flex justify-between items-center mb-2">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span>Ditt resultat:</span>
                <span className="font-bold">{correctPercent}%</span>
              </div>
              <Progress value={correctPercent} className="h-2" />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <div className="text-lg font-bold text-green-600 dark:text-green-400">{correctCount}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Rätta svar</div>
            </div>
            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
              <div className="text-lg font-bold text-red-600 dark:text-red-400">{incorrectCount}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Felaktiga svar</div>
            </div>
          </div>
        </div>
        
        {/* FREE tier - Show wrong/correct answer lists */}
        <div>
          <Tabs defaultValue="incorrect">
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="incorrect">
                Felaktiga svar ({incorrectFlashcards.length})
              </TabsTrigger>
              <TabsTrigger value="correct">
                Rätta svar ({correctFlashcards.length})
              </TabsTrigger>
            </TabsList>
            <TabsContent value="incorrect" className="max-h-64 overflow-y-auto mt-4">
              {incorrectFlashcards.length > 0 ? (
                <div className="space-y-3">
                  {incorrectFlashcards.map((card, index) => (
                    <div key={card.id} className="border border-red-200 dark:border-red-900/30 rounded-md p-3 bg-red-50 dark:bg-red-900/10">
                      <p className="font-medium mb-1">Fråga: {card.question}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Rätt svar: {card.answer}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-8">Du hade inga felaktiga svar. Bra jobbat!</p>
              )}
            </TabsContent>
            <TabsContent value="correct" className="max-h-64 overflow-y-auto mt-4">
              {correctFlashcards.length > 0 ? (
                <div className="space-y-3">
                  {correctFlashcards.map((card, index) => (
                    <div key={card.id} className="border border-green-200 dark:border-green-900/30 rounded-md p-3 bg-green-50 dark:bg-green-900/10">
                      <p className="font-medium mb-1">Fråga: {card.question}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Rätt svar: {card.answer}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-8">Du hade inga rätta svar ännu. Fortsätt öva!</p>
              )}
            </TabsContent>
          </Tabs>
        </div>
        
        {/* PLUS tier - Show more detailed performance insights */}
        {(currentTier === 'plus' || currentTier === 'super') && (
          <div className="border-t pt-4 mt-6">
            <h3 className="font-medium text-lg flex items-center gap-2 mb-4">
              <BrainCircuit className="h-5 w-5" />
              Detaljerad analys
            </h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Prestanda per svårighetsgrad
                </h4>
                <div className="space-y-3">
                  {Object.entries(difficultyStats).map(([difficulty, stats]) => {
                    const percent = stats.total > 0 
                      ? Math.round((stats.correct / stats.total) * 100) 
                      : 0;
                    
                    return (
                      <div key={difficulty} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>{getDifficultyLabel(difficulty)}</span>
                          <span>{stats.correct}/{stats.total} ({percent}%)</span>
                        </div>
                        <Progress value={percent} className="h-1.5" />
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Tips för förbättring</h4>
                {incorrectFlashcards.length > 0 ? (
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 dark:text-gray-300">
                    <li>Fokusera på att repetera de {incorrectFlashcards.length} felaktiga svaren</li>
                    <li>Öva extra på svårighetsgraden {program.difficulty}</li>
                    <li>Testa att använda spaced repetition-metoden för bättre inlärning</li>
                  </ul>
                ) : (
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Bra jobbat! Du klarade alla frågor. Fortsätt med nästa svårighetsgrad.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
        
        {/* SUPER tier - Show AI-powered insights */}
        {currentTier === 'super' && (
          <div className="border-t pt-4 mt-6">
            <h3 className="font-medium text-lg flex items-center gap-2 mb-4">
              <Award className="h-5 w-5" />
              AI-assisterad insikt
            </h3>
            
            {!aiHelp && !loadingAi ? (
              <Button
                onClick={generateAiInsights}
                className="w-full"
                variant="outline"
              >
                Generera personliga insikter med AI
              </Button>
            ) : loadingAi ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                <span className="ml-2 text-muted-foreground">Genererar insikter...</span>
              </div>
            ) : (
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg text-sm">
                {aiHelp.split('\n').map((paragraph, i) => (
                  <p key={i} className="mb-2">{paragraph}</p>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button onClick={onClose} variant="outline">Stäng</Button>
        <Button onClick={onRestart}>Börja om</Button>
      </CardFooter>
    </Card>
  );
};
