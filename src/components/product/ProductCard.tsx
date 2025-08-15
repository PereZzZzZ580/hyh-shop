"use client";

import { useCart } from "@/store/cart";
import type { Product } from "@/types/product";
import Image from "next/image";
import Link from "next/link";

export default function ProductCard({ product }: { product: Product }) {
  const addItem = useCart((s) => s.addItem);
  const variant = product.variants[0];
  const image = product.images[0]?.url;
  const sinStock = !variant || variant.stock < 1;
  const oferta =
    variant && variant.compareAtPrice && variant.compareAtPrice > variant.price;

  return (
    <div className="group bg-surface border border-border rounded-xl p-[18px] md:p-[22px] hover:border-gold hover:shadow-gold">
      <Link href={`/producto/${product.slug}`}>
          <div className="relative overflow-hidden rounded-xl border border-gold/25 h-[220px] md:h-[300px]">
          {image ? (
            <Image
              src={image}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-[1.04]"
            />
          ) : (
            <Image
              src="/file.svg"
              alt="Sin imagen"
              fill
              className="object-contain p-8 opacity-50 group-hover:scale-[1.04]"
            />
          )}
          {oferta && (
            <span className="absolute top-2 left-2 bg-gold text-black text-[11px] font-medium px-2 py-[2px] rounded-full">
              Oferta
            </span>
          )}
        </div>
        </Link>
      <Link href={`/producto/${product.slug}`} className="block mt-4">
        <h3 className="text-white text-[16px] md:text-[18px] font-medium">
          {product.name}
        </h3>
      </Link>
      {variant && (
        <p className="mt-2 text-gold text-[16px] md:text-[18px]">
          ${variant.price.toLocaleString("es-CO")}
        </p>
      )}
      {variant && (
        <button
          onClick={() => addItem(variant.id, 1)}
          disabled={sinStock}
          className="mt-4 w-full h-9 rounded-xl bg-gold text-black hover:bg-gold600 hover:shadow-gold disabled:opacity-50"
        >
          {sinStock ? "Sin stock" : "Añadir"}
        </button>
      )}
    </div>
  );
}
