import { create } from 'zustand';

interface OfflineState {
  pendingSyncCount: number;
  setPendingSyncCount: (count: number) => void;
}

export const useOfflineStore = create<OfflineState>((set) => ({
  pendingSyncCount: 0,
  setPendingSyncCount: (pendingSyncCount) => set({ pendingSyncCount }),
}));
