export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      categorias: {
        Row: {
          id: number
          created_at: string
          nombre: string
        }
        Insert: {
          id?: number
          created_at?: string
          nombre: string
        }
        Update: {
          id?: number
          created_at?: string
          nombre?: string
        }
        Relationships: []
      }
      pedido_items: {
        Row: {
          id: number
          created_at: string
          pedido_id: number
          product_id: number | null
          product_name: string
          product_image: string | null
          size: string
          quantity: number
          unit_price_cash: number
          unit_price_card: number
          subtotal_amount: number
        }
        Insert: {
          id?: number
          created_at?: string
          pedido_id: number
          product_id?: number | null
          product_name: string
          product_image?: string | null
          size: string
          quantity: number
          unit_price_cash: number
          unit_price_card: number
          subtotal_amount: number
        }
        Update: {
          id?: number
          created_at?: string
          pedido_id?: number
          product_id?: number | null
          product_name?: string
          product_image?: string | null
          size?: string
          quantity?: number
          unit_price_cash?: number
          unit_price_card?: number
          subtotal_amount?: number
        }
        Relationships: [
          {
            foreignKeyName: "pedido_items_pedido_id_fkey"
            columns: ["pedido_id"]
            isOneToOne: false
            referencedRelation: "pedidos"
            referencedColumns: ["id"]
          }
        ]
      }
      pedidos: {
        Row: {
          id: number
          created_at: string
          order_number: string
          first_name: string
          last_name: string
          phone: string
          address: string
          locality: string
          observations: string | null
          payment_method: string
          status: string
          total_amount: number
          is_new: boolean
        }
        Insert: {
          id?: number
          created_at?: string
          order_number?: string
          first_name: string
          last_name: string
          phone: string
          address: string
          locality: string
          observations?: string | null
          payment_method: string
          status?: string
          total_amount: number
          is_new?: boolean
        }
        Update: {
          id?: number
          created_at?: string
          order_number?: string
          first_name?: string
          last_name?: string
          phone?: string
          address?: string
          locality?: string
          observations?: string | null
          payment_method?: string
          status?: string
          total_amount?: number
          is_new?: boolean
        }
        Relationships: []
      }
      products: {
        Row: {
          id: number
          created_at: string
          nombre: string
          categoria: string
          subcategoria: string | null
          precio_efectivo: number
          precio_tarjeta: number
          talles: string[]
          descripcion: string | null
          imagenes: string[]
          coleccion: string | null
        }
        Insert: {
          id?: number
          created_at?: string
          nombre: string
          categoria: string
          subcategoria?: string | null
          precio_efectivo: number
          precio_tarjeta: number
          talles?: string[]
          descripcion?: string | null
          imagenes?: string[]
          coleccion?: string | null
        }
        Update: {
          id?: number
          created_at?: string
          nombre?: string
          categoria?: string
          subcategoria?: string | null
          precio_efectivo?: number
          precio_tarjeta?: number
          talles?: string[]
          descripcion?: string | null
          imagenes?: string[]
          coleccion?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_pedido_with_items: {
        Args: {
          order_payload: Json
          items_payload: Json
        }
        Returns: Database["public"]["Tables"]["pedidos"]["Row"]
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
