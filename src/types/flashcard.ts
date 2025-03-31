
export type Flashcard = {
  id: string;
  question: string;
  answer: string;
  category: string;
  subcategory?: string; 
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  lastReviewed?: number;
  nextReview?: number;
  correctCount?: number;
  incorrectCount?: number;
  learned?: boolean;
  reviewLater?: boolean;
  createdById?: string;
  reportCount?: number;
  reportReason?: string[];
  isApproved?: boolean;
};

export type ReportReason = 
  | 'incorrect_information'
  | 'inappropriate_content'
  | 'duplicate'
  | 'copyright_violation'
  | 'other';
