import apiClient from '@/lib/api-client';
import { Invoice } from '@/types/invoice';

export interface DashboardData {
  stats: {
    total_invoices: number;
    pending: number;
    overdue: number;
    paid_total: number;
    this_month: number;
  };
  recent_invoices: Invoice[];
}

export const getDashboard = async (): Promise<DashboardData> => {
  const response = await apiClient.get('/invoices/dashboard');
  return response.data.data;
};

export const getInvoiceById = async (id: string): Promise<Invoice> => {
  try {
    const response = await apiClient.get(`/invoices/${id}`);
    return response.data.data;
  } catch (error: any) {
    const message = error.response?.data?.message || error.message || 'Failed to load invoice';
    throw new Error(message);
  }
};

export const updateInvoice = async (id: string, data: Partial<Invoice>) => {
  const response = await apiClient.patch(`/invoices/${id}`, data);
  if (response.data?.success) return response.data.data;
  throw new Error(response.data?.message || 'Failed to update invoice');
};

export const createInvoiceFromText = async (text: string): Promise<{ invoice: Invoice; text: string }> => {
  try {
    const response = await apiClient.post('/invoices/from-text', { text });
    return response.data.data;
  } catch (error: any) {
    if (error.response?.data) throw error.response.data;
    throw error;
  }
};

export const createInvoiceFromAudio = async (file: Blob): Promise<Invoice> => {
  const formData = new FormData();
  formData.append('file', file, 'recording.webm');

  try {
    const response = await apiClient.post('/invoices/from-audio', formData);
    return response.data;
  } catch (error: any) {
    const message = error.response?.data?.message || error.message || 'Failed to create invoice from audio';
    throw new Error(message);
  }
};
