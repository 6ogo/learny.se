
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      flashcards: {
        Row: {
          id: string
          question: string
          answer: string
          category: string
          subcategory?: string
          difficulty: string
          module_id: string
          user_id: string
          is_approved: boolean
          correct_count?: number
          incorrect_count?: number
          learned?: boolean
          review_later?: boolean
          last_reviewed?: string
          next_review?: string
          created_at?: string
          updated_at?: string
          report_count?: number
          report_reason?: string[]
        }
        Insert: {
          id?: string
          question: string
          answer: string
          category: string
          subcategory?: string
          difficulty: string
          module_id: string
          user_id: string
          is_approved?: boolean
          correct_count?: number
          incorrect_count?: number
          learned?: boolean
          review_later?: boolean
          last_reviewed?: string
          next_review?: string
          created_at?: string
          updated_at?: string
          report_count?: number
          report_reason?: string[]
        }
      }
      flashcard_modules: {
        Row: {
          id: string
          name: string
          description?: string
          category: string
          subcategory?: string
          user_id?: string
          is_generic: boolean
          created_at?: string
          updated_at?: string
        }
        Insert: {
          id?: string
          name: string
          description?: string
          category: string
          subcategory?: string
          user_id?: string
          is_generic?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      user_profiles: {
        Row: {
          id: string
          subscription_tier: string
          is_admin: boolean
          current_streak: number
          longest_streak: number
          last_active_date: string
          daily_usage: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          subscription_tier?: string
          is_admin?: boolean
          current_streak?: number
          longest_streak?: number
          last_active_date?: string
          daily_usage?: number
          created_at?: string
          updated_at?: string
        }
      }
      flashcard_sessions: {
        Row: {
          id: string
          user_id: string
          start_time: string
          end_time?: string
          cards_studied: number
          correct_count: number
          incorrect_count: number
          completed: boolean
          category?: string
          subcategory?: string
        }
        Insert: {
          id?: string
          user_id: string
          start_time?: string
          end_time?: string
          cards_studied?: number
          correct_count?: number
          incorrect_count?: number
          completed?: boolean
          category?: string
          subcategory?: string
        }
      }
      flashcard_interactions: {
        Row: {
          id: string
          user_id: string
          flashcard_id: string
          is_correct?: boolean
          response_time_ms?: number
          session_id?: string
          created_at?: string
        }
        Insert: {
          id?: string
          user_id: string
          flashcard_id: string
          is_correct?: boolean
          response_time_ms?: number
          session_id?: string
          created_at?: string
        }
      }
      flashcard_shares: {
        Row: {
          id: string
          code: string
          flashcard_ids: string[]
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          code: string
          flashcard_ids: string[]
          user_id: string
          created_at?: string
        }
      }
      user_achievements: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string
          icon: string
          date_earned: string
          displayed: boolean
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description: string
          icon: string
          date_earned?: string
          displayed?: boolean
        }
      }
      user_activity: {
        Row: {
          id: string
          user_id: string
          login_date: string
          study_duration_seconds?: number
          flashcards_studied?: number
          created_at?: string
        }
        Insert: {
          id?: string
          user_id: string
          login_date?: string
          study_duration_seconds?: number
          flashcards_studied?: number
          created_at?: string
        }
      }
      customers: {
        Row: {
          id: string
          user_id: string
          stripe_customer_id?: string
          subscription_id?: string
          status?: string
          current_period_end?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          stripe_customer_id?: string
          subscription_id?: string
          status?: string
          current_period_end?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
