import apiClient from '@/lib/api-client';

export const getInvoices = async () => {
  const response = await apiClient.get('/xero/invoices');
  return response.data;
};
