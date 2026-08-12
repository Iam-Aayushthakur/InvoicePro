// Auto-generated or manual Supabase Database Types definition for InvoicePro

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      companies: {
        Row: {
          id: string;
          name: string;
          legal_name: string | null;
          business_type: string;
          email: string;
          phone: string;
          address: string;
          city: string;
          state: string;
          country: string;
          postal_code: string;
          state_code: string;
          gstin: string | null;
          pan: string | null;
          currency: string;
          timezone: string;
          logo_url: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
          created_by: string | null;
          updated_by: string | null;
        };
        Insert: Omit<Database['public']['Tables']['companies']['Row'], 'id' | 'created_at' | 'updated_at'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['companies']['Insert']>;
      };
      users: {
        Row: {
          id: string;
          auth_user_id: string;
          email: string;
          full_name: string;
          phone: string | null;
          avatar_url: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['users']['Row'], 'id' | 'created_at' | 'updated_at'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['users']['Insert']>;
      };
      company_members: {
        Row: {
          id: string;
          company_id: string;
          user_id: string;
          role_id: string;
          is_active: boolean;
          joined_at: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['company_members']['Row'], 'id' | 'created_at' | 'updated_at'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['company_members']['Insert']>;
      };
      customers: {
        Row: {
          id: string;
          company_id: string;
          name: string;
          business_name: string | null;
          email: string | null;
          phone: string | null;
          alternate_phone: string | null;
          billing_address: string;
          shipping_address: string | null;
          city: string | null;
          state: string | null;
          postal_code: string | null;
          country: string;
          gstin: string | null;
          pan: string | null;
          credit_limit: number;
          opening_balance: number;
          outstanding_balance: number;
          notes: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
          created_by: string | null;
          updated_by: string | null;
        };
        Insert: Omit<Database['public']['Tables']['customers']['Row'], 'id' | 'created_at' | 'updated_at'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['customers']['Insert']>;
      };
      products: {
        Row: {
          id: string;
          company_id: string;
          category_id: string | null;
          name: string;
          sku: string;
          barcode: string | null;
          description: string | null;
          unit: string;
          purchase_price: number;
          selling_price: number;
          tax_rate: number;
          hsn_sac: string | null;
          track_inventory: boolean;
          minimum_stock: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
          created_by: string | null;
          updated_by: string | null;
        };
        Insert: Omit<Database['public']['Tables']['products']['Row'], 'id' | 'created_at' | 'updated_at'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['products']['Insert']>;
      };
      sales_invoices: {
        Row: {
          id: string;
          company_id: string;
          customer_id: string;
          invoice_number: string;
          invoice_date: string;
          due_date: string;
          status: string;
          subtotal: number;
          discount_total: number;
          taxable_amount: number;
          cgst_total: number;
          sgst_total: number;
          igst_total: number;
          tax_total: number;
          round_off: number;
          grand_total: number;
          paid_amount: number;
          balance_amount: number;
          notes: string | null;
          terms: string | null;
          created_at: string;
          updated_at: string;
          created_by: string | null;
          updated_by: string | null;
        };
        Insert: Omit<Database['public']['Tables']['sales_invoices']['Row'], 'id' | 'created_at' | 'updated_at'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['sales_invoices']['Insert']>;
      };
    };
  };
}
