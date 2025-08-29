"use client";

import { useCart } from "@/store/cart";
import type { Product } from "@/types/product";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/store/auth";
import { useRouter } from "next/navigation";

export default function ProductCard({ product }: { product: Product }) {
  const addItem = useCart((s) => s.addItem);
  const { autenticado } = useAuth();
  const router = useRouter();
  const variant = product.variants[0];
  const image = product.images[0]?.url;
  const sinStock = !variant || variant.stock < 1;
  const oferta =
    variant && variant.compareAtPrice && variant.compareAtPrice > variant.price;
  const [showToast, setShowToast] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [showModal, setShowModal] = useState(false);

  return (
    <article className="relative group rounded-2xl border border-yellow-400/15 bg-black/40 shadow-[0_0_30px_-10px_rgba(212,175,55,0.25)] hover:shadow-[0_0_40px_-10px_rgba(212,175,55,0.45)] overflow-hidden transition-shadow duration-300 motion-safe:transition-transform motion-safe:duration-300 motion-safe:hover:-translate-y-0.5">
      <Link href={`/producto/${product.slug}`}>
        <div className="relative">
          {image ? (
            <Image
              src={image}
              alt={product.name}
              width={400}
              height={300}
              className="aspect-[4/3] w-full object-cover transition-transform duration-500 will-change-transform group-hover:scale-105"
            />
          ) : (
            <Image
              src="/file.svg"
              alt="Sin imagen"
              width={400}
              height={300}
              className="aspect-[4/3] w-full object-contain p-8 opacity-50 transition-transform duration-500 will-change-transform group-hover:scale-105"
            />
          )}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-gradient-to-t from-black/60 via-black/0 to-black/0" />
          {oferta && (
            <span className="absolute top-2 left-2 bg-yellow-400 text-black text-[11px] font-medium px-2 py-[2px] rounded-full">
              Oferta
            </span>
          )}
        </div>
      </Link>
      <div className="p-5">
        <Link href={`/producto/${product.slug}`} className="block">
          <h3 className="font-serif text-xl text-yellow-100">{product.name}</h3>
        </Link>
        {variant && (
          <p className="mt-1 text-neutral-300">
            ${variant.price.toLocaleString("es-CO")}
            {oferta && (
              <span className="ml-2 text-neutral-500 line-through">
                ${variant.compareAtPrice?.toLocaleString("es-CO")}
              </span>
            )}
          </p>
        )}
        {variant && (
          <button
            onClick={async () => {
              if (isAdding) return;
              // Si no está autenticado, mostrar modal y salir
              if (!autenticado) {
                setShowModal(true);
                return;
              }
              setIsAdding(true);
              try {
                await addItem(variant.id, 1);
                setShowToast(true);
                setTimeout(() => setShowToast(false), 1200);
              } finally {
                setIsAdding(false);
              }
            }}
            disabled={sinStock}
            className="mt-4 w-full rounded-full border border-yellow-400/50 py-2 text-yellow-100 hover:bg-yellow-400 hover:text-black transition disabled:opacity-50 motion-safe:transition-transform motion-safe:duration-200 active:scale-[0.98]"
          >
            {sinStock
              ? "Sin stock"
              : isAdding
                ? (
                  <span className="inline-flex items-center gap-2">
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                    </svg>
                    Añadiendo...
                  </span>
                )
                : "Añadir al carrito"}
          </button>
        )}
      </div>
      {showToast && (
        <div className="absolute top-0 right-0 bg-yellow-400 text-black px-4 py-2 rounded shadow-lg font-semibold z-50 animate-[pop_.3s_ease-out]">
          ¡Producto agregado con éxito!
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 opacity-0 animate-[fadeIn_.18s_ease-out_forwards]">
          <div className="bg-[#181818] border border-yellow-400/70 rounded-2xl p-6 sm:p-7 text-center shadow-[var(--shadow-base)] w-[92vw] max-w-md animate-[pop_.22s_ease-out]">
            <h2 className="text-xl font-bold text-yellow-400 mb-4">
              ¡Regístrate o inicia sesión!
            </h2>
            <p className="text-white mb-6">
              Para poder añadir productos al carrito debes registrarte o iniciar sesión.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => {
                  setShowModal(false);
                  router.push("/ingresar");
                }}
                className="inline-flex h-10 px-4 items-center justify-center rounded-lg bg-yellow-400 text-black text-sm font-medium hover:bg-yellow-500 shadow-sm"
              >
                Ingresar
              </button>
              <button
                onClick={() => {
                  setShowModal(false);
                  router.push("/registrarse");
                }}
                className="inline-flex h-10 px-4 items-center justify-center rounded-lg border border-yellow-400 text-yellow-400 text-sm font-medium hover:bg-yellow-400 hover:text-black"
              >
                Registrarse
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="inline-flex h-10 px-4 items-center justify-center rounded-lg border border-white/20 text-white text-sm hover:bg-white/10"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}
