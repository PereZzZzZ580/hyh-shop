"use client";

import { create } from "zustand";
import { apiFetch } from "@/lib/api";
import type { Cart, CartItem } from "@/types/cart";


type CartState = {
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
  items: [],
  fetch: async () => {
    const cart = await apiFetch<Cart>("/cart");
    set({ items: cart.items });
  },
  addItem: async (variantId, qty = 1) => {
    const cart = await apiFetch<Cart>("/cart/items", {
      method: "POST",
      body: JSON.stringify({ variantId, qty }),
    });
    set({ items: cart.items });
  },
  removeItem: async (itemId) => {
    const cart = await apiFetch<Cart>(`/cart/items/${itemId}`, {
      method: "DELETE",
    });
    set({ items: cart.items });
  },
  updateQty: async (itemId, qty) => {
    const cart = await apiFetch<Cart>(`/cart/items/${itemId}`, {
      method: "PUT",
      body: JSON.stringify({ qty }),
    });
    set({ items: cart.items });
  },
  clear: () => set({ items: [] }),
  count: () => get().items.reduce((acc, i) => acc + i.qty, 0),
  total: () => get().items.reduce((acc, i) => acc + i.qty * i.priceSnapshot, 0),
}));
