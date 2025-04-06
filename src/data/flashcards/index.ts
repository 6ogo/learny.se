
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

// Sample module definitions - these are used for reference when creating modules in Supabase
export const defaultModules = [
  // Medicine modules
  { category: 'medicine', name: 'Anatomi Grundkurs', difficulty: 'beginner', description: 'Grundläggande anatomi för medicinstuderande' },
  { category: 'medicine', name: 'Farmakologi', difficulty: 'intermediate', description: 'Läkemedel och deras verkningsmekanismer' },
  { category: 'medicine', name: 'Avancerad Patologi', difficulty: 'advanced', description: 'Sjukdomslärans fördjupningskurs' },
  
  // Coding modules
  { category: 'coding', name: 'JavaScript Grunder', difficulty: 'beginner', description: 'Komma igång med JavaScript programmering' },
  { category: 'coding', name: 'React Utveckling', difficulty: 'intermediate', description: 'Modern webbutveckling med React' },
  { category: 'coding', name: 'Algoritmer & Datastrukturer', difficulty: 'advanced', description: 'Avancerade programmeringskoncept' },
  
  // Math modules
  { category: 'math', name: 'Algebra Grunder', difficulty: 'beginner', description: 'Grundläggande algebra för gymnasienivå' },
  { category: 'math', name: 'Statistik & Sannolikhet', difficulty: 'intermediate', description: 'Statistiska metoder och sannolikhetslära' },
  { category: 'math', name: 'Högre Matematisk Analys', difficulty: 'advanced', description: 'Avancerad matematisk analys för universitetsnivå' },
  
  // Languages modules
  { category: 'languages', name: 'Svenska Nybörjare', difficulty: 'beginner', description: 'Svenska för nybörjare' },
  { category: 'languages', name: 'Engelska Idiom', difficulty: 'intermediate', description: 'Vanliga idiom i det engelska språket' },
  { category: 'languages', name: 'Spanska Grammatik Avancerad', difficulty: 'advanced', description: 'Avancerad spansk grammatik' },
  
  // Science modules
  { category: 'science', name: 'Grundläggande Kemi', difficulty: 'beginner', description: 'Grunderna i kemi' },
  { category: 'science', name: 'Kvantfysik', difficulty: 'intermediate', description: 'Introduktion till kvantfysikens principer' },
  { category: 'science', name: 'Astrofysik', difficulty: 'advanced', description: 'Avancerade koncept inom astrofysik' },
  
  // Geography modules
  { category: 'geography', name: 'Europas Länder', difficulty: 'beginner', description: 'Lär dig Europas länder och huvudstäder' },
  { category: 'geography', name: 'Klimatzoner & Ekosystem', difficulty: 'intermediate', description: 'Jordens klimatzoner och deras ekosystem' },
  { category: 'geography', name: 'Global Demografi', difficulty: 'advanced', description: 'Avancerad demografisk analys och migrationsmönster' },
  
  // Vehicles modules
  { category: 'vehicles', name: 'Bilkomponenter', difficulty: 'beginner', description: 'Grundläggande bildelar och deras funktioner' },
  { category: 'vehicles', name: 'Motorsportteknik', difficulty: 'intermediate', description: 'Teknik inom motorsport och racing' },
  { category: 'vehicles', name: 'Aerodynamik för Fordon', difficulty: 'advanced', description: 'Avancerade aerodynamiska principer för fordonsdesign' },
  
  // Economics modules
  { category: 'economics', name: 'Privatekonomi', difficulty: 'beginner', description: 'Grunderna i privatekonomi och budgetering' },
  { category: 'economics', name: 'Företagsekonomi', difficulty: 'intermediate', description: 'Ekonomisk analys för företag' },
  { category: 'economics', name: 'Makroekonomiska Modeller', difficulty: 'advanced', description: 'Avancerade makroekonomiska teorier och modeller' },
  
  // History modules
  { category: 'history', name: 'Svenska Regenter', difficulty: 'beginner', description: 'Sveriges regenter genom tiderna' },
  { category: 'history', name: 'Andra Världskriget', difficulty: 'intermediate', description: 'Viktiga händelser under andra världskriget' },
  { category: 'history', name: 'Antikens Civilisationer', difficulty: 'advanced', description: 'Djupgående analys av antikens civilisationer' },
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
