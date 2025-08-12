"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

type AuthState = {
  token: string | null;
  setToken: (token: string) => void;
  clear: () => void;
};

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      setToken: (token) => {
        document.cookie = `token=${token}; path=/`;
        set({ token });
      },
      clear: () => {
        document.cookie = "token=; path=/; max-age=0";
        set({ token: null });
      },
    }),
    { name: "hyh-auth" }
  )
);