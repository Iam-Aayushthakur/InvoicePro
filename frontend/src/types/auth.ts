export type RoleType = 'OWNER' | 'ADMIN' | 'ACCOUNTANT' | 'CASHIER' | 'WAREHOUSE_MANAGER' | 'EMPLOYEE';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  role: RoleType;
  companyId: string;
  createdAt: string;
}
