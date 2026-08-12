// User domain types

export interface User {
  id: string;
  auth_user_id: string;
  email: string;
  full_name: string;
  phone: string | null;
  avatar_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UpdateUserProfileInput {
  full_name?: string;
  phone?: string;
  avatar_url?: string;
}

export interface InviteMemberInput {
  email: string;
  full_name: string;
  role_id: string;
}

export interface UpdateMemberRoleInput {
  role_id: string;
}

export interface UserWithMembership extends User {
  membership: {
    id: string;
    company_id: string;
    role_id: string;
    role_name: string;
    is_active: boolean;
    joined_at: string;
  };
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
