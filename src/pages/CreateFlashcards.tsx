
import React, { useState } from 'react';
import { useLocalStorage } from '@/context/LocalStorageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Flashcard } from '@/components/Flashcard';
import { toast } from '@/components/ui/use-toast';
import { PlusCircle, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const CreateFlashcards = () => {
  const { categories, addFlashcard } = useLocalStorage();
  
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [category, setCategory] = useState('');
  const [difficulty, setDifficulty] = useState<'beginner' | 'intermediate' | 'advanced' | 'expert'>('beginner');
  const [previewMode, setPreviewMode] = useState(false);
  
  const previewFlashcard = {
    id: 'preview',
    question,
    answer,
    category,
    difficulty,
  };

  const handleCreateFlashcard = () => {
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

    if (!category) {
      toast({
        title: "Kategori saknas",
        description: "Du måste välja en kategori för ditt flashcard.",
        variant: "destructive",
      });
      return;
    }

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
                
                <div className="flex space-x-3 pt-4">
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={() => setPreviewMode(!previewMode)}
                  >
                    {previewMode ? 'Avsluta förhandsvisning' : 'Förhandsgranska'}
                  </Button>
                  
                  <Button 
                    type="button"
                    onClick={handleCreateFlashcard}
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Skapa flashcard
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          {previewMode && (question || answer) ? (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold mb-4">Förhandsgranskning</h2>
              <Flashcard 
                flashcard={previewFlashcard}
                showControls={false}
              />
            </div>
          ) : (
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 flex items-center justify-center h-full">
              <div className="text-center text-gray-500">
                <p className="mb-2">Fyll i formuläret och klicka på "Förhandsgranska" för att se hur ditt flashcard kommer att se ut.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateFlashcards;
