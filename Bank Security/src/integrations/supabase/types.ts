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
      accounts: {
        Row: {
          account_number: string
          balance: number
          created_at: string
          holder_name: string
          home_city: string
          home_country: string
          id: string
          user_id: string | null
        }
        Insert: {
          account_number: string
          balance?: number
          created_at?: string
          holder_name: string
          home_city?: string
          home_country?: string
          id?: string
          user_id?: string | null
        }
        Update: {
          account_number?: string
          balance?: number
          created_at?: string
          holder_name?: string
          home_city?: string
          home_country?: string
          id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      alerts: {
        Row: {
          account_id: string | null
          channel: string
          created_at: string
          delivered: boolean
          id: string
          message: string
          recipient: string
          severity: Database["public"]["Enums"]["severity_level"]
          transaction_id: string | null
        }
        Insert: {
          account_id?: string | null
          channel?: string
          created_at?: string
          delivered?: boolean
          id?: string
          message: string
          recipient: string
          severity?: Database["public"]["Enums"]["severity_level"]
          transaction_id?: string | null
        }
        Update: {
          account_id?: string | null
          channel?: string
          created_at?: string
          delivered?: boolean
          id?: string
          message?: string
          recipient?: string
          severity?: Database["public"]["Enums"]["severity_level"]
          transaction_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "alerts_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "alerts_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      case_events: {
        Row: {
          action: string
          actor_name: string
          case_id: string | null
          created_at: string
          detail: string | null
          id: string
        }
        Insert: {
          action: string
          actor_name?: string
          case_id?: string | null
          created_at?: string
          detail?: string | null
          id?: string
        }
        Update: {
          action?: string
          actor_name?: string
          case_id?: string | null
          created_at?: string
          detail?: string | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "case_events_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
        ]
      }
      cases: {
        Row: {
          account_id: string | null
          assignee_id: string | null
          assignee_name: string | null
          case_ref: string
          created_at: string
          id: string
          severity: Database["public"]["Enums"]["severity_level"]
          status: Database["public"]["Enums"]["case_status"]
          summary: string
          transaction_id: string | null
          updated_at: string
        }
        Insert: {
          account_id?: string | null
          assignee_id?: string | null
          assignee_name?: string | null
          case_ref: string
          created_at?: string
          id?: string
          severity?: Database["public"]["Enums"]["severity_level"]
          status?: Database["public"]["Enums"]["case_status"]
          summary: string
          transaction_id?: string | null
          updated_at?: string
        }
        Update: {
          account_id?: string | null
          assignee_id?: string | null
          assignee_name?: string | null
          case_ref?: string
          created_at?: string
          id?: string
          severity?: Database["public"]["Enums"]["severity_level"]
          status?: Database["public"]["Enums"]["case_status"]
          summary?: string
          transaction_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cases_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cases_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      device_logs: {
        Row: {
          account_id: string | null
          asn: string | null
          browser: string | null
          city: string | null
          country: string | null
          created_at: string
          device: string | null
          event: string
          fingerprint: string | null
          first_seen: boolean
          id: string
          ip_address: string | null
        }
        Insert: {
          account_id?: string | null
          asn?: string | null
          browser?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          device?: string | null
          event?: string
          fingerprint?: string | null
          first_seen?: boolean
          id?: string
          ip_address?: string | null
        }
        Update: {
          account_id?: string | null
          asn?: string | null
          browser?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          device?: string | null
          event?: string
          fingerprint?: string | null
          first_seen?: boolean
          id?: string
          ip_address?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "device_logs_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          full_name: string | null
          id: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
        }
        Relationships: []
      }
      rule_hits: {
        Row: {
          id: string
          label: string
          points: number
          rule_code: string
          severity: Database["public"]["Enums"]["severity_level"]
          transaction_id: string
        }
        Insert: {
          id?: string
          label: string
          points?: number
          rule_code: string
          severity?: Database["public"]["Enums"]["severity_level"]
          transaction_id: string
        }
        Update: {
          id?: string
          label?: string
          points?: number
          rule_code?: string
          severity?: Database["public"]["Enums"]["severity_level"]
          transaction_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "rule_hits_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      rules: {
        Row: {
          code: string
          created_at: string
          description: string
          enabled: boolean
          id: string
          label: string
          severity: Database["public"]["Enums"]["severity_level"]
          weight: number
        }
        Insert: {
          code: string
          created_at?: string
          description: string
          enabled?: boolean
          id?: string
          label: string
          severity?: Database["public"]["Enums"]["severity_level"]
          weight?: number
        }
        Update: {
          code?: string
          created_at?: string
          description?: string
          enabled?: boolean
          id?: string
          label?: string
          severity?: Database["public"]["Enums"]["severity_level"]
          weight?: number
        }
        Relationships: []
      }
      transactions: {
        Row: {
          account_id: string
          amount: number
          asn: string | null
          browser: string | null
          city: string | null
          country: string | null
          device: string | null
          fingerprint: string | null
          id: string
          ip_address: string | null
          kind: string
          merchant: string | null
          new_device: boolean
          occurred_at: string
          risk_score: number
          severity: Database["public"]["Enums"]["severity_level"]
          status: Database["public"]["Enums"]["txn_status"]
          txn_ref: string
        }
        Insert: {
          account_id: string
          amount: number
          asn?: string | null
          browser?: string | null
          city?: string | null
          country?: string | null
          device?: string | null
          fingerprint?: string | null
          id?: string
          ip_address?: string | null
          kind?: string
          merchant?: string | null
          new_device?: boolean
          occurred_at?: string
          risk_score?: number
          severity?: Database["public"]["Enums"]["severity_level"]
          status?: Database["public"]["Enums"]["txn_status"]
          txn_ref: string
        }
        Update: {
          account_id?: string
          amount?: number
          asn?: string | null
          browser?: string | null
          city?: string | null
          country?: string | null
          device?: string | null
          fingerprint?: string | null
          id?: string
          ip_address?: string | null
          kind?: string
          merchant?: string | null
          new_device?: boolean
          occurred_at?: string
          risk_score?: number
          severity?: Database["public"]["Enums"]["severity_level"]
          status?: Database["public"]["Enums"]["txn_status"]
          txn_ref?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
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
      simulate_bankguard_event: { Args: { event_id: string; scenario: string }; Returns: Json }
      review_bankguard_case: { Args: { case_id: string; new_status: "open" | "in_review" | "escalated" | "resolved"; note: string | null }; Returns: undefined }
      review_bankguard_alert: { Args: { alert_id: string; verdict: string }; Returns: undefined }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_staff: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "analyst" | "customer"
      case_status: "open" | "in_review" | "escalated" | "resolved"
      severity_level: "low" | "medium" | "high" | "critical"
      txn_status: "cleared" | "flagged" | "blocked"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
      app_role: ["admin", "analyst", "customer"],
      case_status: ["open", "in_review", "escalated", "resolved"],
      severity_level: ["low", "medium", "high", "critical"],
      txn_status: ["cleared", "flagged", "blocked"],
    },
  },
} as const
