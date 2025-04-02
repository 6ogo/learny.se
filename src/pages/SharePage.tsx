
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { LandingNavBar } from '@/components/LandingNavBar';
import { getSharedFlashcards } from '@/services/flashcardSharingService';
import { Flashcard } from '@/components/Flashcard';
import { useLocalStorage } from '@/context/LocalStorageContext';
import { Flashcard as FlashcardType } from '@/types/flashcard';
import { ChevronLeft, ChevronRight, Download, ExternalLink, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Footer } from '@/components/Footer';

export default function SharePage() {
  const params = useParams<{ shareCode: string }>();
  const { toast } = useToast();
  const { user } = useAuth();
  const { importFlashcards } = useLocalStorage();
  const [isLoading, setIsLoading] = useState(true);
  const [flashcards, setFlashcards] = useState<FlashcardType[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [importing, setImporting] = useState(false);

  useEffect(() => {
    const fetchSharedFlashcards = async () => {
      if (!params.shareCode) {
        toast({
          title: "Ingen delningskod hittades",
          description: "URL:en verkar inte innehålla en giltig delningskod.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        const data = await getSharedFlashcards(params.shareCode);
        
        if (data && data.length > 0) {
          setFlashcards(data);
        } else {
          toast({
            title: "Inga flashcards hittades",
            description: "Kunde inte hitta några flashcards med denna delningskod.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error('Error fetching shared flashcards:', error);
        toast({
          title: "Ett fel uppstod",
          description: "Kunde inte hämta delade flashcards. Vänligen försök igen senare.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSharedFlashcards();
  }, [params.shareCode, toast]);

  const handlePrevious = () => {
    if (flashcards.length <= 1) return;
    setCurrentIndex(prevIndex => 
      prevIndex > 0 ? prevIndex - 1 : flashcards.length - 1
    );
  };

  const handleNext = () => {
    if (flashcards.length <= 1) return;
    setCurrentIndex(prevIndex => 
      prevIndex < flashcards.length - 1 ? prevIndex + 1 : 0
    );
  };

  const handleImport = async () => {
    if (!user) {
      toast({
        title: "Du måste vara inloggad",
        description: "Vänligen logga in för att importera flashcards.",
        variant: "destructive",
      });
      return;
    }

    try {
      setImporting(true);
      await importFlashcards(flashcards);
      toast({
        title: "Flashcards importerade",
        description: `${flashcards.length} flashcards har importerats till din samling.`,
      });
    } catch (error) {
      console.error('Error importing flashcards:', error);
      toast({
        title: "Ett fel uppstod",
        description: "Kunde inte importera flashcards. Vänligen försök igen senare.",
        variant: "destructive",
      });
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <LandingNavBar />
      
      <main className="flex-1 container mx-auto px-4 py-8 max-w-5xl">
        <Card>
          <CardHeader>
            <CardTitle>Delade Flashcards</CardTitle>
            <CardDescription>
              {isLoading ? 'Laddar flashcards...' : 
               flashcards.length === 0 ? 'Inga flashcards hittades' : 
               `${flashcards.length} flashcards hittades`}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : flashcards.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">
                  Inga flashcards hittades med denna delningskod.
                </p>
                <Button asChild>
                  <Link to="/">Tillbaka till startsidan</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <Badge variant="outline">{currentIndex + 1} / {flashcards.length}</Badge>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={handlePrevious}
                      disabled={flashcards.length <= 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={handleNext}
                      disabled={flashcards.length <= 1}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                {flashcards.length > 0 && (
                  <Flashcard 
                    flashcard={flashcards[currentIndex]} 
                  />
                )}
                
                <div className="pt-4 flex flex-col gap-2">
                  <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                    <span>Kategori: <Badge variant="secondary">{flashcards[currentIndex]?.category}</Badge></span>
                    {flashcards[currentIndex]?.subcategory && (
                      <span>Underkategori: <Badge variant="outline">{flashcards[currentIndex]?.subcategory}</Badge></span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
          
          {flashcards.length > 0 && (
            <CardFooter className="flex flex-col sm:flex-row gap-4 border-t pt-6">
              <Button 
                variant="outline" 
                asChild
                className="w-full sm:w-auto"
              >
                <Link to="/auth">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Logga in / Registrera dig
                </Link>
              </Button>
              
              <Button 
                onClick={handleImport} 
                disabled={importing || !user} 
                className="w-full sm:w-auto"
              >
                {importing ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Download className="h-4 w-4 mr-2" />
                )}
                Importera till min samling
              </Button>
            </CardFooter>
          )}
        </Card>
        
        <Separator className="my-8" />
        
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">Skapa ditt eget flashcard-bibliotek</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Med Learny.se kan du skapa, importera och studera med flashcards. 
            Registrera dig nu och börja optimera ditt lärande.
          </p>
          <Button asChild size="lg" className="mt-4">
            <Link to="/auth">Kom igång gratis</Link>
          </Button>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
