
import { Flashcard } from '@/types/flashcard';

export const mathFlashcards: Flashcard[] = [
  {
    id: 'math-1',
    question: 'Vad är Pi?',
    answer: 'Ungefär 3.14159, förhållandet mellan en cirkels omkrets och dess diameter',
    category: 'science',
    difficulty: 'beginner',
    isApproved: true
  },
  {
    id: 'math-2',
    question: 'Vad är Pythagoras sats?',
    answer: 'I en rätvinklig triangel är kvadraten på hypotenusan lika med summan av kvadraterna på kateterna (a² + b² = c²)',
    category: 'science',
    difficulty: 'intermediate',
    isApproved: true
  }
];
