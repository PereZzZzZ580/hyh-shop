"use client";

import AddToCart from "@/components/product/AddToCart";
import ProductCard from "@/components/product/ProductCard";
import type { Product, Variant } from "@/types/product";
import { useEffect, useState } from "react";

function atributosStr(attrs: Variant["attributes"]) {
  return Object.entries(attrs)
    .map(([k, v]) => `${k}: ${v}`)
    .join(", ");
}

export default function ProductDetail({ product }: { product: Product }) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

  // Usamos la primera variante por defecto
  const [variant, setVariant] =
    useState<Variant | null>(product.variants[0] ?? null);

  const [related, setRelated] = useState<Product[]>([]);

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

  return (
    <div className="container mx-auto px-4">
      <nav className="mb-4 text-sm opacity-80">
        Inicio / Productos / {product.category.name} / {product.name}
      </nav>

      {/* Solo el panel de detalle (sin galería propia) */}
      <section className="gap-12">
        <div className="lg:sticky lg:top-24 rounded-2xl border border-white/10 bg-black/55 backdrop-blur-md p-6 space-y-4">
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
                <div className="mt-4 flex flex-wrap gap-2">
                  {product.variants.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setVariant(v)}
                      className={`rounded-xl border px-3 py-2 text-sm ${
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
                <AddToCart
                  variantId={variant.id}
                  stock={variant.stock}
                  variantInfo={{
                    price: variant.price,
                    compareAtPrice: variant.compareAtPrice ?? undefined,
                    attributes: variant.attributes,
                    product: { name: product.name, slug: product.slug, brand: product.brand ?? undefined },
                  }}
                />
              </div>
            </>
          )}

          <details className="border-t border-white/10 p-4">
            <summary className="cursor-pointer font-medium">
              Envíos y cobertura
            </summary>
            <p className="mt-2 text-sm opacity-80">
              Armenia/Calarcá contraentrega. Resto del país por transportadora.
            </p>
          </details>

          <details className="border-t border-white/10 p-4">
            <summary className="cursor-pointer font-medium">
              Cambios y devoluciones
            </summary>
            <p className="mt-2 text-sm opacity-80">
              Aceptamos cambios dentro de los 5 días con factura.
            </p>
          </details>

          <details className="border-t border-white/10 p-4">
            <summary className="cursor-pointer font-medium">Pagos</summary>
            <p className="mt-2 text-sm opacity-80">
              Efectivo, transferencias y datáfono.
            </p>
          </details>
        </div>
      </section>

      {related.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-4 text-xl font-semibold">
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
    </div>
  );
}
