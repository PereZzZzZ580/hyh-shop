"use client";

import { useState } from "react";
import { useCart } from "../../store/cart";
import type { Product } from "../../types/product";

export default function AddToCart({ product }: { product: Product }) {
  const add = useCart((s) => s.addItem);
  const [qty, setQty] = useState(1);

  return (
    <div className="flex gap-3">
      <input
        type="number"
        min={1}
        value={qty}
        onChange={(e) => setQty(Number(e.target.value))}
        className="w-20 h-10 rounded-lg bg-transparent border border-white/20 text-center"
      />
      <button
        onClick={() => add(product, qty)}
        className="h-10 px-4 rounded-lg border border-white/15 hover:border-white/30"
      >
        Agregar al carrito
      </button>
    </div>
  );
}
