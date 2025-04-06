
export type Program = {
  id: string;
  name: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  flashcards: string[]; // Array of flashcard IDs
  completedByUser?: boolean;
  progress?: number;
  hasExam?: boolean; // Indicates if the program has an exam at the end
  flashcardCount?: number; // Number of flashcards in this program
};
