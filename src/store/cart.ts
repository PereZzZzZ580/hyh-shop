"use client";

import { apiFetchAuth } from "@/lib/api";
import type { Cart, CartItem, CartVariant } from "@/types/cart";
import { create } from "zustand";
import { useAuth } from "./auth";


type CartState = {
  id: string | null;
  items: CartItem[];
  fetch: () => Promise<void>;
  addItem: (
    variantId: string,
    qty?: number,
    snapshot?: { variant: CartVariant; priceSnapshot: number }
  ) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  updateQty: (itemId: string, qty: number) => Promise<void>;
  clear: () => void;
  persistLocal: () => void;
  mergeLocalToServer: () => Promise<void>;
  count: () => number;
  total: () => number;
};

export const useCart = create<CartState>()((set, get) => ({
  id: null,
  items: [],
  fetch: async () => {
    const isAuth = useAuth.getState().autenticado;
    // Helpers for local storage
    const readLocal = (): CartItem[] => {
      if (typeof window === "undefined") return [];
      try {
        const raw = window.localStorage.getItem("hyh-cart");
        if (!raw) return [];
        const data = JSON.parse(raw);
        return Array.isArray(data?.items) ? (data.items as CartItem[]) : [];
      } catch {
        return [];
      }
    };

    if (isAuth) {
      try {
        const cart = await apiFetchAuth<Cart>("/cart");
        set({ id: cart.id, items: cart.items });
        // If there are local items and server cart is empty, try merge
        const localItems = readLocal();
        if (localItems.length > 0 && cart.items.length === 0) {
          await get().mergeLocalToServer();
        }
      } catch {
        set({ id: null, items: [] });
      }
    } else {
      const items = readLocal();
      set({ id: null, items });
    }
  },
  addItem: async (variantId, qty = 1, snapshot) => {
    const isAuth = useAuth.getState().autenticado;
    if (isAuth) {
      const cart = await apiFetchAuth<Cart>("/cart/items", {
        method: "POST",
        body: JSON.stringify({ variantId, qty }),
      });
      set({ id: cart.id, items: cart.items });
      return;
    }
    // Guest mode: require snapshot to build item
    if (!snapshot) {
      console.error("Snapshot required to add item in guest mode");
      return;
    }
    const idGen = typeof crypto !== "undefined" && (crypto as any).randomUUID ? (crypto as any).randomUUID() : `local-${Date.now()}-${Math.random()}`;
    const existing = get().items.find((i) => i.variantId === variantId);
    let newItems: CartItem[];
    if (existing) {
      newItems = get().items.map((i) =>
        i.variantId === variantId ? { ...i, qty: i.qty + qty } : i
      );
    } else {
      newItems = [
        ...get().items,
        {
          id: idGen as string,
          variantId,
          qty,
          priceSnapshot: snapshot.priceSnapshot,
          variant: snapshot.variant,
        },
      ];
    }
    set({ id: null, items: newItems });
    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem("hyh-cart", JSON.stringify({ items: newItems }));
      } catch {}
    }
  },
  removeItem: async (itemId) => {
    const isAuth = useAuth.getState().autenticado;
    if (isAuth) {
      const cart = await apiFetchAuth<Cart>(`/cart/items/${itemId}`, {
        method: "DELETE",
      });
      set({ id: cart.id, items: cart.items });
      return;
    }
    const newItems = get().items.filter((i) => i.id !== itemId);
    set({ id: null, items: newItems });
    if (typeof window !== "undefined") {
      try { window.localStorage.setItem("hyh-cart", JSON.stringify({ items: newItems })); } catch {}
    }
  },
  updateQty: async (itemId, qty) => {
    const isAuth = useAuth.getState().autenticado;
    if (isAuth) {
      const cart = await apiFetchAuth<Cart>(`/cart/items/${itemId}`, {
        method: "PUT",
        body: JSON.stringify({ qty }),
      });
      set({ id: cart.id, items: cart.items });
      return;
    }
    const newItems = get().items.map((i) => (i.id === itemId ? { ...i, qty } : i));
    set({ id: null, items: newItems });
    if (typeof window !== "undefined") {
      try { window.localStorage.setItem("hyh-cart", JSON.stringify({ items: newItems })); } catch {}
    }
  },
  clear: () => {
    set({ items: [], id: null });
    if (typeof window !== "undefined") {
      try { window.localStorage.removeItem("hyh-cart"); } catch {}
    }
  },
  persistLocal: () => {
    if (typeof window === "undefined") return;
    try {
      const items = get().items;
      window.localStorage.setItem("hyh-cart", JSON.stringify({ items }));
    } catch {}
  },
  mergeLocalToServer: async () => {
    const isAuth = useAuth.getState().autenticado;
    if (!isAuth) return;
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem("hyh-cart");
      if (!raw) return;
      const data = JSON.parse(raw);
      const items = (Array.isArray(data?.items) ? data.items : []) as CartItem[];
      for (const it of items) {
        await apiFetchAuth<Cart>("/cart/items", {
          method: "POST",
          body: JSON.stringify({ variantId: it.variantId, qty: it.qty }),
        });
      }
      window.localStorage.removeItem("hyh-cart");
      const cart = await apiFetchAuth<Cart>("/cart");
      set({ id: cart.id, items: cart.items });
    } catch {}
  },
  count: () => get().items.reduce((acc, i) => acc + i.qty, 0),
  total: () =>
     get().items.reduce(
      (acc, i) => acc + i.qty * (i.variant?.price?? i.priceSnapshot),
       0
      ),
}));
