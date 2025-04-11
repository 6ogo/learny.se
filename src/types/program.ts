
export type Program = {
  id: string;
  name: string;
  description: string;
  category: string;
  subcategory?: string; // Added subcategory as an optional property
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  flashcards: string[]; // Array of flashcard IDs
  completedByUser?: boolean;
  progress?: number;
  hasExam?: boolean; // Indicates if the program has an exam at the end
  flashcardCount?: number; // Number of flashcards in this program
  isGeneric?: boolean; // Indicates if this is a generic module available to all users
  user_id?: string; // Added user_id field for tracking who created the module
};
