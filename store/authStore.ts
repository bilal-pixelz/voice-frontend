import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "@/types/user";

interface AuthState {
  token: string | null;
  tokenExpiresAt: number | null;
  user: User | null;
  isAuthenticated: boolean;
  setToken: (token: string) => void;
  setUser: (user: User) => void;
  isTokenExpired: () => boolean;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      tokenExpiresAt: null,
      user: null,
      isAuthenticated: false,

      setToken: (token: string, expiresIn?: number) => {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const expiry = payload.exp * 1000;

        set({
          token,
          tokenExpiresAt: expiresIn ? Date.now() + expiresIn * 1000 : expiry,
          isAuthenticated: true,
        });
      },

      setUser: (user) =>
        set({ user }),

      isTokenExpired: () => {
        const { token, tokenExpiresAt } = get();
        if (!token || !tokenExpiresAt) return true;
        return Date.now() > tokenExpiresAt - 60000;
      },

      logout: () =>
        set({ token: null, tokenExpiresAt: null, user: null, isAuthenticated: false }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        token: state.token,
        tokenExpiresAt: state.tokenExpiresAt,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
