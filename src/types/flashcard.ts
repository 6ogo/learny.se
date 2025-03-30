
export type Flashcard = {
  id: string;
  question: string;
  answer: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  lastReviewed?: number;
  nextReview?: number;
  correctCount?: number;
  incorrectCount?: number;
  learned?: boolean;
  reviewLater?: boolean;
};
