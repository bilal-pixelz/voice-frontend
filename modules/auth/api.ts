import apiClient from '@/lib/api-client';
import { User } from '@/types/user';

export const register = async (userData: Omit<User, 'id'>) => {
  const response = await apiClient.post('/auth/register', userData);
  return response.data;
};

export const login = async (formData: FormData) => {
  const response = await apiClient.post('/auth/token', formData, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });
  return response.data;
};

export const getGoogleLoginUrl = async () => {
  const response = await apiClient.get('/auth/google/login');
  return response.data;
};
