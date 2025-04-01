
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useSubscription } from '@/context/SubscriptionContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Pencil, Brain, Upload, Share2, Plus, Save, X } from 'lucide-react';
import { AIFlashcardGenerator } from '@/components/AIFlashcardGenerator';
import { useLocalStorage } from '@/context/LocalStorageContext';
import { useToast } from '@/hooks/use-toast';
import { FlashcardSharingDialog } from '@/components/FlashcardSharingDialog';
import { supabase } from '@/integrations/supabase/client';
import { Flashcard } from '@/types/flashcard';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

const CreateFlashcardsPage = () => {
  const { user } = useAuth();
  const { canUseAI, hasReachedModuleLimit, currentTier } = useSubscription();
  const { toast } = useToast();
  const { categories, addFlashcard } = useLocalStorage();
  
  const [sharingDialogOpen, setSharingDialogOpen] = useState(false);
  const [selectedFlashcardIds, setSelectedFlashcardIds] = useState<string[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  
  // Manual flashcard creation state
  const [moduleName, setModuleName] = useState('');
  const [moduleDescription, setModuleDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [flashcards, setFlashcards] = useState<Array<{question: string; answer: string; id: string}>>([
    { question: '', answer: '', id: '1' }
  ]);
  
  // Get available modules for this user
  const [availableModules, setAvailableModules] = useState<Array<{id: string; name: string; category: string}>>([]);
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
  
  // Load user's existing modules
  useEffect(() => {
    if (user) {
      const fetchModules = async () => {
        const { data, error } = await supabase
          .from('flashcard_modules')
          .select('id, name, category')
          .eq('user_id', user.id);
          
        if (error) {
          console.error("Error fetching modules:", error);
          toast({
            title: "Fel vid hämtning av moduler",
            description: error.message,
            variant: "destructive"
          });
        } else if (data) {
          setAvailableModules(data);
          if (data.length > 0) {
            setSelectedModuleId(data[0].id);
            setSelectedCategory(data[0].category);
          }
        }
      };
      
      fetchModules();
    }
  }, [user, toast]);
  
  const handleShareFlashcards = () => {
    // This would be populated with real flashcard IDs in a full implementation
    setSelectedFlashcardIds(['sample-id-1', 'sample-id-2']);
    setSharingDialogOpen(true);
  };

  const handleManualCreate = () => {
    if (hasReachedModuleLimit) {
      toast({
        title: 'Modulsgräns nådd',
        description: `Din ${currentTier}-plan tillåter endast ${hasReachedModuleLimit} moduler. Uppgradera för att skapa fler.`,
        variant: 'destructive'
      });
      return;
    }
    
    // Show the manual creation form
    setIsCreating(true);
  };

  const handleImport = () => {
    if (hasReachedModuleLimit) {
      toast({
        title: 'Modulsgräns nådd',
        description: `Din ${currentTier}-plan tillåter endast ${hasReachedModuleLimit} moduler. Uppgradera för att skapa fler.`,
        variant: 'destructive'
      });
      return;
    }
    
    // Here would be code to handle import functionality
    toast({
      title: 'Importera',
      description: 'Import-funktionen är under utveckling.',
    });
  };

  // Add a new empty flashcard to the form
  const addEmptyFlashcard = () => {
    setFlashcards([...flashcards, { question: '', answer: '', id: Date.now().toString() }]);
  };
  
  // Remove a flashcard from the form
  const removeFlashcard = (id: string) => {
    if (flashcards.length <= 1) {
      toast({
        title: "Kan inte ta bort",
        description: "Du måste ha minst ett flashcard",
        variant: "destructive"
      });
      return;
    }
    
    setFlashcards(flashcards.filter(card => card.id !== id));
  };
  
  // Update a flashcard's question or answer
  const updateFlashcard = (id: string, field: 'question' | 'answer', value: string) => {
    setFlashcards(flashcards.map(card => 
      card.id === id ? { ...card, [field]: value } : card
    ));
  };
  
  // Create a new module and add flashcards
  const handleCreateModule = async () => {
    if (!user) {
      toast({
        title: "Inte inloggad",
        description: "Du måste vara inloggad för att skapa flashcards",
        variant: "destructive"
      });
      return;
    }
    
    if (!selectedCategory) {
      toast({
        title: "Välj kategori",
        description: "Du måste välja en kategori",
        variant: "destructive"
      });
      return;
    }
    
    if (!moduleName.trim()) {
      toast({
        title: "Namn saknas",
        description: "Du måste ge modulen ett namn",
        variant: "destructive"
      });
      return;
    }
    
    // Validate flashcards
    const invalidCards = flashcards.filter(card => !card.question.trim() || !card.answer.trim());
    if (invalidCards.length > 0) {
      toast({
        title: "Ofullständiga flashcards",
        description: "Alla flashcards måste ha både fråga och svar",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // First, create the module
      const { data: moduleData, error: moduleError } = await supabase
        .from('flashcard_modules')
        .insert({
          name: moduleName,
          description: moduleDescription,
          category: selectedCategory,
          user_id: user.id
        })
        .select()
        .single();
        
      if (moduleError) {
        throw moduleError;
      }
      
      // Then, create the flashcards
      const flashcardPromises = flashcards.map(card => {
        const newFlashcard: Partial<Flashcard> = {
          question: card.question,
          answer: card.answer,
          category: selectedCategory,
          difficulty: 'beginner',
          module_id: moduleData.id,
          user_id: user.id,
          is_approved: true // Self-created cards are auto-approved
        };
        
        return addFlashcard(newFlashcard as Flashcard);
      });
      
      await Promise.all(flashcardPromises);
      
      toast({
        title: "Modul skapad",
        description: `${moduleName} har skapats med ${flashcards.length} flashcards`,
      });
      
      // Reset form
      setModuleName('');
      setModuleDescription('');
      setFlashcards([{ question: '', answer: '', id: '1' }]);
      setIsCreating(false);
      
    } catch (error: any) {
      console.error("Error creating module:", error);
      toast({
        title: "Fel vid skapande",
        description: error.message || "Ett fel uppstod när modulen skulle skapas",
        variant: "destructive"
      });
    }
  };
  
  // Add flashcards to an existing module
  const handleAddToExistingModule = async () => {
    if (!user) {
      toast({
        title: "Inte inloggad",
        description: "Du måste vara inloggad för att skapa flashcards",
        variant: "destructive"
      });
      return;
    }
    
    if (!selectedModuleId) {
      toast({
        title: "Välj modul",
        description: "Du måste välja en modul",
        variant: "destructive"
      });
      return;
    }
    
    // Validate flashcards
    const invalidCards = flashcards.filter(card => !card.question.trim() || !card.answer.trim());
    if (invalidCards.length > 0) {
      toast({
        title: "Ofullständiga flashcards",
        description: "Alla flashcards måste ha både fråga och svar",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // Get module details
      const { data: moduleData, error: moduleError } = await supabase
        .from('flashcard_modules')
        .select('category')
        .eq('id', selectedModuleId)
        .single();
        
      if (moduleError) {
        throw moduleError;
      }
      
      // Create the flashcards
      const flashcardPromises = flashcards.map(card => {
        const newFlashcard: Partial<Flashcard> = {
          question: card.question,
          answer: card.answer,
          category: moduleData.category,
          difficulty: 'beginner',
          module_id: selectedModuleId!,
          user_id: user.id,
          is_approved: true // Self-created cards are auto-approved
        };
        
        return addFlashcard(newFlashcard as Flashcard);
      });
      
      await Promise.all(flashcardPromises);
      
      toast({
        title: "Flashcards tillagda",
        description: `${flashcards.length} flashcards har lagts till i modulen`,
      });
      
      // Reset form
      setFlashcards([{ question: '', answer: '', id: '1' }]);
      setIsCreating(false);
      
    } catch (error: any) {
      console.error("Error adding flashcards:", error);
      toast({
        title: "Fel vid tillägg",
        description: error.message || "Ett fel uppstod när flashcards skulle läggas till",
        variant: "destructive"
      });
    }
  };

  // Render manual creation form
  const renderManualCreationForm = () => (
    <div className="space-y-6">
      <div className="flex justify-between">
        <h3 className="text-lg font-medium">Skapa flashcards manuellt</h3>
        <Button variant="ghost" size="sm" onClick={() => setIsCreating(false)}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <Tabs defaultValue="new-module">
        <TabsList>
          <TabsTrigger value="new-module">Ny modul</TabsTrigger>
          <TabsTrigger value="existing-module" disabled={availableModules.length === 0}>
            Befintlig modul
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="new-module" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="module-name">Modulnamn</Label>
              <Input 
                id="module-name" 
                placeholder="T.ex. Svenska glosor" 
                value={moduleName}
                onChange={(e) => setModuleName(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Kategori</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Välj kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Kategorier</SelectLabel>
                    {categories.map(category => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Beskrivning (valfritt)</Label>
            <Textarea 
              id="description" 
              placeholder="Beskriv vad modulen innehåller" 
              value={moduleDescription}
              onChange={(e) => setModuleDescription(e.target.value)}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="existing-module" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="existing-module">Välj modul</Label>
            <Select value={selectedModuleId || ''} onValueChange={setSelectedModuleId}>
              <SelectTrigger>
                <SelectValue placeholder="Välj modul" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Dina moduler</SelectLabel>
                  {availableModules.map(module => (
                    <SelectItem key={module.id} value={module.id}>
                      {module.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="space-y-4 mt-6">
        <div className="flex justify-between items-center">
          <h4 className="font-medium">Flashcards</h4>
          <Button size="sm" variant="outline" onClick={addEmptyFlashcard}>
            <Plus className="h-4 w-4 mr-2" /> Lägg till kort
          </Button>
        </div>
        
        {flashcards.map((card, index) => (
          <div key={card.id} className="p-4 border rounded-md space-y-3 relative">
            <div className="absolute top-2 right-2">
              <Button variant="ghost" size="sm" onClick={() => removeFlashcard(card.id)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor={`question-${card.id}`}>Fråga {index + 1}</Label>
              <Textarea 
                id={`question-${card.id}`} 
                placeholder="Skriv frågan här" 
                value={card.question}
                onChange={(e) => updateFlashcard(card.id, 'question', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor={`answer-${card.id}`}>Svar {index + 1}</Label>
              <Textarea 
                id={`answer-${card.id}`} 
                placeholder="Skriv svaret här" 
                value={card.answer}
                onChange={(e) => updateFlashcard(card.id, 'answer', e.target.value)}
              />
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex justify-end space-x-3 pt-4 border-t">
        <Button variant="outline" onClick={() => setIsCreating(false)}>
          Avbryt
        </Button>
        
        <Button 
          onClick={
            selectedModuleId && (document.querySelector('[role="tablist"] [data-state="active"]')?.getAttribute('value') === 'existing-module')
              ? handleAddToExistingModule
              : handleCreateModule
          }
        >
          <Save className="h-4 w-4 mr-2" /> 
          Spara flashcards
        </Button>
      </div>
    </div>
  );

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Skapa Flashcards</h1>
      <p className="text-muted-foreground mb-8">
        Skapa nya flashcards eller importera från befintliga källor
      </p>
      
      {isCreating ? (
        <Card>
          <CardContent className="pt-6">
            {renderManualCreationForm()}
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="ai" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="ai" disabled={!canUseAI}>
              <Brain className="mr-2 h-4 w-4" />
              AI-genererade
            </TabsTrigger>
            <TabsTrigger value="manual">
              <Pencil className="mr-2 h-4 w-4" />
              Skapa manuellt
            </TabsTrigger>
            <TabsTrigger value="import">
              <Upload className="mr-2 h-4 w-4" />
              Importera
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="ai">
            {canUseAI ? (
              <Card>
                <CardHeader>
                  <CardTitle>Skapa med AI</CardTitle>
                  <CardDescription>
                    Låt AI generera flashcards baserat på ditt ämne och antal
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <AIFlashcardGenerator />
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>AI-funktionen är låst</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">Uppgradera till Super Learner för att låsa upp AI-genererade flashcards.</p>
                  <Button onClick={() => window.location.href = '/pricing'}>
                    Uppgradera nu
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="manual">
            <Card>
              <CardHeader>
                <CardTitle>Skapa flashcards manuellt</CardTitle>
                <CardDescription>
                  Skapa dina egna flashcards med frågor och svar
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4">Skapa dina egna flashcards med frågor och svar.</p>
                <Button onClick={handleManualCreate}>
                  Börja skapa
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="import">
            <Card>
              <CardHeader>
                <CardTitle>Importera flashcards</CardTitle>
                <CardDescription>
                  Importera flashcards från en CSV-fil eller från en delad länk
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4">Importera flashcards från en CSV-fil eller från en delad länk.</p>
                <div className="flex gap-4">
                  <Button onClick={handleImport}>
                    <Upload className="mr-2 h-4 w-4" />
                    Importera från fil
                  </Button>
                  <Button variant="outline" onClick={handleShareFlashcards}>
                    <Share2 className="mr-2 h-4 w-4" />
                    Importera från delningskod
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
      
      <FlashcardSharingDialog 
        open={sharingDialogOpen} 
        onOpenChange={setSharingDialogOpen}
        flashcardIds={selectedFlashcardIds}
      />
    </div>
  );
};

export default CreateFlashcardsPage;
