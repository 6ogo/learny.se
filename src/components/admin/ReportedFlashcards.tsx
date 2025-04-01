
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table';
import { CheckCircle, XCircle, Edit, Filter, RefreshCw } from 'lucide-react';
import { Flashcard } from '@/types/flashcard';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export const ReportedFlashcards: React.FC = () => {
  const { toast } = useToast();
  const [reportedCards, setReportedCards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [currentFlashcard, setCurrentFlashcard] = useState<Flashcard | null>(null);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [categories, setCategories] = useState<string[]>([]);
  const [editedQuestion, setEditedQuestion] = useState('');
  const [editedAnswer, setEditedAnswer] = useState('');

  const fetchReportedCards = async () => {
    setLoading(true);
    try {
      console.log('Fetching reported flashcards from Supabase...');
      const { data: flashcardsData, error } = await supabase
        .from('flashcards')
        .select('*')
        .gt('report_count', 0)
        .order('report_count', { ascending: false });

      if (error) {
        throw error;
      }

      if (flashcardsData) {
        console.log(`Retrieved ${flashcardsData.length} reported flashcards`);
        setReportedCards(flashcardsData.map(card => ({
          id: card.id,
          question: card.question,
          answer: card.answer,
          category: card.category,
          subcategory: card.subcategory || undefined,
          difficulty: card.difficulty as 'beginner' | 'intermediate' | 'advanced' | 'expert',
          report_count: card.report_count || 0,
          report_reason: card.report_reason || [],
          is_approved: card.is_approved || false
        })));

        const uniqueCategories = [...new Set(flashcardsData.map(card => card.category))];
        setCategories(uniqueCategories);
      }
    } catch (error) {
      console.error('Error fetching reported cards:', error);
      toast({
        title: 'Fel',
        description: 'Kunde inte hämta rapporterade flashcards',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportedCards();
  }, []);

  const handleApprove = async (card: Flashcard) => {
    try {
      await supabase
        .from('flashcards')
        .update({
          is_approved: true,
          report_count: 0,
          report_reason: []
        })
        .eq('id', card.id);

      toast({
        title: 'Godkänd',
        description: 'Flashcard har godkänts och rapporter har rensats'
      });

      setReportedCards(prev =>
        prev.filter(c => c.id !== card.id)
      );
    } catch (error) {
      console.error('Error approving flashcard:', error);
      toast({
        title: 'Fel',
        description: 'Kunde inte godkänna flashcard',
        variant: 'destructive'
      });
    }
  };

  const handleRemove = async (card: Flashcard) => {
    try {
      await supabase
        .from('flashcards')
        .delete()
        .eq('id', card.id);

      toast({
        title: 'Borttagen',
        description: 'Flashcard har tagits bort'
      });

      setReportedCards(prev =>
        prev.filter(c => c.id !== card.id)
      );
    } catch (error) {
      console.error('Error removing flashcard:', error);
      toast({
        title: 'Fel',
        description: 'Kunde inte ta bort flashcard',
        variant: 'destructive'
      });
    }
  };

  const openEditDialog = (card: Flashcard) => {
    setCurrentFlashcard(card);
    setEditedQuestion(card.question);
    setEditedAnswer(card.answer);
    setIsEditOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!currentFlashcard) return;

    try {
      await supabase
        .from('flashcards')
        .update({
          question: editedQuestion,
          answer: editedAnswer,
          is_approved: true,
          report_count: 0,
          report_reason: []
        })
        .eq('id', currentFlashcard.id);

      toast({
        title: 'Uppdaterad',
        description: 'Flashcard har uppdaterats och godkänts'
      });

      setReportedCards(prev =>
        prev.filter(c => c.id !== currentFlashcard.id)
      );

      setIsEditOpen(false);
    } catch (error) {
      console.error('Error updating flashcard:', error);
      toast({
        title: 'Fel',
        description: 'Kunde inte uppdatera flashcard',
        variant: 'destructive'
      });
    }
  };

  const filteredCards = reportedCards.filter(card => {
    const matchesSearch = card.question.toLowerCase().includes(search.toLowerCase()) ||
      card.answer.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = filterCategory && filterCategory !== 'all'
      ? card.category === filterCategory
      : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Rapporterade Flashcards</h2>
        <Button onClick={fetchReportedCards} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Uppdatera
        </Button>
      </div>

      <div className="flex gap-4 mb-4">
        <div className="flex-1">
          <Input
            placeholder="Sök..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full"
          />
        </div>

        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Kategori" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alla kategorier</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>{category}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : filteredCards.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Fråga</TableHead>
              <TableHead>Svar</TableHead>
              <TableHead>Kategori</TableHead>
              <TableHead>Rapporter</TableHead>
              <TableHead>Anledning</TableHead>
              <TableHead>Åtgärder</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCards.map((card) => (
              <TableRow key={card.id}>
                <TableCell className="font-medium max-w-[200px] truncate">{card.question}</TableCell>
                <TableCell className="max-w-[200px] truncate">{card.answer}</TableCell>
                <TableCell>{card.category}</TableCell>
                <TableCell><Badge variant="destructive">{card.report_count}</Badge></TableCell>
                <TableCell>
                  {card.report_reason?.map((reason, i) => (
                    <Badge key={i} variant="outline" className="mr-1 mb-1">
                      {reason.replace(/_/g, ' ')}
                    </Badge>
                  ))}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleApprove(card)}
                      title="Godkänn"
                    >
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditDialog(card)}
                      title="Redigera"
                    >
                      <Edit className="h-4 w-4 text-blue-500" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemove(card)}
                      title="Ta bort"
                    >
                      <XCircle className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <Card>
          <CardContent className="flex justify-center items-center py-12">
            <p className="text-muted-foreground">Inga rapporterade flashcards hittades</p>
          </CardContent>
        </Card>
      )}

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>Redigera Flashcard</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="question" className="font-medium">Fråga</label>
              <Textarea
                id="question"
                value={editedQuestion}
                onChange={(e) => setEditedQuestion(e.target.value)}
                rows={3}
              />
            </div>

            <div className="grid gap-2">
              <label htmlFor="answer" className="font-medium">Svar</label>
              <Textarea
                id="answer"
                value={editedAnswer}
                onChange={(e) => setEditedAnswer(e.target.value)}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>Avbryt</Button>
            <Button onClick={handleSaveEdit}>Spara ändringar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
