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
      async_tasks: {
        Row: {
          id: number
          task_type: string
          workflow_id: string | null
          input_data: Json
          output_data: Json | null
          status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled' | 'timeout'
          current_step: string | null
          status_message: string | null
          n8n_execution_id: string | null
          created_by: string | null
          created_at: string
          processing_started_at: string | null
          processing_completed_at: string | null
          error_details: Json | null
          metadata: Json
        }
        Insert: {
          id?: number
          task_type: string
          workflow_id?: string | null
          input_data: Json
          output_data?: Json | null
          status?: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled' | 'timeout'
          current_step?: string | null
          status_message?: string | null
          n8n_execution_id?: string | null
          created_by?: string | null
          created_at?: string
          processing_started_at?: string | null
          processing_completed_at?: string | null
          error_details?: Json | null
          metadata?: Json
        }
        Update: {
          id?: number
          task_type?: string
          workflow_id?: string | null
          input_data?: Json
          output_data?: Json | null
          status?: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled' | 'timeout'
          current_step?: string | null
          status_message?: string | null
          n8n_execution_id?: string | null
          created_by?: string | null
          created_at?: string
          processing_started_at?: string | null
          processing_completed_at?: string | null
          error_details?: Json | null
          metadata?: Json
        }
      }
      chat_conversations: {
        Row: {
          id: number
          user_id: string | null
          title: string | null
          created_at: string
          updated_at: string
          is_archived: boolean
          metadata: Json
        }
        Insert: {
          id?: number
          user_id?: string | null
          title?: string | null
          created_at?: string
          updated_at?: string
          is_archived?: boolean
          metadata?: Json
        }
        Update: {
          id?: number
          user_id?: string | null
          title?: string | null
          created_at?: string
          updated_at?: string
          is_archived?: boolean
          metadata?: Json
        }
      }
      chat_messages: {
        Row: {
          id: number
          conversation_id: number | null
          role: 'user' | 'assistant' | 'system'
          content: string
          thinking: string | null
          created_at: string
          metadata: Json
          async_task_id: number | null
        }
        Insert: {
          id?: number
          conversation_id?: number | null
          role: 'user' | 'assistant' | 'system'
          content: string
          thinking?: string | null
          created_at?: string
          metadata?: Json
          async_task_id?: number | null
        }
        Update: {
          id?: number
          conversation_id?: number | null
          role?: 'user' | 'assistant' | 'system'
          content?: string
          thinking?: string | null
          created_at?: string
          metadata?: Json
          async_task_id?: number | null
        }
      }
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
      instructions: {
        Row: {
          id: number
          title: string
          content: string
        }
        Insert: {
          id?: number
          title: string
          content: string
        }
        Update: {
          id?: number
          title?: string
          content?: string
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
      test: {
        Row: {
          id: number
          created_at: string
          text: string | null
        }
        Insert: {
          id?: number
          created_at?: string
          text?: string | null
        }
        Update: {
          id?: number
          created_at?: string
          text?: string | null
        }
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
} 