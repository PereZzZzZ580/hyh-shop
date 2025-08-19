"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/types/user";

type AuthState = {
  autenticado: boolean;
  usuario: User | null;
  setAutenticado: (valor: boolean) => void;
  setUsuario: (user: User | null) => void;
};

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      autenticado: false,
      usuario: null,
      setAutenticado: (valor) => set({ autenticado: valor }),
      setUsuario: (user) => set({ usuario: user }),
    }),
    { name: "hyh-auth" }
  )
);
