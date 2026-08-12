import { create } from 'zustand';

export interface UIState {
  sidebarOpen: boolean;
  theme: 'light' | 'dark' | 'system';
  setSidebarOpen: (isOpen: boolean) => void;
  toggleSidebar: () => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  theme: 'light',
  
  setSidebarOpen: (isOpen) => set({ sidebarOpen: isOpen }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setTheme: (theme) => set({ theme })
}));
