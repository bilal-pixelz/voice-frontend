import apiClient from '@/lib/api-client';
import { User } from '@/types/user';

export const register = async (userData: Omit<User, 'id'>) => {
  try {
    const response = await apiClient.post('/auth/register', userData);
    if (response.data && response.data.success) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || 'Registration failed.');
    }
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.detail || error.response?.data?.message || error.message || 'An unknown error occurred';
    throw new Error(errorMessage);
  }
};

export const login = async (formData: FormData) => {
  try {
    const response = await apiClient.post('/auth/token', formData, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    if (response.data && response.data.success) {
      return response.data.data;
    } else {
      // This case might happen if success=False is returned with a 200 OK status
      throw new Error(response.data.message || 'Login failed.');
    }
  } catch (error: any) {
    // This handles 4xx/5xx errors, like the 401 from the backend
    const errorMessage =
      error.response?.data?.detail || error.response?.data?.message || error.message || 'An unknown error occurred';
    throw new Error(errorMessage);
  }
};

export const getGoogleLoginUrl = async () => {
  try {
    const response = await apiClient.get('/auth/google/login');
    if (response.data && response.data.success) {
      localStorage.setItem("oauth_state", response.data.data.state);
      localStorage.setItem("code_verifier", response.data.data.code_verifier);
      return response.data.data;
    } else {
      throw new Error(response.data.message || 'Failed to get Google login URL.');
    }
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || error.message || 'An unknown error occurred';
    throw new Error(errorMessage);
  }
};

export const googleCallback = async (
  state: string,
  code: string,
  code_verifier: string = localStorage.getItem("code_verifier") || ''
) => {
  try {
    const response = await apiClient.post('/auth/google/exchange', {
      state,
      code,
      code_verifier,
    });

    if (response.data && response.data.success) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || 'Google login failed.');
    }
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || error.message || 'An unknown error occurred';
    throw new Error(errorMessage);
  }
};
