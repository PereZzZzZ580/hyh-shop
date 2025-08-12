"use client";

import { useState } from "react";
import Image from "next/image";
import AddToCart from "@/components/product/AddToCart";
import type { Product, Variant } from "@/types/product";

function atributosStr(attrs: Record<string, string>) {
  return Object.entries(attrs)
    .map(([k, v]) => `${k}: ${v}`)
    .join(", ");
}

export default function ProductDetail({ product }: { product: Product }) {
  const [variant, setVariant] = useState<Variant | null>(product.variants[0] ?? null);
  const image = variant?.media?.[0]?.url || product.images[0]?.url;

  return (
    <section className="grid md:grid-cols-2 gap-8">
      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-white/10">
        {image && <Image src={image} alt={product.name} fill className="object-cover" />}
      </div>

      <div>
        <h1 className="text-3xl font-bold">{product.name}</h1>
        <p className="mt-2 opacity-80">Categoría: {product.category.name}</p>
        {variant && (
          <>
            <p className="mt-4 text-2xl font-semibold">
              ${variant.price.toLocaleString("es-CO")}
            </p>
            <p className="mt-1 text-sm opacity-80">Stock: {variant.stock}</p>
            {product.variants.length > 1 && (
              <select
                value={variant.id}
                onChange={(e) =>
                  setVariant(product.variants.find((v) => v.id === e.target.value) || null)
                }
                className="mt-4 w-full h-10 bg-transparent border border-white/20 rounded-lg px-2"
              >
                {product.variants.map((v) => (
                  <option key={v.id} value={v.id} className="text-black">
                    {atributosStr(v.attributes)}
                  </option>
                ))}
              </select>
            )}
            <div className="mt-6">
              <AddToCart variantId={variant.id} stock={variant.stock} />
            </div>
          </>
        )}
      </div>
    </section>
  );
}
