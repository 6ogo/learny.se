// src/components/admin/FlashcardCreation.tsx
import React, { useState, useEffect, useCallback } from 'react';
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
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Upload, Eye, Save, X, Check, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Flashcard } from '@/types/flashcard';
import { useAuth } from '@/context/AuthContext';
import { useLocalStorage } from '@/context/LocalStorageContext'; // Keep for categories

export const FlashcardCreation: React.FC = () => {
  const { toast } = useToast();
  const { user } = useAuth(); // Use auth user ID
  const { categories } = useLocalStorage(); // Get categories for dropdown
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
  const [isLoadingSubcategories, setIsLoadingSubcategories] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch subcategories based on selected category
   const fetchSubcategories = useCallback(async (categoryId: string) => {
    if (!categoryId) {
      setSubcategories([]);
      return;
    }
    setIsLoadingSubcategories(true);
    try {
      // Fetch distinct subcategories for the given category from flashcards table
      const { data, error } = await supabase
        .from('flashcards')
        .select('subcategory', { count: 'exact' })
        .eq('category', categoryId)
        .not('subcategory', 'is', null); // Ensure subcategory is not null

      if (error) throw error;

      // Use Set to get unique values, filter out null/empty strings
      const uniqueSubcategories = [...new Set(data.map(item => item.subcategory).filter(Boolean))] as string[];

      // Fetch subcategories from modules table as well
       const { data: moduleSubcats, error: moduleError } = await supabase
           .from('flashcard_modules')
           .select('subcategory', { count: 'exact'})
           .eq('category', categoryId)
           .not('subcategory', 'is', null);

       if (moduleError) throw moduleError;

       const uniqueModuleSubcats = [...new Set(moduleSubcats.map(item => item.subcategory).filter(Boolean))] as string[];

       // Combine and deduplicate
       const allUniqueSubcats = [...new Set([...uniqueSubcategories, ...uniqueModuleSubcats])].sort();


      if (allUniqueSubcats.length > 0) {
        setSubcategories(allUniqueSubcats);
      } else {
        // If no subcategories found in DB, maybe fallback to a default list or empty
        setSubcategories([]); // Or fallbackToLocalSubcategories(categoryId) if needed
        console.log("No existing subcategories found for", categoryId);
      }
    } catch (error) {
      console.error('Error fetching subcategories:', error);
      toast({ title: 'Fel', description: 'Kunde inte hämta underkategorier.', variant: 'destructive' });
      setSubcategories([]); // Reset on error
    } finally {
      setIsLoadingSubcategories(false);
    }
  }, [toast]); // Added toast dependency

   // Fallback might not be needed if fetching from DB covers most cases
  // const fallbackToLocalSubcategories = useCallback(...)

  useEffect(() => {
    fetchSubcategories(selectedCategory);
  }, [selectedCategory, fetchSubcategories]);

  // --- UI Update Functions ---
  const addFlashcardRow = () => {
    setBatchFlashcards(prev => [
      ...prev,
      { question: '', answer: '', difficulty: 'beginner' }
    ]);
  };

  const removeFlashcardRow = (index: number) => {
    if (batchFlashcards.length > 1) {
      setBatchFlashcards(prev => prev.filter((_, i) => i !== index));
    }
  };

  const updateFlashcardField = (
    index: number,
    field: 'question' | 'answer' | 'difficulty',
    value: string
  ) => {
    setBatchFlashcards(prev =>
      prev.map((flashcard, i) =>
        i === index
          ? { ...flashcard, [field]: value as any } // Use 'as any' for difficulty type simplicity here
          : flashcard
      )
    );
  };

  const handlePreview = () => {
    if (!selectedCategory || batchFlashcards.some(f => !f.question || !f.answer)) {
      toast({
        title: 'Ofullständig data',
        description: 'Välj kategori och fyll i alla fält för att förhandsgranska.',
        variant: 'destructive'
      });
      return;
    }
    setIsPreviewOpen(true);
  };

  const handleImportCSV = () => {
    try {
      const rows = csvContent.split('\n').filter(row => row.trim() !== ''); // Filter empty rows
      const newBatch: typeof batchFlashcards = [];

      rows.forEach((row, rowIndex) => {
        const columns = row.split(',').map(item => item.trim());
        const [question, answer, difficulty = 'beginner'] = columns;

        // Basic validation
        if (question && answer) {
          const validDifficulties = ['beginner', 'intermediate', 'advanced', 'expert'];
          const normalizedDifficulty = difficulty.toLowerCase();
          const finalDifficulty = validDifficulties.includes(normalizedDifficulty)
             ? normalizedDifficulty as typeof batchFlashcards[0]['difficulty']
             : 'beginner';

          newBatch.push({ question, answer, difficulty: finalDifficulty });
        } else {
            console.warn(`Skipping CSV row ${rowIndex + 1} due to missing question or answer.`);
        }
      });

      if (newBatch.length === 0) {
        throw new Error('Inga giltiga flashcards hittades i CSV-datan.');
      }

      setBatchFlashcards(newBatch);
      setIsImportOpen(false);
      setCsvContent(''); // Clear textarea

      toast({
        title: 'Import lyckades',
        description: `${newBatch.length} flashcards importerade från CSV. Välj kategori och spara.`
      });
    } catch (error: any) {
      console.error('Error parsing CSV:', error);
      toast({
        title: 'Fel vid import',
        description: error.message || 'Felaktigt CSV-format eller data.',
        variant: 'destructive'
      });
    }
  };

  // --- Database Interaction ---
  const findOrCreateModuleForSave = async (): Promise<string | null> => {
    const category = selectedCategory;
    const subcategory = selectedSubcategory || null; // Ensure null if empty
    const moduleName = subcategory ? `${categories.find(c=>c.id === category)?.name || category} - ${subcategory}` : categories.find(c=>c.id === category)?.name || category;
    const description = `Admin created module for ${moduleName}`;

    if (!user?.id) {
      toast({ title: 'Error', description: 'User not logged in.', variant: 'destructive' });
      return null;
    }
    if (!category) {
        toast({ title: 'Error', description: 'Category not selected.', variant: 'destructive' });
        return null;
    }

    // Check if module exists for this user
    let query = supabase
      .from('flashcard_modules')
      .select('id')
      .eq('name', moduleName)
      .eq('category', category)
      .eq('user_id', user.id);

    // Handle null subcategory check correctly
    if (subcategory === null) {
        query = query.is('subcategory', null);
    } else {
        query = query.eq('subcategory', subcategory);
    }

    let { data: existingModule, error: findError } = await query.maybeSingle();

    if (findError && findError.code !== 'PGRST116') { // Ignore "0 rows" error
        console.error(`Error finding module ${moduleName} for user ${user.id}:`, findError);
        toast({ title: 'Fel', description: 'Kunde inte verifiera modul.', variant: 'destructive' });
        return null;
    }

    if (existingModule) {
      console.log(`Using existing module: ${moduleName} (ID: ${existingModule.id})`);
      return existingModule.id;
    }

    // Create module if it doesn't exist
    console.log(`Creating module: "${moduleName}" for user ${user.id}`);
    const { data: newModule, error: createError } = await supabase
      .from('flashcard_modules')
      .insert({
        name: moduleName,
        description: description,
        category: category,
        subcategory: subcategory, // Insert null if empty/null
        user_id: user.id,
      })
      .select('id')
      .single();

    if (createError) {
      console.error(`Error creating module ${moduleName} for user ${user.id}:`, createError);
      toast({ title: 'Fel', description: 'Kunde inte skapa ny modul.', variant: 'destructive' });
      return null;
    }
    console.log(`Created new module: ${moduleName} (ID: ${newModule.id})`);
    return newModule.id;
  };

  const saveFlashcards = async () => {
    if (!user) {
      toast({ title: 'Fel', description: 'Du måste vara inloggad för att spara.', variant: 'destructive' });
      return;
    }
    if (!selectedCategory) {
      toast({ title: 'Kategori saknas', description: 'Välj en kategori för dina flashcards.', variant: 'destructive' });
      return;
    }
    if (batchFlashcards.some(f => !f.question || !f.answer)) {
      toast({ title: 'Ofullständig data', description: 'Fyll i alla frågor och svar.', variant: 'destructive' });
      return;
    }

    setIsSaving(true);
    setIsPreviewOpen(false); // Close preview if open

    const moduleId = await findOrCreateModuleForSave();
    if (!moduleId) {
      setIsSaving(false);
      return; // Error toast shown in findOrCreateModuleForSave
    }

    try {
      const flashcardsToSave = batchFlashcards.map(f => ({
        question: f.question,
        answer: f.answer,
        category: selectedCategory,
        subcategory: selectedSubcategory || null,
        difficulty: f.difficulty,
        user_id: user.id, // Use logged-in user's ID
        module_id: moduleId, // Link to the found/created module
        correct_count: 0,
        incorrect_count: 0,
        learned: false,
        review_later: false,
        report_count: 0,
        report_reason: null,
        is_approved: true // Admin created = approved
      }));

      const { data, error } = await supabase
        .from('flashcards')
        .insert(flashcardsToSave)
        .select(); // Select to confirm insertion

      if (error) throw error;

      const moduleName = selectedSubcategory
          ? `${categories.find(c => c.id === selectedCategory)?.name || selectedCategory} - ${selectedSubcategory}`
          : categories.find(c => c.id === selectedCategory)?.name || selectedCategory;

      toast({
        title: 'Sparade framgångsrikt',
        description: `${data.length} flashcards har lagts till i modulen "${moduleName}".`
      });

      setBatchFlashcards([{ question: '', answer: '', difficulty: 'beginner' }]);
      // Reset category/subcategory if desired
      // setSelectedCategory('');
      // setSelectedSubcategory('');
    } catch (error: any) {
      console.error('Error saving flashcards:', error);
      toast({
        title: 'Fel vid sparande',
        description: error.message || 'Kunde inte spara flashcards.',
        variant: 'destructive'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const getCategoryNameById = (id: string) => {
    const category = categories.find(c => c.id === id);
    return category ? category.name : id;
  };

  // --- JSX ---
  return (
    <div className="text-foreground">
      {/* Header with Buttons */}
      <div className="flex flex-wrap justify-between items-center mb-6 gap-2">
        <h2 className="text-2xl font-bold">Skapa Flashcards</h2>
        <div className="flex gap-2 flex-wrap">
          <Button
            variant="outline"
            onClick={() => setIsImportOpen(true)}
            disabled={isSaving}
          >
            <Upload className="h-4 w-4 mr-2" />
            Importera CSV
          </Button>
          <Button
            variant="outline"
            onClick={handlePreview}
            disabled={isSaving}
          >
            <Eye className="h-4 w-4 mr-2" />
            Förhandsgranska
          </Button>
          <Button onClick={saveFlashcards} disabled={isSaving}>
            {isSaving ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Spara alla
          </Button>
        </div>
      </div>

      {/* Category/Subcategory Selects */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label htmlFor="category-select" className="block text-sm font-medium mb-1">Kategori *</label>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger id="category-select" className="bg-background text-foreground">
              <SelectValue placeholder="Välj kategori..." />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label htmlFor="subcategory-select" className="block text-sm font-medium mb-1">Underkategori (valfritt)</label>
          <Select
            value={selectedSubcategory}
            onValueChange={setSelectedSubcategory}
            disabled={!selectedCategory || isLoadingSubcategories}
          >
            <SelectTrigger id="subcategory-select" className="bg-background text-foreground">
              {isLoadingSubcategories ? (
                <div className="flex items-center text-muted-foreground">
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Laddar...
                </div>
              ) : (
                <SelectValue placeholder="Välj underkategori..." />
              )}
            </SelectTrigger>
            <SelectContent>
              {subcategories.length > 0 ? (
                subcategories.map((subcat) => (
                  <SelectItem key={subcat} value={subcat}>{subcat}</SelectItem>
                ))
              ) : (
                <div className="px-4 py-2 text-sm text-muted-foreground">Inga underkategorier hittades</div>
              )}
            </SelectContent>
          </Select>
          {!selectedCategory && <p className="text-xs text-muted-foreground mt-1">Välj en kategori först.</p>}
        </div>
      </div>

      {/* Flashcard Table Card */}
      <Card className="bg-card text-card-foreground">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead style={{ width: '40%' }}>Fråga *</TableHead>
                <TableHead style={{ width: '40%' }}>Svar *</TableHead>
                <TableHead style={{ width: '15%' }}>Svårighetsgrad *</TableHead>
                <TableHead style={{ width: '5%' }} className="text-right">Ta bort</TableHead>
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
                      className="min-h-[80px] bg-background text-foreground"
                      aria-label={`Fråga för rad ${index + 1}`}
                    />
                  </TableCell>
                  <TableCell>
                    <Textarea
                      value={flashcard.answer}
                      onChange={(e) => updateFlashcardField(index, 'answer', e.target.value)}
                      placeholder="Skriv svaret här..."
                      className="min-h-[80px] bg-background text-foreground"
                       aria-label={`Svar för rad ${index + 1}`}
                    />
                  </TableCell>
                  <TableCell>
                    <Select
                      value={flashcard.difficulty}
                      onValueChange={(value) => updateFlashcardField(index, 'difficulty', value)}
                    >
                      <SelectTrigger className="bg-background text-foreground" aria-label={`Svårighetsgrad för rad ${index + 1}`}>
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
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFlashcardRow(index)}
                      disabled={batchFlashcards.length <= 1 || isSaving}
                      aria-label={`Ta bort rad ${index + 1}`}
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
            disabled={isSaving}
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
            <DialogDescription>
                Kontrollera dina flashcards innan du sparar.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 max-h-[60vh] overflow-y-auto">
            <div className="flex gap-2 mb-4 flex-wrap">
              <Badge variant="secondary">{getCategoryNameById(selectedCategory)}</Badge>
              {selectedSubcategory && <Badge variant="outline">{selectedSubcategory}</Badge>}
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
                    <TableCell className="align-top">{flashcard.question}</TableCell>
                    <TableCell className="align-top">{flashcard.answer}</TableCell>
                    <TableCell className="align-top">
                      <Badge variant="outline">{flashcard.difficulty}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPreviewOpen(false)} disabled={isSaving}>
                Stäng
            </Button>
            <Button onClick={saveFlashcards} disabled={isSaving}>
              {isSaving ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Spara alla
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Import CSV Dialog */}
      <Dialog open={isImportOpen} onOpenChange={setIsImportOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Importera från CSV</DialogTitle>
            <DialogDescription>
              Klistra in din CSV-data nedan. Format: Fråga,Svar,[Svårighetsgrad] (en per rad). Svårighetsgrad är valfritt och blir 'beginner' om det saknas.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              value={csvContent}
              onChange={(e) => setCsvContent(e.target.value)}
              placeholder="Vad är huvudstaden i Sverige?,Stockholm,beginner
Vad är 2+2?,4"
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