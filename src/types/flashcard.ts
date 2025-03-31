
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
  // DB specific fields
  correct_count?: number;
  incorrect_count?: number;
  last_reviewed?: string;
  created_at?: string;
  module_id?: string;
  user_id?: string;
  next_review?: string;
};

export type ReportReason = 
  | 'incorrect_information'
  | 'inappropriate_content'
  | 'duplicate'
  | 'copyright_violation'
  | 'other';
