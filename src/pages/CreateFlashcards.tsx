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
import { 
  PlusCircle, 
  ChevronLeft, 
  Sparkles, 
  Share2, 
  Copy, 
  ArrowRight, 
  ArrowLeft, 
  Download 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { generateFlashcards, generateShareableLink } from '@/services/groqService';
import { Slider } from '@/components/ui/slider';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';

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
  const [cardCount, setCardCount] = useState(10);
  const [savedFlashcardIds, setSavedFlashcardIds] = useState<string[]>([]);
  const [shareUrl, setShareUrl] = useState('');
  const [shareMode, setShareMode] = useState(false);
  
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

  const handleCreateFlashcard = async () => {
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
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Inloggning krävs",
          description: "Du måste vara inloggad för att spara flashcards.",
          variant: "destructive",
        });
        return;
      }
      
      // First create a flashcard module to store these cards
      const { data: moduleData, error: moduleError } = await supabase.from('flashcard_modules').insert({
        name: topic,
        description: `AI-genererade flashcards om ${topic}`,
        category,
        user_id: user.id
      }).select().single();
      
      if (moduleError) {
        console.error("Error creating module:", moduleError);
        toast({
          title: "Kunde inte skapa modul",
          description: "Ett fel uppstod när vi försökte skapa en modul för dina flashcards.",
          variant: "destructive",
        });
        return;
      }
      
      // Spara det aktuella genererade flashcardet
      const flashcardData = {
        question: generatedFlashcards[currentCardIndex].question,
        answer: generatedFlashcards[currentCardIndex].answer,
        category,
        difficulty,
        module_id: moduleData.id,
        user_id: user.id
      };
      
      // Save to Supabase
      const { data: savedCard, error: saveError } = await supabase
        .from('flashcards')
        .insert(flashcardData)
        .select()
        .single();
        
      if (saveError) {
        console.error("Error saving flashcard:", saveError);
        toast({
          title: "Kunde inte spara flashcard",
          description: "Ett fel uppstod när vi försökte spara ditt flashcard.",
          variant: "destructive",
        });
        return;
      }
      
      // Keep track of saved cards for sharing
      setSavedFlashcardIds(prev => [...prev, savedCard.id]);
      
      // Also save to local storage
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
        // Aktivera share mode när alla kort har sparats
        setShareMode(true);
        toast({
          title: "Alla flashcards sparade",
          description: "Nu kan du dela dina flashcards med andra!",
        });
      }
    } else {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Inloggning krävs",
          description: "Du måste vara inloggad för att spara flashcards.",
          variant: "destructive",
        });
        return;
      }
      
      // Vanlig sparning av ett manuellt skapat flashcard
      const { data: moduleData, error: moduleError } = await supabase.from('flashcard_modules').insert({
        name: "Manuellt skapad flashcard",
        category,
        user_id: user.id
      }).select().single();
      
      if (moduleError) {
        console.error("Error creating module:", moduleError);
        toast({
          title: "Kunde inte skapa modul",
          description: "Ett fel uppstod när vi försökte skapa en modul för ditt flashcard.",
          variant: "destructive",
        });
        return;
      }
      
      const flashcardData = {
        question,
        answer,
        category,
        difficulty,
        module_id: moduleData.id,
        user_id: user.id
      };
      
      // Save to Supabase
      const { data: savedCard, error: saveError } = await supabase
        .from('flashcards')
        .insert(flashcardData)
        .select()
        .single();
        
      if (saveError) {
        console.error("Error saving flashcard:", saveError);
        toast({
          title: "Kunde inte spara flashcard",
          description: "Ett fel uppstod när vi försökte spara ditt flashcard.",
          variant: "destructive",
        });
        return;
      }
      
      // Keep track of saved cards for sharing
      setSavedFlashcardIds(prev => [...prev, savedCard.id]);
      
      // Also save to local storage
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
    setSavedFlashcardIds([]);
    setShareMode(false);
    setShareUrl('');
    
    try {
      const response = await generateFlashcards({
        topic,
        category,
        difficulty,
        count: cardCount,
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

  const handleShareFlashcards = async () => {
    if (savedFlashcardIds.length === 0) {
      toast({
        title: "Inga flashcards att dela",
        description: "Du måste spara minst ett flashcard först.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      const shareableLink = await generateShareableLink(savedFlashcardIds);
      setShareUrl(shareableLink);
      setLoading(false);
      
      if (shareableLink) {
        toast({
          title: "Delbar länk skapad",
          description: "Nu kan du kopiera länken och dela med andra!",
        });
      }
    } catch (error) {
      setLoading(false);
      toast({
        title: "Kunde inte skapa delbar länk",
        description: "Ett fel uppstod. Försök igen senare.",
        variant: "destructive",
      });
    }
  };

  const copyShareLink = () => {
    if (shareUrl) {
      navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Länk kopierad!",
        description: "Länken har kopierats till urklipp.",
      });
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
                      setShareMode(false);
                      setShareUrl('');
                      setSavedFlashcardIds([]);
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
                    
                    <div>
                      <Label htmlFor="cardCount" className="mb-2 block">
                        Antal flashcards: {cardCount}
                      </Label>
                      <Slider
                        id="cardCount"
                        min={5}
                        max={50}
                        step={5}
                        value={[cardCount]}
                        onValueChange={(values) => setCardCount(values[0])}
                      />
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
                    Spara flashcard
                  </Button>
                </div>

                {useAI && generatedFlashcards.length > 0 && (
                  <div className="mt-4 text-sm text-gray-600">
                    <div className="flex items-center justify-between">
                      <div>
                        Kort {currentCardIndex + 1} av {generatedFlashcards.length}
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => setCurrentCardIndex(prev => Math.max(0, prev - 1))}
                          disabled={currentCardIndex === 0}
                        >
                          <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => setCurrentCardIndex(prev => Math.min(generatedFlashcards.length - 1, prev + 1))}
                          disabled={currentCardIndex === generatedFlashcards.length - 1}
                        >
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
                
                {shareMode && savedFlashcardIds.length > 0 && (
                  <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <h3 className="text-lg font-medium mb-2">Dela dina flashcards</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                      Du har skapat {savedFlashcardIds.length} flashcards. Dela dem med dina vänner!
                    </p>
                    
                    {shareUrl ? (
                      <div className="flex flex-col space-y-3">
                        <div className="flex items-center space-x-2">
                          <Input 
                            value={shareUrl} 
                            readOnly 
                            className="flex-1"
                          />
                          <Button variant="outline" size="icon" onClick={copyShareLink}>
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Button 
                        onClick={handleShareFlashcards} 
                        disabled={loading}
                        className="w-full"
                      >
                        <Share2 className="mr-2 h-4 w-4" />
                        Skapa delbar länk
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          {/* Import Flashcards Dialog */}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="mt-4">
                <Download className="mr-2 h-4 w-4" />
                Importera delade flashcards
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Importera delade flashcards</DialogTitle>
              </DialogHeader>
              <ImportSharedFlashcards />
            </DialogContent>
          </Dialog>
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

// Component for importing shared flashcards
const ImportSharedFlashcards = () => {
  const [shareCode, setShareCode] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handleImport = async () => {
    if (!shareCode.trim()) {
      toast({
        title: "Delningskod saknas",
        description: "Du måste ange en delningskod för att importera flashcards.",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    try {
      // Check if user is logged in
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Inloggning krävs",
          description: "Du måste vara inloggad för att importera flashcards.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }
      
      // Call our import function
      const { data, error } = await supabase.functions.invoke('import-shared-flashcards', {
        body: { shareCode }
      });
      
      if (error || !data.success) {
        toast({
          title: "Importen misslyckades",
          description: error?.message || "Kontrollera att koden är korrekt.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Flashcards importerade",
          description: `${data.count} flashcards har lagts till i din samling.`,
        });
        setShareCode('');
      }
    } catch (error) {
      console.error("Import error:", error);
      toast({
        title: "Ett fel uppstod",
        description: "Kunde inte importera flashcards. Försök igen senare.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="space-y-4 pt-2">
      <p className="text-sm text-gray-500">
        Har någon delat flashcards med dig? Ange delningskoden nedan för att importera dem till din samling.
      </p>
      <div className="space-y-2">
        <Label htmlFor="shareCode">Delningskod</Label>
        <Input
          id="shareCode"
          value={shareCode}
          onChange={(e) => setShareCode(e.target.value)}
          placeholder="t.ex. ab12cd34"
        />
      </div>
      <Button onClick={handleImport} disabled={loading} className="w-full">
        {loading ? "Importerar..." : "Importera flashcards"}
      </Button>
    </div>
  );
};

export default CreateFlashcards;
