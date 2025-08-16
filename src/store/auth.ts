"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

type AuthState = {
  autenticado: boolean;
  setAutenticado: (valor: boolean) => void;
};

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      autenticado: false,
      setAutenticado: (valor) => set({ autenticado: valor }),
    }),
    { name: "hyh-auth" }
  )
);
