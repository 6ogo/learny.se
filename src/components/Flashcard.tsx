import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ThumbsUp, 
  ThumbsDown, 
  Check, 
  Edit, 
  Trash2, 
  Clock, 
  RotateCcw,
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';
import { useLocalStorage, Flashcard as FlashcardType } from '@/context/LocalStorageContext';
import { formatDistanceToNow } from 'date-fns';
import { sv } from 'date-fns/locale';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface FlashcardProps {
  flashcard: FlashcardType;
  showKnowledgeOptions?: boolean;
  showControls?: boolean;
  onEdit?: (id: string) => void;
  onNext?: () => void;
  onPrevious?: () => void;
  showNavigation?: boolean;
  resetOnNavigate?: boolean;
}

export const Flashcard: React.FC<FlashcardProps> = ({ 
  flashcard, 
  showKnowledgeOptions = false,
  showControls = false,
  onEdit,
  onNext,
  onPrevious,
  showNavigation = false,
  resetOnNavigate = true
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const { markReviewed, deleteFlashcard } = useLocalStorage();

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleKnowledgeLevel = (level: number) => {
    markReviewed(flashcard.id, level);
    setIsFlipped(false);
  };

  const handleDelete = () => {
    deleteFlashcard(flashcard.id);
  };

  const handleNext = () => {
    if (resetOnNavigate) {
      setIsFlipped(false);
    }
    if (onNext) onNext();
  };

  const handlePrevious = () => {
    if (resetOnNavigate) {
      setIsFlipped(false);
    }
    if (onPrevious) onPrevious();
  };

  // Format difficulty for display
  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'Nybörjare';
      case 'intermediate': return 'Medel';
      case 'advanced': return 'Avancerad';
      case 'expert': return 'Expert';
      default: return difficulty;
    }
  };

  // Format difficulty for color
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-learny-green/10 text-learny-green border-learny-green/20';
      case 'intermediate': return 'bg-learny-blue/10 text-learny-blue border-learny-blue/20';
      case 'advanced': return 'bg-learny-purple/10 text-learny-purple border-learny-purple/20';
      case 'expert': return 'bg-learny-red/10 text-learny-red border-learny-red/20';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Extract topic from question if it exists
  const extractTopic = (question: string) => {
    const match = question.match(/^\[([^\]]+)\]/);
    return match ? match[1] : null;
  };

  // Clean question by removing topic prefix
  const cleanQuestion = (question: string) => {
    return question.replace(/^\[[^\]]+\]\s*/, '');
  };

  const topic = extractTopic(flashcard.question);
  const questionText = cleanQuestion(flashcard.question);

  return (
    <div className="perspective-1000">
      <div 
        className={`relative transform-style-3d transition-transform duration-500 w-full ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front side */}
        <Card 
          className={`backface-hidden w-full ${
            isFlipped ? 'hidden' : 'block'
          }`}
        >
          <CardContent className="pt-6 pb-4">
            <div className="min-h-[120px] flex flex-col justify-between">
              <div>
                {/* Meta information - topic and difficulty */}
                <div className="flex justify-between items-center mb-2">
                  {topic && (
                    <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">
                      {topic}
                    </span>
                  )}
                  <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(flashcard.difficulty)}`}>
                    {getDifficultyLabel(flashcard.difficulty)}
                  </span>
                </div>
                
                {/* Main question */}
                <p className="text-lg font-medium mb-4">{questionText}</p>
                
                {/* Review information */}
                {flashcard.lastReviewed && (
                  <div className="text-xs text-muted-foreground mt-4 flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    Senast repeterad: {formatDistanceToNow(flashcard.lastReviewed, { locale: sv, addSuffix: true })}
                  </div>
                )}
              </div>
              
              <div className="mt-4 flex justify-between items-center">
                {/* Navigation controls */}
                {showNavigation && (
                  <div className="flex gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={handlePrevious}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={handleNext}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
                
                {/* Edit/Delete controls */}
                {showControls && (
                  <div className="flex gap-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onEdit && onEdit(flashcard.id)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Redigera</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Är du säker?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Detta kommer permanent radera flashcardet. Denna åtgärd kan inte ångras.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Avbryt</AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-red-500 hover:bg-red-600"
                            onClick={handleDelete}
                          >
                            Radera
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                )}
                
                {/* Show answer button */}
                <div className={showControls || showNavigation ? "ml-auto" : "w-full text-right"}>
                  <Button onClick={handleFlip}>Visa svar</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Back side */}
        <Card 
          className={`backface-hidden absolute inset-0 w-full rotate-y-180 ${
            isFlipped ? 'block' : 'hidden'
          }`}
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <CardContent className="pt-6 pb-4">
            <div className="min-h-[120px] flex flex-col justify-between">
              <div>
                {/* Meta information - topic and difficulty */}
                <div className="flex justify-between items-center mb-2">
                  {topic && (
                    <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">
                      {topic}
                    </span>
                  )}
                  <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(flashcard.difficulty)}`}>
                    {getDifficultyLabel(flashcard.difficulty)}
                  </span>
                </div>
                
                {/* Question and answer */}
                <p className="text-lg font-medium mb-2">{questionText}</p>
                <div className="border-t pt-2">
                  <p className="text-muted-foreground">{flashcard.answer}</p>
                </div>
                
                {/* Knowledge level indicator if it exists */}
                {flashcard.knowledgeLevel && (
                  <div className="mt-2 text-xs">
                    <div className="flex items-center gap-1">
                      <span className="text-muted-foreground">Din kunskap:</span>
                      {flashcard.knowledgeLevel === 1 && (
                        <span className="text-red-500 flex items-center">
                          <ThumbsDown className="h-3 w-3 mr-1" />
                          Svårt
                        </span>
                      )}
                      {flashcard.knowledgeLevel === 2 && (
                        <span className="text-amber-500 flex items-center">
                          <Check className="h-3 w-3 mr-1" />
                          OK
                        </span>
                      )}
                      {flashcard.knowledgeLevel === 3 && (
                        <span className="text-green-500 flex items-center">
                          <ThumbsUp className="h-3 w-3 mr-1" />
                          Lätt
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="mt-4 flex justify-between items-center">
                {/* Navigation controls */}
                {showNavigation && (
                  <div className="flex gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={handlePrevious}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={handleNext}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}

                {/* Reset review status */}
                {flashcard.reviewCount && showControls && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => markReviewed(flashcard.id, 0)}
                        >
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Återställ repetitionsstatusen</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
                
                {/* Knowledge rating buttons or go back button */}
                <div className={showControls || showNavigation ? "ml-auto" : "w-full text-right"}>
                  {showKnowledgeOptions ? (
                    <>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-red-500"
                        onClick={() => handleKnowledgeLevel(1)}
                      >
                        <ThumbsDown className="h-4 w-4 mr-1" />
                        Svårt
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-amber-500 ml-2"
                        onClick={() => handleKnowledgeLevel(2)}
                      >
                        <Check className="h-4 w-4 mr-1" />
                        OK
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-green-500 ml-2"
                        onClick={() => handleKnowledgeLevel(3)}
                      >
                        <ThumbsUp className="h-4 w-4 mr-1" />
                        Lätt
                      </Button>
                    </>
                  ) : (
                    <Button onClick={handleFlip}>Tillbaka</Button>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};