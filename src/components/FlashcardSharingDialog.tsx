
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { generateShareableLink } from '@/services/groqService';
import { useToast } from '@/hooks/use-toast';
import { Check, Copy, Link as LinkIcon, Loader2 } from 'lucide-react';

interface FlashcardSharingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  flashcardIds: string[];
}

export const FlashcardSharingDialog: React.FC<FlashcardSharingDialogProps> = ({
  open,
  onOpenChange,
  flashcardIds
}) => {
  const [shareableLink, setShareableLink] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleGenerateLink = async () => {
    if (flashcardIds.length === 0) {
      toast({
        title: "Inga flashcards att dela",
        description: "Det finns inga flashcards att dela.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsGenerating(true);
      
      if (flashcardIds.length === 0) {
        toast({
          title: "Kunde inte dela",
          description: "Flashcards måste sparas först innan de kan delas.",
          variant: "destructive"
        });
        return;
      }
      
      const link = await generateShareableLink(flashcardIds);
      
      if (link) {
        setShareableLink(link);
        toast({
          title: "Delbar länk skapad",
          description: "Din delningslänk har skapats! Kopiera den för att dela med vänner."
        });
      }
    } catch (error) {
      console.error('Error generating shareable link:', error);
      toast({
        title: "Fel vid generering av länk",
        description: "Kunde inte skapa en delbar länk. Försök igen senare.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareableLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Dela flashcards</DialogTitle>
          <DialogDescription>
            Skapa en delbar länk för att dela dessa flashcards med andra.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col gap-4 py-4">
          {!shareableLink ? (
            <div className="flex justify-center">
              <Button 
                onClick={handleGenerateLink}
                disabled={isGenerating}
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Skapar länk...
                  </>
                ) : (
                  <>
                    <LinkIcon className="h-4 w-4 mr-2" />
                    Skapa delbar länk
                  </>
                )}
              </Button>
            </div>
          ) : (
            <>
              <div className="flex flex-col gap-2">
                <Label htmlFor="link">Din delbara länk</Label>
                <div className="flex items-center">
                  <Input
                    id="link"
                    value={shareableLink}
                    readOnly
                    className="flex-1 pr-10"
                  />
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    className="ml-[-40px]"
                    onClick={handleCopyLink}
                  >
                    {copied ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground">
                Denna länk låter andra importera dina flashcards till sin samling.
              </p>
            </>
          )}
        </div>
        
        <DialogFooter className="sm:justify-end">
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Stäng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
