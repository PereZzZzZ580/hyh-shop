"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "@/store/cart";

export default function Header() {
  const [mounted, setMounted] = useState(false);
  const fetchCart = useCart((s) => s.fetch);
  useEffect(() => {
    setMounted(true);
    fetchCart();
  }, [fetchCart]);

  const count = useCart((s) => s.count());

  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-black/60 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
        <Link href="/" className="font-bold tracking-wide text-xl">HYH SHOP</Link>

        <nav className="flex items-center gap-6">
          <Link href="/catalogo" className="opacity-80 hover:opacity-100">Catálogo</Link>
          <Link href="/carrito" className="relative">
            Carrito
            <span
              className="ml-2 inline-flex items-center justify-center rounded-full text-xs px-2 py-0.5 bg-white/10"
              suppressHydrationWarning
              aria-live="polite"
            >
              {mounted ? count : 0}
            </span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
