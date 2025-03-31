
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useSubscription } from '@/context/SubscriptionContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Pencil, Brain, Upload, Share2 } from 'lucide-react';
import { AIFlashcardGenerator } from '@/components/AIFlashcardGenerator';
import { useLocalStorage } from '@/context/LocalStorageContext';
import { useToast } from '@/hooks/use-toast';
import { FlashcardSharingDialog } from '@/components/FlashcardSharingDialog';

const CreateFlashcardsPage = () => {
  const { user } = useAuth();
  const { canUseAI, hasReachedModuleLimit, currentTier } = useSubscription();
  const { toast } = useToast();
  const { categories } = useLocalStorage();
  const [sharingDialogOpen, setSharingDialogOpen] = useState(false);
  const [selectedFlashcardIds, setSelectedFlashcardIds] = useState<string[]>([]);
  
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
    
    // Here would be code to navigate to a manual creation form or open a modal
    toast({
      title: 'Skapa manuellt',
      description: 'Manuell skapande av flashcards är under utveckling.',
    });
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

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Skapa Flashcards</h1>
      <p className="text-muted-foreground mb-8">
        Skapa nya flashcards eller importera från befintliga källor
      </p>
      
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
            <Card className="bg-card text-card-foreground">
              <CardHeader>
                <CardTitle>Skapa med AI</CardTitle>
              </CardHeader>
              <CardContent>
                <AIFlashcardGenerator />
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-card text-card-foreground">
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
          <Card className="bg-card text-card-foreground">
            <CardHeader>
              <CardTitle>Skapa flashcards manuellt</CardTitle>
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
          <Card className="bg-card text-card-foreground">
            <CardHeader>
              <CardTitle>Importera flashcards</CardTitle>
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
      
      <FlashcardSharingDialog 
        open={sharingDialogOpen} 
        onOpenChange={setSharingDialogOpen}
        flashcardIds={selectedFlashcardIds}
      />
    </div>
  );
};

export default CreateFlashcardsPage;
