"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import AddToCart from "@/components/product/AddToCart";
import type { Product, Variant } from "@/types/product";

function atributosStr(attrs: Variant["attributes"]) {
  return Object.entries(attrs)
    .map(([k, v]) => `${k}: ${v}`)
    .join(", ");
}

export default function ProductDetail({ product }: { product: Product }) {
  const [variant, setVariant] =
      useState<Variant | null>(product.variants[0] ?? null);
    const imagenes = variant?.media?.length ? variant.media : product.images;
    const [indiceImg, setIndiceImg] = useState(0);

    useEffect(() => {
      setIndiceImg(0);
    }, [variant]);

  const imagen = imagenes[indiceImg]?.url;
  return (
    <section className="grid md:grid-cols-2 gap-8">
      <div>
        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-white/10">
          {imagen && (
            <Image src={imagen} alt={product.name} fill className="object-cover" />
          )}
        </div>
        {imagenes.length > 1 && (
          <div className="flex gap-2 mt-2">
            {imagenes.map((img, idx) => (
              <button
                key={img.id ?? idx}
                onClick={() => setIndiceImg(idx)}
                className={`relative w-16 h-16 rounded-md overflow-hidden border ${
                  idx === indiceImg ? "border-white/50" : "border-white/10"
                }`}
              >
                <Image
                  src={img.url}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      <div>
        <h1 className="text-3xl font-bold">{product.name}</h1>
        <p className="mt-2 opacity-80">Categoría: {product.category.name}</p>
          {product.description && (
            <p className="mt-4 opacity-80">{product.description}</p>
          )}
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
                  setVariant(
                    product.variants.find((v) => v.id === e.target.value) || null,
                  )
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
