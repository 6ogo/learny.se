
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from '@/components/ui/select';
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter 
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Upload, Eye, Save, X, Check } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Flashcard } from '@/types/flashcard';
import { useAuth } from '@/context/AuthContext';
import { useLocalStorage } from '@/context/LocalStorageContext';

export const FlashcardCreation: React.FC = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { categories } = useLocalStorage();
  const [batchFlashcards, setBatchFlashcards] = useState<Array<{
    question: string;
    answer: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  }>>([{ question: '', answer: '', difficulty: 'beginner' }]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [csvContent, setCsvContent] = useState('');
  const [subcategories, setSubcategories] = useState<string[]>([]);
  
  // Fetch subcategories when category changes
  useEffect(() => {
    if (selectedCategory) {
      // In a real app, fetch subcategories for the selected category
      // For now, we'll use placeholder subcategories
      const mockSubcategories = ['Grundläggande', 'Avancerad', 'Specialiserad'];
      setSubcategories(mockSubcategories);
    } else {
      setSubcategories([]);
    }
  }, [selectedCategory]);
  
  const addFlashcardRow = () => {
    setBatchFlashcards([
      ...batchFlashcards, 
      { question: '', answer: '', difficulty: 'beginner' }
    ]);
  };
  
  const removeFlashcardRow = (index: number) => {
    const newBatch = [...batchFlashcards];
    newBatch.splice(index, 1);
    setBatchFlashcards(newBatch);
  };
  
  const updateFlashcardField = (
    index: number, 
    field: 'question' | 'answer' | 'difficulty', 
    value: string
  ) => {
    const newBatch = [...batchFlashcards];
    if (field === 'difficulty') {
      newBatch[index][field] = value as 'beginner' | 'intermediate' | 'advanced' | 'expert';
    } else {
      newBatch[index][field] = value;
    }
    setBatchFlashcards(newBatch);
  };
  
  const handlePreview = () => {
    // Validate if there's enough data to preview
    if (!selectedCategory || batchFlashcards.some(f => !f.question || !f.answer)) {
      toast({
        title: 'Ofullständig data',
        description: 'Fyll i alla fält för att förhandsgranska',
        variant: 'destructive'
      });
      return;
    }
    
    setIsPreviewOpen(true);
  };
  
  const handleImportCSV = () => {
    try {
      // Parse CSV content
      const rows = csvContent.split('\n');
      const newBatch: typeof batchFlashcards = [];
      
      rows.forEach(row => {
        const [question, answer, difficulty = 'beginner'] = row.split(',').map(item => item.trim());
        
        if (question && answer) {
          newBatch.push({
            question,
            answer,
            difficulty: (difficulty as 'beginner' | 'intermediate' | 'advanced' | 'expert') || 'beginner'
          });
        }
      });
      
      if (newBatch.length === 0) {
        throw new Error('Inga giltiga rader hittades');
      }
      
      setBatchFlashcards(newBatch);
      setIsImportOpen(false);
      
      toast({
        title: 'Import lyckades',
        description: `${newBatch.length} flashcards importerade`
      });
    } catch (error) {
      console.error('Error parsing CSV:', error);
      toast({
        title: 'Fel vid import',
        description: 'Felaktigt CSV-format',
        variant: 'destructive'
      });
    }
  };
  
  const saveFlashcards = async () => {
    if (!selectedCategory) {
      toast({
        title: 'Kategori saknas',
        description: 'Välj en kategori för dina flashcards',
        variant: 'destructive'
      });
      return;
    }
    
    if (batchFlashcards.some(f => !f.question || !f.answer)) {
      toast({
        title: 'Ofullständig data',
        description: 'Fyll i alla frågor och svar',
        variant: 'destructive'
      });
      return;
    }
    
    try {
      // Format the flashcards for saving
      const flashcardsToSave = batchFlashcards.map(f => ({
        question: f.question,
        answer: f.answer,
        category: selectedCategory,
        subcategory: selectedSubcategory || null,
        difficulty: f.difficulty,
        user_id: user?.id,
        module_id: selectedCategory, // Simplified; in real app this would be the actual module_id
        correct_count: 0,
        incorrect_count: 0,
        learned: false,
        review_later: false,
        reportCount: 0,
        isApproved: true // Admin-created cards are pre-approved
      }));
      
      // Save to Supabase
      const { data, error } = await supabase
        .from('flashcards')
        .insert(flashcardsToSave);
      
      if (error) throw error;
      
      toast({
        title: 'Sparade framgångsrikt',
        description: `${flashcardsToSave.length} flashcards har lagts till`
      });
      
      // Reset form
      setBatchFlashcards([{ question: '', answer: '', difficulty: 'beginner' }]);
    } catch (error) {
      console.error('Error saving flashcards:', error);
      toast({
        title: 'Fel vid sparande',
        description: 'Kunde inte spara flashcards',
        variant: 'destructive'
      });
    }
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Skapa Flashcards</h2>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => setIsImportOpen(true)}
          >
            <Upload className="h-4 w-4 mr-2" />
            Importera CSV
          </Button>
          <Button 
            variant="outline" 
            onClick={handlePreview}
          >
            <Eye className="h-4 w-4 mr-2" />
            Förhandsgranska
          </Button>
          <Button onClick={saveFlashcards}>
            <Save className="h-4 w-4 mr-2" />
            Spara alla
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-1">Kategori</label>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Välj kategori" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Underkategori (valfritt)</label>
          <Select 
            value={selectedSubcategory} 
            onValueChange={setSelectedSubcategory}
            disabled={!selectedCategory || subcategories.length === 0}
          >
            <SelectTrigger>
              <SelectValue placeholder="Välj underkategori" />
            </SelectTrigger>
            <SelectContent>
              {subcategories.map((subcat) => (
                <SelectItem key={subcat} value={subcat}>{subcat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead style={{ width: '40%' }}>Fråga</TableHead>
                <TableHead style={{ width: '40%' }}>Svar</TableHead>
                <TableHead style={{ width: '15%' }}>Svårighetsgrad</TableHead>
                <TableHead style={{ width: '5%' }}></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {batchFlashcards.map((flashcard, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Textarea
                      value={flashcard.question}
                      onChange={(e) => updateFlashcardField(index, 'question', e.target.value)}
                      placeholder="Skriv frågan här..."
                      className="min-h-[80px]"
                    />
                  </TableCell>
                  <TableCell>
                    <Textarea
                      value={flashcard.answer}
                      onChange={(e) => updateFlashcardField(index, 'answer', e.target.value)}
                      placeholder="Skriv svaret här..."
                      className="min-h-[80px]"
                    />
                  </TableCell>
                  <TableCell>
                    <Select 
                      value={flashcard.difficulty} 
                      onValueChange={(value) => updateFlashcardField(index, 'difficulty', value)}
                    >
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
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFlashcardRow(index)}
                      disabled={batchFlashcards.length === 1}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <Button
            variant="outline"
            onClick={addFlashcardRow}
          >
            <Plus className="h-4 w-4 mr-2" />
            Lägg till rad
          </Button>
        </CardFooter>
      </Card>
      
      {/* Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Förhandsgranskning av Flashcards</DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <div className="flex gap-2 mb-4">
              <Badge>Kategori: {categories.find(c => c.id === selectedCategory)?.name}</Badge>
              {selectedSubcategory && <Badge variant="outline">Underkategori: {selectedSubcategory}</Badge>}
            </div>
            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fråga</TableHead>
                  <TableHead>Svar</TableHead>
                  <TableHead>Svårighetsgrad</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {batchFlashcards.map((flashcard, index) => (
                  <TableRow key={index}>
                    <TableCell>{flashcard.question}</TableCell>
                    <TableCell>{flashcard.answer}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {flashcard.difficulty === 'beginner' && 'Nybörjare'}
                        {flashcard.difficulty === 'intermediate' && 'Mellan'}
                        {flashcard.difficulty === 'advanced' && 'Avancerad'}
                        {flashcard.difficulty === 'expert' && 'Expert'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPreviewOpen(false)}>Stäng</Button>
            <Button onClick={() => {
              setIsPreviewOpen(false);
              saveFlashcards();
            }}>
              <Save className="h-4 w-4 mr-2" />
              Spara alla
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Import Dialog */}
      <Dialog open={isImportOpen} onOpenChange={setIsImportOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Importera från CSV</DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <p className="text-sm text-muted-foreground mb-2">
              Ladda upp en CSV-fil med formatet: Fråga, Svar, Svårighetsgrad (valfritt)
            </p>
            <Textarea
              value={csvContent}
              onChange={(e) => setCsvContent(e.target.value)}
              placeholder="Fråga 1, Svar 1, beginner&#10;Fråga 2, Svar 2, intermediate"
              className="min-h-[200px]"
            />
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsImportOpen(false)}>Avbryt</Button>
            <Button onClick={handleImportCSV}>Importera</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
