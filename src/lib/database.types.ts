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
      documents: {
        Row: {
          id: number
          content: string
          tags: Json | null
          created_at: string
          updated_at: string
          type: string | null
          status: string | null
          user_comments: string | null
          notes: string | null
          title: string | null
          posted_on: string | null
        }
        Insert: {
          id?: number
          content: string
          tags?: Json | null
          created_at?: string
          updated_at?: string
          type?: string | null
          status?: string | null
          user_comments?: string | null
          notes?: string | null
          title?: string | null
          posted_on?: string | null
        }
        Update: {
          id?: number
          content?: string
          tags?: Json | null
          created_at?: string
          updated_at?: string
          type?: string | null
          status?: string | null
          user_comments?: string | null
          notes?: string | null
          title?: string | null
          posted_on?: string | null
        }
      }
      profiles: {
        Row: {
          id: string
          username: string | null
          full_name: string | null
          user_tier: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username?: string | null
          full_name?: string | null
          user_tier?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string | null
          full_name?: string | null
          user_tier?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    } & Record<string, never>
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
} 