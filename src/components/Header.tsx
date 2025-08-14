"use client";

import { useCart } from "@/store/cart";
import { Facebook, Instagram, Menu, ShoppingCart, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Header() {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const fetchCart = useCart((s) => s.fetch);

  useEffect(() => {
    setMounted(true);
    fetchCart();
  }, [fetchCart]);

  const count = useCart((s) => s.count());

  return (
    <header className="sticky top-0 z-20 h-20 backdrop-blur bg-[rgba(0,0,0,0.65)] border-b border-[rgba(255,215,0,0.08)]">
      <div className="container h-full flex items-center justify-between">
        <Link href="/" className="flex items-center header-logo">
          <Image src="/logo_barberia.png" alt="H&H Shop" width={160} height={70} priority />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 font-semibold text-[15px] md:text-[16px] text-gold">
          <Link href="/" className="hover:underline hover:underline-offset-4 hover:shadow-gold">Inicio</Link>
          <Link href="/servicios" className="hover:underline hover:underline-offset-4 hover:shadow-gold">Servicios</Link>
          <Link href="/productos" className="hover:underline hover:underline-offset-4 hover:shadow-gold">Productos</Link>
          <Link href="/tienda" className="hover:underline hover:underline-offset-4 hover:shadow-gold">Nuestra Tienda</Link>
          <Link href="/contacto" className="hover:underline hover:underline-offset-4 hover:shadow-gold">Contacto</Link>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="text-gold hover:shadow-gold"
          >
            <Instagram size={22} />
          </Link>
          <Link
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            className="text-gold hover:shadow-gold"
          >
            <Facebook size={22} />
          </Link>
          <Link href="/carrito" aria-label="Carrito" className="relative text-gold hover:shadow-gold">
            <ShoppingCart className="h-6 w-6" />
            <span
              className="absolute -top-1 -right-1 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-gold text-black text-xs"
              suppressHydrationWarning
              aria-live="polite"
            >
              {mounted ? count : 0}
            </span>
          </Link>
          <Link
            href="/ingresar"
            className="bg-gold text-black px-4 py-2 rounded-radius hover:bg-gold-600 hover:shadow-gold"
          >
            Login
          </Link>
          <Link
            href="/registrarse"
            className="border-2 border-gold text-gold px-4 py-2 rounded-radius hover:bg-gold hover:text-black"
          >
            Registrarse
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gold"
          onClick={() => setOpen(true)}
          aria-label="Abrir menú"
        >
          <Menu size={24} />
        </button>

        {open && (
          <div className="fixed inset-0 z-30 bg-black/80">
            <div className="fixed top-0 right-0 h-full w-64 bg-bg p-6 flex flex-col gap-6">
              <button
                className="self-end text-gold"
                onClick={() => setOpen(false)}
                aria-label="Cerrar menú"
              >
                <X size={24} />
              </button>
              <nav className="flex flex-col gap-4 font-semibold text-gold text-[16px]">
                <Link href="/" onClick={() => setOpen(false)} className="hover:underline hover:underline-offset-4 hover:shadow-gold">Inicio</Link>
                <Link href="/servicios" onClick={() => setOpen(false)} className="hover:underline hover:underline-offset-4 hover:shadow-gold">Servicios</Link>
                <Link href="/productos" onClick={() => setOpen(false)} className="hover:underline hover:underline-offset-4 hover:shadow-gold">Productos</Link>
                <Link href="/tienda" onClick={() => setOpen(false)} className="hover:underline hover:underline-offset-4 hover:shadow-gold">Nuestra Tienda</Link>
                <Link href="/contacto" onClick={() => setOpen(false)} className="hover:underline hover:underline-offset-4 hover:shadow-gold">Contacto</Link>
              </nav>
              <div className="mt-auto flex flex-col gap-4 text-gold">
                <Link
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setOpen(false)}
                >
                  Instagram
                </Link>
                <Link
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setOpen(false)}
                >
                  Facebook
                </Link>
                <Link href="/carrito" onClick={() => setOpen(false)} className="relative">
                  <span>Carrito</span>
                  <span
                    className="absolute -top-2 -right-4 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-gold text-black text-xs"
                    suppressHydrationWarning
                    aria-live="polite"
                  >
                    {mounted ? count : 0}
                  </span>
                </Link>
                <Link
                  href="/ingresar"
                  onClick={() => setOpen(false)}
                  className="bg-gold text-black px-4 py-2 rounded-radius text-center hover:bg-gold-600 hover:shadow-gold"
                >
                  Login
                </Link>
                <Link
                  href="/registrarse"
                  onClick={() => setOpen(false)}
                  className="border-2 border-gold text-gold px-4 py-2 rounded-radius text-center hover:bg-gold hover:text-black"
                >
                  Registrarse
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
