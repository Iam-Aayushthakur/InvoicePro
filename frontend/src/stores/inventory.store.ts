import { create } from 'zustand';

interface InventoryState {
  stockAlerts: unknown[];
  setStockAlerts: (alerts: unknown[]) => void;
}

export const useInventoryStore = create<InventoryState>((set) => ({
  stockAlerts: [],
  setStockAlerts: (stockAlerts) => set({ stockAlerts }),
}));
