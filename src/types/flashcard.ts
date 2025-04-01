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
  module_id?: string;
  
  // Reporting functionality fields (camelCase for frontend usage)
  reportCount?: number;
  reportReason?: string[];
  isApproved?: boolean;
  
  // DB specific fields (snake_case)
  correct_count?: number;
  incorrect_count?: number;
  last_reviewed?: string;
  created_at?: string;
  user_id?: string;
  next_review?: string;
  
  // Additional DB fields for reporting functionality (snake_case)
  report_count?: number;
  report_reason?: string[];
  is_approved?: boolean;
  review_later?: boolean; // Added this field to match database schema
};

export type ReportReason = 
  | 'incorrect_information'
  | 'inappropriate_content'
  | 'duplicate'
  | 'copyright_violation'
  | 'other';
