"use client";

import { apiFetch } from "@/lib/api";
import type { Cart, CartItem } from "@/types/cart";
import { create } from "zustand";


type CartState = {
  id: string | null;
  items: CartItem[];
  fetch: () => Promise<void>;
  addItem: (variantId: string, qty?: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  updateQty: (itemId: string, qty: number) => Promise<void>;
  clear: () => void;
  count: () => number;
  total: () => number;
};

export const useCart = create<CartState>()((set, get) => ({
  id: null,
  items: [],
  fetch: async () => {
    try {
      const cart = await apiFetch<Cart>("/cart");
      set({ id: cart.id, items: cart.items });
    } catch {
      set({ id: null, items: [] });
    }
  },
  addItem: async (variantId, qty = 1) => {
    const cart = await apiFetch<Cart>("/cart/items", {
      method: "POST",
      body: JSON.stringify({ variantId, qty }),
    });
    set({ id: cart.id, items: cart.items });
  },
  removeItem: async (itemId) => {
    const cart = await apiFetch<Cart>(`/cart/items/${itemId}`, {
      method: "DELETE",
    });
    set({ id: cart.id, items: cart.items });
  },
  updateQty: async (itemId, qty) => {
    const cart = await apiFetch<Cart>(`/cart/items/${itemId}`, {
      method: "PUT",
      body: JSON.stringify({ qty }),
    });
    set({ id: cart.id, items: cart.items });
  },
  clear: () => set({ items: [], id: null }),
  count: () => get().items.reduce((acc, i) => acc + i.qty, 0),
  total: () =>
     get().items.reduce((acc, i) => acc + i.qty * i.product.price, 0),
}));
