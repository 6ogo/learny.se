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
          name: string
          subcategory: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          id?: string
          name: string
          subcategory?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          subcategory?: string | null
          updated_at?: string
          user_id?: string
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
        Args: {
          start_date: string
          time_range: number
        }
        Returns: {
          date: string
          active_users: number
          flashcards_studied: number
        }[]
      }
      increment: {
        Args: {
          row_id: number
          column_name: string
          table_name: string
        }
        Returns: number
      }
      increment_flashcards_studied: {
        Args: {
          user_id: string
          study_date: string
          count: number
        }
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
