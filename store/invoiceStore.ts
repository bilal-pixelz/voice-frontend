import { create } from 'zustand';
import { Invoice } from '@/types/invoice';

interface InvoiceState {
  invoices: Invoice[];
  addInvoice: (invoice: Invoice) => void;
}

export const useInvoiceStore = create<InvoiceState>((set) => ({
  invoices: [],
  addInvoice: (invoice) => set((state) => ({ invoices: [...state.invoices, invoice] })),
}));
