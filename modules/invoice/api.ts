import apiClient from '@/lib/api-client';
import { Invoice } from '@/types/invoice';

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
