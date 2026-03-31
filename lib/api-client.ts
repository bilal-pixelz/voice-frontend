import axios from "axios";
import { useAuthStore } from "@/store/authStore";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// attach JWT to every request automatically
apiClient.interceptors.request.use((config) => {
  const { token, isTokenExpired, logout } = useAuthStore.getState();

  // only check expiry if a token actually exists
  if (token && isTokenExpired()) {
    logout();
    window.location.href = "/login";
    return Promise.reject("Token expired");
  }

  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// handle token expiry globally
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthEndpoint = error.config?.url?.includes('/auth/');

    if (error.response?.status === 401 && !isAuthEndpoint) {
      // only redirect if token expired, not if login itself fails
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export default apiClient;
