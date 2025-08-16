"use client";

import { useState } from "react";
import { useCart } from "@/store/cart";

export default function AddToCart({ variantId, stock }: { variantId: string; stock: number }) {
  const add = useCart((s) => s.addItem);
  const [qty, setQty] = useState(1);
  const max = Math.max(1, stock);

  return (
    <div className="flex gap-3">
      <input
        type="number"
        min={1}
        max={stock}
        value={qty}
        onChange={(e) =>
          setQty(Math.max(1, Math.min(Number(e.target.value), max)))
        }
        className="w-20 h-10 rounded-lg bg-transparent border border-white/20 text-center"
        disabled={stock < 1}
      />
      <button
        onClick={() => add(variantId, qty)}
        disabled={stock < 1}
        className="h-10 px-4 rounded-lg border border-white/15 hover:border-white/30 disabled:opacity-50"
      >
        {stock < 1 ? "Sin stock" : "Agregar al carrito"}
      </button>
    </div>
  );
}
