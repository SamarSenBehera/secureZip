export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      files: {
        Row: {
          id: string
          created_at: string
          user_id: string
          original_name: string
          size: number
          processed_size: number | null
          status: string
          download_url: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          original_name: string
          size: number
          processed_size?: number | null
          status?: string
          download_url?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          original_name?: string
          size?: number
          processed_size?: number | null
          status?: string
          download_url?: string | null
        }
      }
      profiles: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          full_name: string | null
          avatar_url: string | null
        }
        Insert: {
          id: string
          created_at?: string
          updated_at?: string
          full_name?: string | null
          avatar_url?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          full_name?: string | null
          avatar_url?: string | null
        }
      }
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
