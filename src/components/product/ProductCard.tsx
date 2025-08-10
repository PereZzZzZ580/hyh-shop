"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/store/cart";
import type { Product } from "@/types/product";

export default function ProductCard({ product }: { product: Product }) {
  const addItem = useCart((s) => s.addItem);

  return (
    <div className="rounded-2xl overflow-hidden border border-white/10">
      <div className="relative aspect-[4/3]">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover"
        />
      </div>

      <div className="p-4">
        <h3 className="font-medium">{product.name}</h3>
        <p className="mt-1 opacity-80">
          ${product.price.toLocaleString("es-CO")}
        </p>

        <div className="mt-3 grid grid-cols-2 gap-2">
          <Link
            href={`/producto/${product.id}`}
            className="h-9 rounded-lg border border-white/15 hover:border-white/30 inline-flex items-center justify-center"
          >
            Ver detalle
          </Link>

          <button
            onClick={() => addItem(product, 1)}
            className="h-9 rounded-lg border border-white/15 hover:border-white/30"
          >
            Agregar al carrito
          </button>
        </div>
      </div>
    </div>
  );
}
