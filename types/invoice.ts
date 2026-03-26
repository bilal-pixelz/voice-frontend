export interface InvoiceItem {
  description: string;
  qty: number;
  price: number;
  total: number;
  code?: string;
}

export interface Invoice {
  id: string;
  recipient: string;
  amount: number;
  dueDate: string;
  date?: string;
  invoiceNumber?: string;
  billTo?: string;
  poRef?: string;
  items?: InvoiceItem[];
  notes?: string;
  gstAmount?: number;
  missing_info_detect?: string[];
  status?: 'draft' | 'sent' | 'paid' | 'overdue';
}

