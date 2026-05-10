export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      agent_applications: {
        Row: {
          agency_name: string | null
          bio: string | null
          created_at: string
          email: string
          full_name: string
          headshot_url: string | null
          id: string
          license_number: string | null
          phone: string
          rejection_reason: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          service_areas: string[] | null
          status: Database["public"]["Enums"]["application_status"]
          temp_password_sent: boolean
          updated_at: string
          user_id: string | null
          years_experience: number | null
        }
        Insert: {
          agency_name?: string | null
          bio?: string | null
          created_at?: string
          email: string
          full_name: string
          headshot_url?: string | null
          id?: string
          license_number?: string | null
          phone: string
          rejection_reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          service_areas?: string[] | null
          status?: Database["public"]["Enums"]["application_status"]
          temp_password_sent?: boolean
          updated_at?: string
          user_id?: string | null
          years_experience?: number | null
        }
        Update: {
          agency_name?: string | null
          bio?: string | null
          created_at?: string
          email?: string
          full_name?: string
          headshot_url?: string | null
          id?: string
          license_number?: string | null
          phone?: string
          rejection_reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          service_areas?: string[] | null
          status?: Database["public"]["Enums"]["application_status"]
          temp_password_sent?: boolean
          updated_at?: string
          user_id?: string | null
          years_experience?: number | null
        }
        Relationships: []
      }
      agent_profiles: {
        Row: {
          agency_name: string | null
          bio: string | null
          created_at: string
          display_name: string
          email: string | null
          id: string
          phone: string | null
          photo_url: string | null
          service_areas: string[] | null
          updated_at: string
          user_id: string
          verified: boolean
        }
        Insert: {
          agency_name?: string | null
          bio?: string | null
          created_at?: string
          display_name: string
          email?: string | null
          id?: string
          phone?: string | null
          photo_url?: string | null
          service_areas?: string[] | null
          updated_at?: string
          user_id: string
          verified?: boolean
        }
        Update: {
          agency_name?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string
          email?: string | null
          id?: string
          phone?: string | null
          photo_url?: string | null
          service_areas?: string[] | null
          updated_at?: string
          user_id?: string
          verified?: boolean
        }
        Relationships: []
      }
      favorites: {
        Row: {
          created_at: string
          id: string
          property_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          property_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          property_id?: string
          user_id?: string
        }
        Relationships: []
      }
      offers: {
        Row: {
          contingencies: string | null
          created_at: string
          down_payment: number | null
          email: string
          financing: Database["public"]["Enums"]["financing_type"]
          full_name: string
          id: string
          message: string | null
          offer_amount: number
          phone: string
          property_id: string
          status: Database["public"]["Enums"]["offer_status"]
          timeline: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          contingencies?: string | null
          created_at?: string
          down_payment?: number | null
          email: string
          financing: Database["public"]["Enums"]["financing_type"]
          full_name: string
          id?: string
          message?: string | null
          offer_amount: number
          phone: string
          property_id: string
          status?: Database["public"]["Enums"]["offer_status"]
          timeline?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          contingencies?: string | null
          created_at?: string
          down_payment?: number | null
          email?: string
          financing?: Database["public"]["Enums"]["financing_type"]
          full_name?: string
          id?: string
          message?: string | null
          offer_amount?: number
          phone?: string
          property_id?: string
          status?: Database["public"]["Enums"]["offer_status"]
          timeline?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      tour_requests: {
        Row: {
          created_at: string
          email: string
          full_name: string
          id: string
          mode: Database["public"]["Enums"]["tour_mode"]
          notes: string | null
          phone: string
          preferred_date: string
          preferred_time: string
          property_id: string
          status: Database["public"]["Enums"]["tour_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name: string
          id?: string
          mode?: Database["public"]["Enums"]["tour_mode"]
          notes?: string | null
          phone: string
          preferred_date: string
          preferred_time: string
          property_id: string
          status?: Database["public"]["Enums"]["tour_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          mode?: Database["public"]["Enums"]["tour_mode"]
          notes?: string | null
          phone?: string
          preferred_date?: string
          preferred_time?: string
          property_id?: string
          status?: Database["public"]["Enums"]["tour_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "agent" | "user"
      application_status: "pending" | "approved" | "rejected"
      financing_type: "cash" | "mortgage" | "installments" | "other"
      offer_status:
        | "submitted"
        | "under_review"
        | "accepted"
        | "rejected"
        | "withdrawn"
      tour_mode: "in_person" | "video"
      tour_status: "pending" | "confirmed" | "completed" | "cancelled"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "agent", "user"],
      application_status: ["pending", "approved", "rejected"],
      financing_type: ["cash", "mortgage", "installments", "other"],
      offer_status: [
        "submitted",
        "under_review",
        "accepted",
        "rejected",
        "withdrawn",
      ],
      tour_mode: ["in_person", "video"],
      tour_status: ["pending", "confirmed", "completed", "cancelled"],
    },
  },
} as const
