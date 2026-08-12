import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CompanyPreferences {
  currency: string;
  timezone: string;
}

export interface CompanyState {
  preferences: CompanyPreferences;
  setPreferences: (prefs: Partial<CompanyPreferences>) => void;
}

export const useCompanyStore = create<CompanyState>()(
  persist(
    (set) => ({
      preferences: {
        currency: 'INR',
        timezone: 'Asia/Kolkata',
      },
      setPreferences: (prefs) => set((state) => ({
        preferences: { ...state.preferences, ...prefs }
      })),
    }),
    {
      name: 'invoicepro-company-prefs',
    }
  )
);
