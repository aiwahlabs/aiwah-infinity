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
      // Add your database tables here
      // Example:
      // profiles: {
      //   Row: {
      //     id: string
      //     user_id: string
      //     full_name: string | null
      //     avatar_url: string | null
      //     created_at: string
      //   }
      //   Insert: {
      //     id?: string
      //     user_id: string
      //     full_name?: string | null
      //     avatar_url?: string | null
      //     created_at?: string
      //   }
      //   Update: {
      //     id?: string
      //     user_id?: string
      //     full_name?: string | null
      //     avatar_url?: string | null
      //     created_at?: string
      //   }
      // }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 