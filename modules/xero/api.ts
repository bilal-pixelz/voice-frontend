import apiClient from '@/lib/api-client';

export const getInvoices = async () => {
  const response = await apiClient.get('/invoices');
  return response.data;
};
