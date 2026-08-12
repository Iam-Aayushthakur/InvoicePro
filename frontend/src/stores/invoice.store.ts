import { create } from 'zustand';

interface InvoiceState {
  currentInvoice: unknown | null;
  setCurrentInvoice: (invoice: unknown | null) => void;
}

export const useInvoiceStore = create<InvoiceState>((set) => ({
  currentInvoice: null,
  setCurrentInvoice: (currentInvoice) => set({ currentInvoice }),
}));
