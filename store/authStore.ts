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
        let expiry: number;

        if (expiresIn) {
          // Current time + duration from backend
          expiry = Date.now() + expiresIn * 1000;
        } else {
          // Fallback: Decode the JWT if the backend didn't provide expires_in
          const payload = JSON.parse(atob(token.split('.')[1]));
          expiry = payload.exp * 1000;
        }

        set({
          token,
          tokenExpiresAt: expiry,
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
