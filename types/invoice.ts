export interface InvoiceItem {
  description: string;
  qty: number;
  price: number;
  total: number;
  code?: string;
}

export interface Invoice {
  id: number;
  user_id: number;
  customer_name: string | null;
  customer_email: string | null;
  customer_phone: string | null;
  invoice_date: string | null;
  due_date: string | null;
  subtotal: number | null;
  tax: number | null;
  total: number | null;
  currency: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'synced';
  source: 'whatsapp' | 'web' | 'upload';
  raw_transcription: string | null;
  xero_invoice_id: string | null;
  created_at: string;
  updated_at: string;
  line_items: LineItem[];
}

export interface LineItem {
  id: number;
  invoice_id: number;
  description: string;
  quantity: number | null;
  unit_price: number | null;
  total: number | null;
}

