import { create } from 'zustand';

interface AuthState {
  token: string | null;
  user: any | null; // Replace 'any' with a proper user type
  isAuthenticated: boolean;
  setToken: (token: string) => void;
  setUser: (user: any) => void; // Replace 'any' with a proper user type
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  isAuthenticated: false,
  setToken: (token) => set({ token, isAuthenticated: !!token }),
  setUser: (user) => set({ user }),
  logout: () => set({ token: null, user: null, isAuthenticated: false }),
}));
