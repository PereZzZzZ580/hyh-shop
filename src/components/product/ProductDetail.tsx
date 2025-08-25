"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import AddToCart from "@/components/product/AddToCart";
import ProductCard from "@/components/product/ProductCard";
import type { Product, Variant } from "@/types/product";

function atributosStr(attrs: Variant["attributes"]) {
  return Object.entries(attrs)
    .map(([k, v]) => `${k}: ${v}`)
    .join(", ");
}

export default function ProductDetail({ product }: { product: Product }) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
  const [variant, setVariant] =
    useState<Variant | null>(product.variants[0] ?? null);
  const imagenes = variant?.media?.length ? variant.media : product.images;
  const [indiceImg, setIndiceImg] = useState(0);
  const [related, setRelated] = useState<Product[]>([]);

  useEffect(() => {
    setIndiceImg(0);
  }, [variant]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight")
        setIndiceImg((i) => (i + 1) % imagenes.length);
      if (e.key === "ArrowLeft")
        setIndiceImg((i) => (i - 1 + imagenes.length) % imagenes.length);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [imagenes.length]);

  useEffect(() => {
    const fetchRelated = async () => {
      try {
        const res = await fetch(
          `${API_URL}/products?category=${product.category.slug}`,
        );
        if (!res.ok) return;
        const data: Product[] = await res.json();
        setRelated(data.filter((p) => p.id !== product.id));
      } catch {
        // ignore
      }
    };
    fetchRelated();
  }, [API_URL, product]);

  const imagen = imagenes[indiceImg]?.url;
  return (
    <section>
      <nav className="mb-4 text-sm opacity-80">
        Inicio / Productos / {product.category.name} / {product.name}
      </nav>
      <div className="grid lg:grid-cols-2 gap-10">
        <div className="grid grid-cols-[96px_1fr] gap-4">
          <div className="flex lg:flex-col gap-3">
            {imagenes.map((img, idx) => (
              <button
                key={img.id ?? idx}
                onClick={() => setIndiceImg(idx)}
                className={`h-20 w-20 rounded-xl overflow-hidden ring-1 ${
                  idx === indiceImg ? "ring-gold/60" : "ring-white/10"
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
          <div className="relative aspect-[4/5] rounded-2xl overflow-hidden border border-white/10 group">
            {imagen && (
              <Image
                src={imagen}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              />
            )}
          </div>
        </div>

        <div className="lg:sticky lg:top-24 space-y-4">
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="opacity-80">Categoría: {product.category.name}</p>
          {product.description && (
            <p className="opacity-80">{product.description}</p>
          )}
          {variant && (
            <>
              <p className="text-2xl font-semibold">
                ${variant.price.toLocaleString("es-CO")}
              </p>
              <p className="text-sm opacity-80">Stock: {variant.stock}</p>
              {product.variants.length > 1 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {product.variants.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setVariant(v)}
                      className={`px-3 py-2 rounded-xl border text-sm ${
                        variant?.id === v.id
                          ? "border-gold bg-gold/10"
                          : "border-white/15 hover:border-gold/60"
                      }`}
                    >
                      {atributosStr(v.attributes)}
                    </button>
                  ))}
                </div>
              )}
              <div className="mt-6">
                <AddToCart variantId={variant.id} stock={variant.stock} />
              </div>
            </>
          )}
          <details className="p-4 border-t border-white/10">
            <summary className="cursor-pointer font-medium">
              Envíos y cobertura
            </summary>
            <p className="mt-2 opacity-80 text-sm">
              Armenia/Calarcá contraentrega. Resto del país por transportadora.
            </p>
          </details>
          <details className="p-4 border-t border-white/10">
            <summary className="cursor-pointer font-medium">
              Cambios y devoluciones
            </summary>
            <p className="mt-2 opacity-80 text-sm">
              Aceptamos cambios dentro de los 5 días con factura.
            </p>
          </details>
          <details className="p-4 border-t border-white/10">
            <summary className="cursor-pointer font-medium">Pagos</summary>
            <p className="mt-2 opacity-80 text-sm">
              Efectivo, transferencias y datáfono.
            </p>
          </details>
        </div>
      </div>
      {related.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl font-semibold mb-4">
            También te puede gustar
          </h2>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {related.map((p) => (
              <div key={p.id} className="min-w-[200px]">
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </section>
      )}
    </section>
  );
}
