import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  email: string;
  full_name: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  activeCompanyId: string | null;
  jwtToken: string | null;
  
  setAuth: (user: User, token: string, companyId?: string) => void;
  setActiveCompany: (companyId: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      activeCompanyId: null,
      jwtToken: null,

      setAuth: (user, token, companyId) => set({
        isAuthenticated: true,
        user,
        jwtToken: token,
        ...(companyId ? { activeCompanyId: companyId } : {})
      }),

      setActiveCompany: (companyId) => set({
        activeCompanyId: companyId
      }),

      logout: () => set({
        isAuthenticated: false,
        user: null,
        activeCompanyId: null,
        jwtToken: null
      })
    }),
    {
      name: 'invoicepro-auth', // localStorage key
    }
  )
);
