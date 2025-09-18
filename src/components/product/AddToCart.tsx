"use client";

import { useState } from "react";
import { useCart } from "@/store/cart";

type VariantInfo = {
  price: number;
  compareAtPrice?: number | null;
  attributes: Record<string, string>;
  product: { name: string; slug: string; brand?: string | null };
};

export default function AddToCart({
  variantId,
  stock,
  variantInfo,
}: {
  variantId: string;
  stock: number;
  variantInfo?: VariantInfo;
}) {
  const add = useCart((s) => s.addItem);
  const [qty, setQty] = useState(1);
  const [showToast, setShowToast] = useState(false);
  const max = Math.max(1, stock);

  const handleAdd = async () => {
    const snapshot = variantInfo
      ? {
          priceSnapshot: variantInfo.price,
          variant: {
            id: variantId,
            price: variantInfo.price,
            compareAtPrice: variantInfo.compareAtPrice ?? null,
            stock: stock,
            attributes: variantInfo.attributes,
            product: variantInfo.product,
          },
        }
      : undefined;
    await add(variantId, qty, snapshot);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  return (
    <div className="flex flex-col gap-3 relative">
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
          onClick={handleAdd}
          disabled={stock < 1}
          className="h-10 px-4 rounded-lg border border-yellow-400 hover:border-yellow-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400/60 disabled:opacity-50"
        >
          {stock < 1 ? "Sin stock" : "Agregar al carrito"}
        </button>
      </div>

      {showToast && (
        <div className="absolute top-0 right-0 bg-yellow-400 text-black px-4 py-2 rounded shadow-lg font-semibold z-50">
          ¡Producto agregado con éxito!
        </div>
      )}
    </div>
  );
}
