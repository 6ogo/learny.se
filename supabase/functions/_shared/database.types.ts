
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
        }
        Insert: {
          id?: string
          name: string
          description?: string
          category: string
          subcategory?: string
          user_id?: string
          is_generic?: boolean
        }
      }
    }
  }
}
