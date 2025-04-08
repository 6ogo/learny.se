export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      customers: {
        Row: {
          created_at: string
          current_period_end: string | null
          id: string
          status: string | null
          stripe_customer_id: string | null
          subscription_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_period_end?: string | null
          id?: string
          status?: string | null
          stripe_customer_id?: string | null
          subscription_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_period_end?: string | null
          id?: string
          status?: string | null
          stripe_customer_id?: string | null
          subscription_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      flashcard_interactions: {
        Row: {
          created_at: string | null
          flashcard_id: string
          id: string
          is_correct: boolean | null
          response_time_ms: number | null
          session_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          flashcard_id: string
          id?: string
          is_correct?: boolean | null
          response_time_ms?: number | null
          session_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          flashcard_id?: string
          id?: string
          is_correct?: boolean | null
          response_time_ms?: number | null
          session_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "flashcard_interactions_flashcard_id_fkey"
            columns: ["flashcard_id"]
            isOneToOne: false
            referencedRelation: "flashcards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "flashcard_interactions_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "flashcard_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      flashcard_modules: {
        Row: {
          category: string
          created_at: string
          description: string | null
          id: string
          is_generic: boolean
          name: string
          subcategory: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          id?: string
          is_generic?: boolean
          name: string
          subcategory?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          is_generic?: boolean
          name?: string
          subcategory?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      flashcard_sessions: {
        Row: {
          cards_studied: number | null
          category: string | null
          completed: boolean | null
          correct_count: number | null
          end_time: string | null
          id: string
          incorrect_count: number | null
          start_time: string | null
          subcategory: string | null
          user_id: string
        }
        Insert: {
          cards_studied?: number | null
          category?: string | null
          completed?: boolean | null
          correct_count?: number | null
          end_time?: string | null
          id?: string
          incorrect_count?: number | null
          start_time?: string | null
          subcategory?: string | null
          user_id: string
        }
        Update: {
          cards_studied?: number | null
          category?: string | null
          completed?: boolean | null
          correct_count?: number | null
          end_time?: string | null
          id?: string
          incorrect_count?: number | null
          start_time?: string | null
          subcategory?: string | null
          user_id?: string
        }
        Relationships: []
      }
      flashcard_shares: {
        Row: {
          code: string
          created_at: string
          flashcard_ids: string[]
          id: string
          user_id: string
        }
        Insert: {
          code: string
          created_at?: string
          flashcard_ids: string[]
          id?: string
          user_id: string
        }
        Update: {
          code?: string
          created_at?: string
          flashcard_ids?: string[]
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      flashcards: {
        Row: {
          answer: string
          category: string
          correct_count: number
          created_at: string
          difficulty: string
          id: string
          incorrect_count: number
          is_approved: boolean
          last_reviewed: string | null
          learned: boolean
          module_id: string
          next_review: string | null
          question: string
          report_count: number
          report_reason: string[] | null
          review_later: boolean
          subcategory: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          answer: string
          category: string
          correct_count?: number
          created_at?: string
          difficulty: string
          id?: string
          incorrect_count?: number
          is_approved?: boolean
          last_reviewed?: string | null
          learned?: boolean
          module_id: string
          next_review?: string | null
          question: string
          report_count?: number
          report_reason?: string[] | null
          review_later?: boolean
          subcategory?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          answer?: string
          category?: string
          correct_count?: number
          created_at?: string
          difficulty?: string
          id?: string
          incorrect_count?: number
          is_approved?: boolean
          last_reviewed?: string | null
          learned?: boolean
          module_id?: string
          next_review?: string | null
          question?: string
          report_count?: number
          report_reason?: string[] | null
          review_later?: boolean
          subcategory?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "flashcards_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "flashcard_modules"
            referencedColumns: ["id"]
          },
        ]
      }
      user_achievements: {
        Row: {
          date_earned: string
          description: string
          displayed: boolean
          icon: string
          id: string
          name: string
          user_id: string
        }
        Insert: {
          date_earned?: string
          description: string
          displayed?: boolean
          icon: string
          id?: string
          name: string
          user_id: string
        }
        Update: {
          date_earned?: string
          description?: string
          displayed?: boolean
          icon?: string
          id?: string
          name?: string
          user_id?: string
        }
        Relationships: []
      }
      user_activity: {
        Row: {
          created_at: string | null
          flashcards_studied: number | null
          id: string
          login_date: string
          study_duration_seconds: number | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          flashcards_studied?: number | null
          id?: string
          login_date?: string
          study_duration_seconds?: number | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          flashcards_studied?: number | null
          id?: string
          login_date?: string
          study_duration_seconds?: number | null
          user_id?: string
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          created_at: string
          current_streak: number | null
          daily_usage: number
          id: string
          is_admin: boolean
          last_active_date: string | null
          longest_streak: number | null
          subscription_tier: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          current_streak?: number | null
          daily_usage?: number
          id: string
          is_admin?: boolean
          last_active_date?: string | null
          longest_streak?: number | null
          subscription_tier?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          current_streak?: number | null
          daily_usage?: number
          id?: string
          is_admin?: boolean
          last_active_date?: string | null
          longest_streak?: number | null
          subscription_tier?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_activity: {
        Args: { start_date: string; time_range: number }
        Returns: {
          date: string
          active_users: number
          flashcards_studied: number
        }[]
      }
      increment: {
        Args: { row_id: number; column_name: string; table_name: string }
        Returns: number
      }
      increment_flashcards_studied: {
        Args: { user_id: string; study_date: string; count: number }
        Returns: undefined
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      reset_daily_usage: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
