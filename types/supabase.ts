export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          price: number
          sale_price: number | null
          cost: number | null
          sku: string | null
          barcode: string | null
          stock: number | null
          is_active: boolean
          is_featured: boolean
          is_new: boolean
          is_sale: boolean
          category_id: string | null
          brand_id: string | null
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          price: number
          sale_price?: number | null
          cost?: number | null
          sku?: string | null
          barcode?: string | null
          stock?: number | null
          is_active?: boolean
          is_featured?: boolean
          is_new?: boolean
          is_sale?: boolean
          category_id?: string | null
          brand_id?: string | null
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          price?: number
          sale_price?: number | null
          cost?: string | null
          sku?: string | null
          barcode?: string | null
          stock?: number | null
          is_active?: boolean
          is_featured?: boolean
          is_new?: boolean
          is_sale?: boolean
          category_id?: string | null
          brand_id?: string | null
          created_at?: string
          updated_at?: string | null
        }
      }
      product_images: {
        Row: {
          id: string
          product_id: string
          url: string
          alt_text: string | null
          is_primary: boolean
          display_order: number | null
          created_at: string
        }
        Insert: {
          id?: string
          product_id: string
          url: string
          alt_text?: string | null
          is_primary?: boolean
          display_order?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          url?: string
          alt_text?: string | null
          is_primary?: boolean
          display_order?: number | null
          created_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          parent_id: string | null
          image_url: string | null
          is_active: boolean
          display_order: number | null
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          parent_id?: string | null
          image_url?: string | null
          is_active?: boolean
          display_order?: number | null
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          parent_id?: string | null
          image_url?: string | null
          is_active?: boolean
          display_order?: number | null
          created_at?: string
          updated_at?: string | null
        }
      }
      brands: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          logo_url: string | null
          is_active: boolean
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          logo_url?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          logo_url?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string | null
        }
      }
      // Add other tables as needed
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
