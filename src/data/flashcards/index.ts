// File: src/data/flashcards/index.ts
import { Flashcard } from '@/types/flashcard';

// Import arrays from category-specific files
import { medicineFlashcards } from './medicine';
import { codingFlashcards } from './coding';
import { mathFlashcards } from './math';
import { languagesFlashcards } from './languages';
import { scienceFlashcards } from './science';
import { geographyFlashcards } from './geography';
import { vehiclesFlashcards } from './vehicles';
import { economicsFlashcards } from './economics';
import { historyFlashcards } from './history';

// Combine all flashcards into one array
export const allFlashcards: Flashcard[] = [
  ...medicineFlashcards,
  ...codingFlashcards,
  ...mathFlashcards,
  ...languagesFlashcards,
  ...scienceFlashcards,
  ...geographyFlashcards,
  ...vehiclesFlashcards,
  ...economicsFlashcards,
  ...historyFlashcards,
];

export {
  medicineFlashcards,
  codingFlashcards,
  mathFlashcards,
  languagesFlashcards,
  scienceFlashcards,
  geographyFlashcards,
  vehiclesFlashcards,
  economicsFlashcards,
  historyFlashcards,
};