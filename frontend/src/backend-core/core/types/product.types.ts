export interface Product {
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
}

export interface CreateProductInput {
  category_id?: string;
  name: string;
  sku: string;
  barcode?: string;
  description?: string;
  unit?: string;
  purchase_price?: number;
  selling_price?: number;
  tax_rate?: number;
  hsn_sac?: string;
  track_inventory?: boolean;
  minimum_stock?: number;
}

export type UpdateProductInput = Partial<CreateProductInput>;
