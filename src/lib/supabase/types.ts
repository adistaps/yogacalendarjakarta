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
      users: {
        Row: {
          id: string
          email: string
          name: string
          avatar_url: string | null
          phone: string | null
          role: 'user' | 'eo' | 'admin'
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          avatar_url?: string | null
          phone?: string | null
          role?: 'user' | 'eo' | 'admin'
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          avatar_url?: string | null
          phone?: string | null
          role?: 'user' | 'eo' | 'admin'
          created_at?: string
        }
        Relationships: []
      }
      eo_profiles: {
        Row: {
          id: string
          user_id: string
          org_name: string
          slug: string
          bio: string | null
          logo_url: string | null
          whatsapp: string | null
          contact_email: string | null
          status: 'pending' | 'approved' | 'rejected'
          rejection_reason: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          org_name: string
          slug: string
          bio?: string | null
          logo_url?: string | null
          whatsapp?: string | null
          contact_email?: string | null
          status?: 'pending' | 'approved' | 'rejected'
          rejection_reason?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          org_name?: string
          slug?: string
          bio?: string | null
          logo_url?: string | null
          whatsapp?: string | null
          contact_email?: string | null
          status?: 'pending' | 'approved' | 'rejected'
          rejection_reason?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "eo_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      events: {
        Row: {
          id: string
          eo_id: string
          title: string
          slug: string
          description: string
          facilities: string | null
          collaboration_info: string | null
          date_start: string
          date_end: string
          time_start: string
          time_end: string
          location_area: string
          location_address: string
          whatsapp_group_link: string | null
          qr_code_url: string | null
          admin_note: string | null
          status: 'draft' | 'pending' | 'approved' | 'rejected'
          rejection_reason: string | null
          deleted_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          eo_id: string
          title: string
          slug: string
          description: string
          facilities?: string | null
          collaboration_info?: string | null
          date_start: string
          date_end: string
          time_start: string
          time_end: string
          location_area: string
          location_address: string
          whatsapp_group_link?: string | null
          qr_code_url?: string | null
          admin_note?: string | null
          status?: 'draft' | 'pending' | 'approved' | 'rejected'
          rejection_reason?: string | null
          deleted_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          eo_id?: string
          title?: string
          slug?: string
          description?: string
          facilities?: string | null
          collaboration_info?: string | null
          date_start?: string
          date_end?: string
          time_start?: string
          time_end?: string
          location_area?: string
          location_address?: string
          whatsapp_group_link?: string | null
          qr_code_url?: string | null
          admin_note?: string | null
          status?: 'draft' | 'pending' | 'approved' | 'rejected'
          rejection_reason?: string | null
          deleted_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "events_eo_id_fkey"
            columns: ["eo_id"]
            isOneToOne: false
            referencedRelation: "eo_profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      event_images: {
        Row: {
          id: string
          event_id: string
          url: string
          order_index: number
          created_at: string
        }
        Insert: {
          id?: string
          event_id: string
          url: string
          order_index?: number
          created_at?: string
        }
        Update: {
          id?: string
          event_id?: string
          url?: string
          order_index?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_images_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          }
        ]
      }
      ticket_types: {
        Row: {
          id: string
          event_id: string
          name: string
          price: number
          quota: number
          quota_sold: number
          created_at: string
        }
        Insert: {
          id?: string
          event_id: string
          name: string
          price: number
          quota: number
          quota_sold?: number
          created_at?: string
        }
        Update: {
          id?: string
          event_id?: string
          name?: string
          price?: number
          quota?: number
          quota_sold?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ticket_types_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          }
        ]
      }
      ticket_orders: {
        Row: {
          id: string
          event_id: string | null
          user_id: string | null
          total_price: number
          status: 'pending_payment' | 'paid' | 'expired' | 'cancelled'
          xendit_invoice_id: string | null
          xendit_payment_url: string | null
          buyer_name: string
          buyer_email: string
          buyer_phone: string
          pdf_url: string | null
          paid_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          event_id?: string | null
          user_id?: string | null
          total_price: number
          status?: 'pending_payment' | 'paid' | 'expired' | 'cancelled'
          xendit_invoice_id?: string | null
          xendit_payment_url?: string | null
          buyer_name: string
          buyer_email: string
          buyer_phone: string
          pdf_url?: string | null
          paid_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          event_id?: string | null
          user_id?: string | null
          total_price?: number
          status?: 'pending_payment' | 'paid' | 'expired' | 'cancelled'
          xendit_invoice_id?: string | null
          xendit_payment_url?: string | null
          buyer_name?: string
          buyer_email?: string
          buyer_phone?: string
          pdf_url?: string | null
          paid_at?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ticket_orders_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ticket_orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      ticket_order_items: {
        Row: {
          id: string
          order_id: string
          ticket_type_id: string | null
          attendee_name: string
          attendee_phone: string | null
          quantity: number
        }
        Insert: {
          id?: string
          order_id: string
          ticket_type_id?: string | null
          attendee_name: string
          attendee_phone?: string | null
          quantity?: number
        }
        Update: {
          id?: string
          order_id?: string
          ticket_type_id?: string | null
          attendee_name?: string
          attendee_phone?: string | null
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "ticket_order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "ticket_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ticket_order_items_ticket_type_id_fkey"
            columns: ["ticket_type_id"]
            isOneToOne: false
            referencedRelation: "ticket_types"
            referencedColumns: ["id"]
          }
        ]
      }
      ad_slots: {
        Row: {
          id: string
          eo_id: string | null
          event_id: string | null
          slot_type: 'hero' | 'featured'
          date_start: string
          date_end: string
          amount_paid: number
          status: 'pending_payment' | 'paid' | 'rejected'
          payment_proof_url: string | null
          rejection_reason: string | null
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          eo_id?: string | null
          event_id?: string | null
          slot_type: 'hero' | 'featured'
          date_start: string
          date_end: string
          amount_paid: number
          status?: 'pending_payment' | 'paid' | 'rejected'
          payment_proof_url?: string | null
          rejection_reason?: string | null
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          eo_id?: string | null
          event_id?: string | null
          slot_type?: 'hero' | 'featured'
          date_start?: string
          date_end?: string
          amount_paid?: number
          status?: 'pending_payment' | 'paid' | 'rejected'
          payment_proof_url?: string | null
          rejection_reason?: string | null
          is_active?: boolean
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ad_slots_eo_id_fkey"
            columns: ["eo_id"]
            isOneToOne: false
            referencedRelation: "eo_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ad_slots_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          }
        ]
      }
      ad_pricing: {
        Row: {
          id: string
          slot_type: 'hero' | 'featured'
          price_per_day: number
          updated_by_admin: string | null
          updated_at: string
        }
        Insert: {
          id?: string
          slot_type: 'hero' | 'featured'
          price_per_day: number
          updated_by_admin?: string | null
          updated_at?: string
        }
        Update: {
          id?: string
          slot_type?: 'hero' | 'featured'
          price_per_day?: number
          updated_by_admin?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ad_pricing_updated_by_admin_fkey"
            columns: ["updated_by_admin"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      ad_pricing_log: {
        Row: {
          id: string
          slot_type: string
          old_price: number | null
          new_price: number
          changed_by: string | null
          changed_at: string
        }
        Insert: {
          id?: string
          slot_type: string
          old_price?: number | null
          new_price: number
          changed_by?: string | null
          changed_at?: string
        }
        Update: {
          id?: string
          slot_type?: string
          old_price?: number | null
          new_price?: number
          changed_by?: string | null
          changed_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ad_pricing_log_changed_by_fkey"
            columns: ["changed_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      calendar_events: {
        Row: {
          id: string
          event_id: string
          display_date: string
          created_by_admin: string | null
          created_at: string
        }
        Insert: {
          id?: string
          event_id: string
          display_date: string
          created_by_admin?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          event_id?: string
          display_date?: string
          created_by_admin?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "calendar_events_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "calendar_events_created_by_admin_fkey"
            columns: ["created_by_admin"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      disbursements: {
        Row: {
          id: string
          eo_id: string | null
          amount: number
          reference_number: string | null
          note: string | null
          disbursed_by: string | null
          disbursed_at: string
          status: 'pending' | 'completed'
        }
        Insert: {
          id?: string
          eo_id?: string | null
          amount: number
          reference_number?: string | null
          note?: string | null
          disbursed_by?: string | null
          disbursed_at?: string
          status?: 'pending' | 'completed'
        }
        Update: {
          id?: string
          eo_id?: string | null
          amount?: number
          reference_number?: string | null
          note?: string | null
          disbursed_by?: string | null
          disbursed_at?: string
          status?: 'pending' | 'completed'
        }
        Relationships: [
          {
            foreignKeyName: "disbursements_eo_id_fkey"
            columns: ["eo_id"]
            isOneToOne: false
            referencedRelation: "eo_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "disbursements_disbursed_by_fkey"
            columns: ["disbursed_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      reserve_ticket_quota: {
        Args: {
          p_ticket_type_id: string
          p_quantity: number
        }
        Returns: boolean
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_eo: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      get_my_eo_profile_id: {
        Args: Record<PropertyKey, never>
        Returns: string
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
