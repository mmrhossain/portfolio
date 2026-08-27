"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authApi } from "@/lib/api/auth";
import type { User } from "@/types";

/**
 * Cookie-based auth: the accessToken and refreshToken live ONLY in HttpOnly
 * cookies managed by the browser. This store keeps just the non-sensitive UI
 * auth state (the current user + status). It never holds JWT tokens.
 */
interface AuthState {
  user: User | null;
  status: "idle" | "loading" | "authenticated" | "unauthenticated";
  login: (email: string, password: string) => Promise<User>;
  register: (name: string, email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  refresh: () => Promise<User | null>;
  setUser: (user: User | null) => void;
  reset: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      status: "idle",

      setUser: (user) =>
        set({ user, status: user ? "authenticated" : "unauthenticated" }),

      login: async (email, password) => {
        const response = await authApi.login({ email, password });
        set({ user: response.data.user, status: "authenticated" });
        return response.data.user;
      },

      register: async (name, email, password) => {
        const response = await authApi.register({ name, email, password });
        set({ user: response.data.user, status: "authenticated" });
        return response.data.user;
      },

      refresh: async () => {
        set({ status: "loading" });
        try {
          const response = await authApi.refresh();
          set({ user: response.data.user, status: "authenticated" });
          return response.data.user;
        } catch {
          set({ user: null, status: "unauthenticated" });
          return null;
        }
      },

      logout: async () => {
        try {
          await authApi.logout();
        } finally {
          set({ user: null, status: "unauthenticated" });
        }
      },

      reset: () => {
        set({ user: null, status: "unauthenticated" });
      },
    }),
    {
      name: "devmonir-auth",
      // Persist only the non-sensitive user for UI hydration. No tokens.
      partialize: (state) => ({
        user: state.user,
      }),
    },
  ),
);
