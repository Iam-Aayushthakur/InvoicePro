export interface Category {
  id: string;
  company_id: string;
  name: string;
  description: string | null;
  parent_id: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  updated_by: string | null;
}

export interface CreateCategoryInput {
  name: string;
  description?: string;
  parent_id?: string;
}

export type UpdateCategoryInput = Partial<CreateCategoryInput>;
