
import React, { useState } from 'react';
import { useLocalStorage } from '@/context/LocalStorageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Flashcard } from '@/components/Flashcard';
import { toast } from '@/components/ui/use-toast';
import { PlusCircle, ChevronLeft, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { generateFlashcards } from '@/services/groqService';

const CreateFlashcards = () => {
  const { categories, addFlashcard } = useLocalStorage();
  
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [category, setCategory] = useState('');
  const [difficulty, setDifficulty] = useState<'beginner' | 'intermediate' | 'advanced' | 'expert'>('beginner');
  const [previewMode, setPreviewMode] = useState(false);
  const [useAI, setUseAI] = useState(false);
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedFlashcards, setGeneratedFlashcards] = useState<{question: string, answer: string}[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  
  const previewFlashcard = {
    id: 'preview',
    question: useAI && generatedFlashcards.length > 0 
      ? generatedFlashcards[currentCardIndex].question 
      : question,
    answer: useAI && generatedFlashcards.length > 0 
      ? generatedFlashcards[currentCardIndex].answer 
      : answer,
    category,
    difficulty,
  };

  const handleCreateFlashcard = () => {
    if (!useAI) {
      if (!question.trim()) {
        toast({
          title: "Fråga saknas",
          description: "Du måste ange en fråga för ditt flashcard.",
          variant: "destructive",
        });
        return;
      }

      if (!answer.trim()) {
        toast({
          title: "Svar saknas",
          description: "Du måste ange ett svar för ditt flashcard.",
          variant: "destructive",
        });
        return;
      }
    } else if (generatedFlashcards.length === 0) {
      toast({
        title: "Inga genererade flashcards",
        description: "Du måste generera flashcards med AI först.",
        variant: "destructive",
      });
      return;
    }

    if (!category) {
      toast({
        title: "Kategori saknas",
        description: "Du måste välja en kategori för ditt flashcard.",
        variant: "destructive",
      });
      return;
    }

    if (useAI && generatedFlashcards.length > 0) {
      // Spara det aktuella genererade flashcardet
      addFlashcard({
        question: generatedFlashcards[currentCardIndex].question,
        answer: generatedFlashcards[currentCardIndex].answer,
        category,
        difficulty,
      });

      toast({
        title: "Flashcard sparat",
        description: `Flashcard ${currentCardIndex + 1}/${generatedFlashcards.length} har sparats.`,
      });

      // Gå till nästa kort om det finns mer
      if (currentCardIndex < generatedFlashcards.length - 1) {
        setCurrentCardIndex(currentCardIndex + 1);
      } else {
        // Återställ när alla kort är sparade
        setGeneratedFlashcards([]);
        setCurrentCardIndex(0);
        setPreviewMode(false);
      }
    } else {
      // Vanlig sparning av ett manuellt skapat flashcard
      addFlashcard({
        question,
        answer,
        category,
        difficulty,
      });

      // Reset form
      setQuestion('');
      setAnswer('');
      setPreviewMode(false);
      
      toast({
        title: "Flashcard skapat",
        description: "Ditt flashcard har sparats.",
      });
    }
  };

  const handleGenerateFlashcards = async () => {
    if (!topic.trim()) {
      toast({
        title: "Ämne saknas",
        description: "Du måste ange ett ämne för att generera flashcards.",
        variant: "destructive",
      });
      return;
    }

    if (!category) {
      toast({
        title: "Kategori saknas",
        description: "Du måste välja en kategori för dina flashcards.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await generateFlashcards({
        topic,
        category,
        difficulty,
        count: 5, // Generera 5 flashcards som standard
      });

      if (response.flashcards.length > 0) {
        setGeneratedFlashcards(response.flashcards);
        setCurrentCardIndex(0);
        setPreviewMode(true);
        
        toast({
          title: "Flashcards genererade",
          description: `${response.flashcards.length} flashcards har genererats. Spara dem ett i taget.`,
        });
      } else {
        toast({
          title: "Inga flashcards genererades",
          description: "Försök igen med ett annat ämne eller svårighetsnivå.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Fel vid generering",
        description: "Ett oväntat fel uppstod. Försök igen senare.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container px-4 py-8 mx-auto">
      <Link to="/" className="inline-flex items-center text-gray-600 hover:text-learny-purple mb-6">
        <ChevronLeft className="h-5 w-5 mr-1" />
        Tillbaka till startsidan
      </Link>

      <h1 className="text-3xl font-bold mb-6">Skapa flashcards</h1>
      <p className="text-lg text-gray-600 mb-8">
        Skapa dina egna flashcards för att förbättra din inlärning.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="useAI" 
                    checked={useAI} 
                    onCheckedChange={(checked) => {
                      setUseAI(checked === true);
                      setGeneratedFlashcards([]);
                      setCurrentCardIndex(0);
                      if (!checked) setPreviewMode(false);
                    }} 
                  />
                  <Label 
                    htmlFor="useAI" 
                    className="text-base font-medium flex items-center cursor-pointer"
                  >
                    Skapa med AI <Sparkles className="h-4 w-4 text-learny-yellow ml-1" />
                  </Label>
                </div>

                {useAI ? (
                  <>
                    <div>
                      <Label htmlFor="topic">Ämne</Label>
                      <Input
                        id="topic"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        placeholder="T.ex. 'Medicinska termer', 'JavaScript', 'Kemi'"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="category">Kategori</Label>
                      <Select value={category} onValueChange={setCategory}>
                        <SelectTrigger>
                          <SelectValue placeholder="Välj kategori" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="difficulty">Svårighetsnivå</Label>
                      <Select 
                        value={difficulty} 
                        onValueChange={(value) => setDifficulty(value as 'beginner' | 'intermediate' | 'advanced' | 'expert')}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Välj svårighetsnivå" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="beginner">Nybörjare</SelectItem>
                          <SelectItem value="intermediate">Medel</SelectItem>
                          <SelectItem value="advanced">Avancerad</SelectItem>
                          <SelectItem value="expert">Expert</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="pt-4">
                      <Button 
                        type="button"
                        onClick={handleGenerateFlashcards}
                        disabled={loading}
                        className="w-full"
                      >
                        <Sparkles className="mr-2 h-4 w-4" />
                        {loading ? 'Genererar...' : 'Generera flashcards med AI'}
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <Label htmlFor="question">Fråga</Label>
                      <Textarea
                        id="question"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        placeholder="Skriv din fråga här..."
                        className="resize-none"
                        rows={3}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="answer">Svar</Label>
                      <Textarea
                        id="answer"
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        placeholder="Skriv ditt svar här..."
                        className="resize-none"
                        rows={5}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="category">Kategori</Label>
                      <Select value={category} onValueChange={setCategory}>
                        <SelectTrigger>
                          <SelectValue placeholder="Välj kategori" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="difficulty">Svårighetsnivå</Label>
                      <Select 
                        value={difficulty} 
                        onValueChange={(value) => setDifficulty(value as 'beginner' | 'intermediate' | 'advanced' | 'expert')}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Välj svårighetsnivå" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="beginner">Nybörjare</SelectItem>
                          <SelectItem value="intermediate">Medel</SelectItem>
                          <SelectItem value="advanced">Avancerad</SelectItem>
                          <SelectItem value="expert">Expert</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}
                
                <div className="flex space-x-3 pt-4">
                  {!useAI && (
                    <Button 
                      type="button"
                      variant="outline"
                      onClick={() => setPreviewMode(!previewMode)}
                    >
                      {previewMode ? 'Avsluta förhandsvisning' : 'Förhandsgranska'}
                    </Button>
                  )}
                  
                  <Button 
                    type="button"
                    onClick={handleCreateFlashcard}
                    disabled={loading && useAI}
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Skapa flashcard
                  </Button>
                </div>

                {useAI && generatedFlashcards.length > 0 && (
                  <div className="mt-4 text-sm text-gray-600">
                    Kort {currentCardIndex + 1} av {generatedFlashcards.length}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          {previewMode && ((question || answer) || (useAI && generatedFlashcards.length > 0)) ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
              <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Förhandsgranskning</h2>
              <Flashcard 
                flashcard={previewFlashcard}
                showControls={false}
              />
            </div>
          ) : (
            <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-700 flex items-center justify-center h-full">
              <div className="text-center text-gray-500 dark:text-gray-400">
                <p className="mb-2">
                  {useAI 
                    ? "Ange ämne, kategori och svårighetsnivå och klicka på 'Generera flashcards med AI'"
                    : "Fyll i formuläret och klicka på 'Förhandsgranska' för att se hur ditt flashcard kommer att se ut."
                  }
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateFlashcards;
