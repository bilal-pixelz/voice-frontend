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

      setToken: (token) => {
        // decode expiry from JWT payload
        try {
          const payload = JSON.parse(atob(token.split(".")[1]));
          set({
            token,
            tokenExpiresAt: payload.exp * 1000, // convert to ms
            isAuthenticated: true,
          });
        } catch (error) {
          // If JWT parsing fails, just set the token without expiry
          set({
            token,
            isAuthenticated: true,
          });
        }
      },

      setUser: (user) =>
        set({ user }),

      isTokenExpired: () => {
        const { token, tokenExpiresAt } = get();
        if (!token) return false;           // no token = not expired, just not logged in
        if (!tokenExpiresAt) return false;  // no expiry stored = assume valid
        return Date.now() > tokenExpiresAt - 60000;
      },

      logout: () =>
        set({ token: null, tokenExpiresAt: null, user: null, isAuthenticated: false }),
    }),
    {
      name: "auth-storage", // persists to localStorage
      partialize: (state) => ({
        token: state.token,
        tokenExpiresAt: state.tokenExpiresAt,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
