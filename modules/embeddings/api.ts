import apiClient from '@/lib/api-client';

export const createEmbedding = async (text: string) => {
  const response = await apiClient.post('/embeddings/', { text });
  return response.data;
};
