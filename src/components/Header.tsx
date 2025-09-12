"use client";

import { useAuth } from "@/store/auth";
import { useCart } from "@/store/cart";
import { Facebook, Instagram, Menu, ShoppingCart, User, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function Header() {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [menuUsuario, setMenuUsuario] = useState(false);
  const fetchCart = useCart((s) => s.fetch);
  const persistCartLocal = useCart((s) => s.persistLocal);
  const autenticado = useAuth((s) => s.autenticado);
  const usuario = useAuth((s) => s.usuario);
  const setAutenticado = useAuth((s) => s.setAutenticado);
  const setUsuario = useAuth((s) => s.setUsuario);
  const router = useRouter();

  const nombreUsuario = usuario?.name || "Usuario";

  useEffect(() => {
    setMounted(true);
    fetchCart();
    if (autenticado && !usuario) {
      fetch("/api/me")
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data) setUsuario(data);
        })
        .catch(() => {});
    }
  }, [fetchCart, autenticado, usuario, setUsuario]);

  const count = useCart((s) => s.count());

  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const userMenuDesktopRef = useRef<HTMLDivElement>(null);
  const userMenuMobileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    if (open) {
      document.body.style.overflow = "hidden";
      closeButtonRef.current?.focus();
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  useEffect(() => {
    const onDocClick = (e: MouseEvent | TouchEvent) => {
      if (!menuUsuario) return;
      const target = e.target as Node | null;
      const isInsideDesktop = userMenuDesktopRef.current?.contains(target as Node) ?? false;
      const isInsideMobile = userMenuMobileRef.current?.contains(target as Node) ?? false;
      if (!isInsideDesktop && !isInsideMobile) setMenuUsuario(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuUsuario(false);
    };
    document.addEventListener("mousedown", onDocClick, true);
    document.addEventListener("touchstart", onDocClick, true);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick, true);
      document.removeEventListener("touchstart", onDocClick, true);
      window.removeEventListener("keydown", onKey);
    };
  }, [menuUsuario]);
  
  return (
    <>
    <header className="fixed top-0 left-0 right-0 z-50 h-20 w-full backdrop-blur bg-[rgba(0,0,0,0.65)] border-b border-[rgba(255,215,0,0.08)]">
      <div className="container overflow-visible h-full flex items-center justify-between">
    <Link href="/" className="flex items-center mr-4 pl-4 md:pl-6">
      <div className="relative h-26 md:h-20 w-[140px] md:w-[160px] overflow-hidden shrink-0 lg:-translate-y-3">
      <Image
        src="/HYH_Nuevo.png"
        alt="H&H Shop"
        width={180}
        height={72}
        sizes="(min-width: 1024px) 160px, 120px"
        className="h-full w-auto object-contain"
        priority
      />
      </div>
    </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-8 font-semibold text-[15px] md:text-[16px] text-gold">
          <Link href="/" className="hover:underline hover:underline-offset-4 hover:shadow-gold">Inicio</Link>
          <Link href="/servicios" className="hover:underline hover:underline-offset-4 hover:shadow-gold">Servicios</Link>
          <Link href="/productos" className="hover:underline hover:underline-offset-4 hover:shadow-gold">Productos</Link>
          <Link href="/asesor" className="hover:underline hover:underline-offset-4 hover:shadow-gold">Asesor</Link>
          <Link href="/galeria" className="hover:underline hover:underline-offset-4 hover:shadow-gold">Galería</Link>
          <Link href="/tienda" className="hover:underline hover:underline-offset-4 hover:shadow-gold">Nuestra Tienda</Link>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center gap-6">
          <Link
            href="https://www.instagram.com/hhbarberhome/"
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
            {mounted && count > 0 && (
              <span
                className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-gray-300 ring-1 ring-black/40"
                suppressHydrationWarning
                aria-hidden="true"
              />
            )}
          </Link>
          {autenticado ? (
            <div className="relative" ref={userMenuDesktopRef}>
              <button
                onClick={() => setMenuUsuario((m) => !m)}
                className="flex items-center gap-2 text-gold hover:shadow-gold cursor-pointer focus:shadow-gold/50 hover:text-gold/80 focus:text-gold/80 transition-colors"
                aria-label="Menú usuario"
              >
                <User className="h-5 w-5" />
                <span>{nombreUsuario}</span>
              </button>
              <div
                className={`absolute right-0 mt-2 w-56 rounded-xl p-2 flex flex-col z-50 transform transition-all duration-200 origin-top-right bg-black/90 backdrop-blur-sm shadow-2xl ring-1 ring-white/10 ${menuUsuario ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none"}`}
              >
                <Link href="/pedidos" className="hover:underline hover:underline-offset-4 hover:shadow-gold transition-colors">Pedidos</Link>
                <Link href="/mi-cuenta/direcciones" className="hover:underline hover:underline-offset-4 hover:shadow-gold transition-colors">Direcciones</Link>
                {usuario?.role === "ADMIN" && (
                  <Link href="/admin" className="hover:underline hover:underline-offset-4 hover:shadow-gold transition-colors">Panel de Administración</Link>
                )}
                <button
                  onClick={() => {
                    persistCartLocal();
                    fetch("/api/logout", { method: "POST" });
                    setAutenticado(false);
                    setUsuario(null);
                    setMenuUsuario(false);
                    router.push("/");
                  }}
                  className="text-left hover:underline hover:underline-offset-4 hover:shadow-gold transition-colors"
                >
                  Salir
                </button>
              </div>
            </div>
          ) : (
            <>
              <Link
                href="/ingresar"
                className="border-2 border-gold/80 text-gold px-5 py-2.5 rounded-xl hover:bg-gold hover:text-black shadow-[var(--shadow-gold)] hover:shadow-[0_8px_24px_rgba(255,215,0,.35)] transition-colors"
              >
                Iniciar sesión
              </Link>
              <Link
                href="/registrarse"
                className="border-2 border-gold/80 text-gold px-5 py-2.5 rounded-xl hover:bg-gold hover:text-black shadow-[var(--shadow-gold)] hover:shadow-[0_8px_24px_rgba(255,215,0,.35)] transition-colors"
              >
                Registrarse
              </Link>
            </>
          )}
        </div>

        {/* Mobile Actions */}
        <div className="lg:hidden flex items-center gap-4">
          {autenticado ? (
            <div className="relative" ref={userMenuMobileRef}>
              <button
                onClick={() => setMenuUsuario((m) => !m)}
                className="flex items-center gap-2 text-gold hover:shadow-gold cursor-pointer focus:shadow-gold/50 hover:text-gold/80 focus:text-gold/80 transition-colors"
                aria-label="Menú usuario"
              >
                <User className="h-5 w-5" />
                <span className="text-sm">{nombreUsuario}</span>
              </button>
              <div
                className={`absolute right-0 mt-2 w-56 rounded-xl p-2 flex flex-col z-50 transform transition-all duration-200 origin-top-right bg-black/90 backdrop-blur-sm shadow-2xl ring-1 ring-white/10 ${menuUsuario ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none"}`}
              >
                <Link href="/pedidos" className="hover:underline hover:underline-offset-4 hover:shadow-gold transition-colors">Pedidos</Link>
                <Link href="/mi-cuenta/direcciones" className="hover:underline hover:underline-offset-4 hover:shadow-gold transition-colors">Direcciones</Link>
                {usuario?.role === "ADMIN" && (
                  <Link href="/admin" className="hover:underline hover:underline-offset-4 hover:shadow-gold transition-colors">Panel de Administración</Link>
                )}
                <button
                  onClick={() => {
                    fetch("/api/logout", { method: "POST" });
                    setAutenticado(false);
                    setUsuario(null);
                    setMenuUsuario(false);
                    router.push("/");
                  }}
                  className="text-left hover:underline hover:underline-offset-4 hover:shadow-gold transition-colors"
                >
                  Salir
                </button>
              </div>
            </div>
          ) : (
            <Link href="/ingresar" aria-label="Ingresar" className="text-gold hover:shadow-gold">
              <User className="h-5 w-5" />
            </Link>
          )}
          <Link href="/carrito" aria-label="Carrito" className="relative text-gold hover:shadow-gold">
            <ShoppingCart className="h-6 w-6" />
            {mounted && count > 0 && (
              <span
                className="absolute -top-2 -right-2 h-2.5 w-2.5 rounded-full bg-gray-300 ring-1 ring-black/40"
                suppressHydrationWarning
                aria-hidden="true"
              />
            )}
          </Link>
          <button
            className="text-gold transition-transform"
            onClick={() => setOpen(true)}
            aria-label="Abrir menú"
          >
            <Menu size={24} />
          </button>
        </div>
      </div>
    </header>
    <div
      className={`fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      onClick={() => setOpen(false)}
    >
      <div
        className={`fixed top-0 right-0 z-[60] h-full w-3/4 max-w-xs bg-black p-6 pb-8 flex flex-col gap-6 text-gold rounded-l-xl shadow-xl transition-transform duration-300 overflow-y-auto overscroll-contain ${open ? "translate-x-0" : "translate-x-full"}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          ref={closeButtonRef}
          className="self-end text-gold transition-colors"
          onClick={() => setOpen(false)}
          aria-label="Cerrar menú"
        >
          <X size={24} />
        </button>
          <nav className="flex flex-col gap-6 font-semibold text-gold text-[16px]">
          <Link href="/" onClick={() => setOpen(false)} className="py-2 hover:underline hover:underline-offset-4 hover:shadow-gold transition-colors">Inicio</Link>
          <Link href="/servicios" onClick={() => setOpen(false)} className="py-2 hover:underline hover:underline-offset-4 hover:shadow-gold transition-colors">Servicios</Link>
          <Link href="/productos" onClick={() => setOpen(false)} className="py-2 hover:underline hover:underline-offset-4 hover:shadow-gold transition-colors">Productos</Link>
          <Link href="/asesor" onClick={() => setOpen(false)} className="py-2 hover:underline hover:underline-offset-4 hover:shadow-gold transition-colors">Asesor</Link>
          <Link href="/galeria" onClick={() => setOpen(false)} className="py-2 hover:underline hover:underline-offset-4 hover:shadow-gold transition-colors">Galería</Link>
          <Link href="/tienda" onClick={() => setOpen(false)} className="py-2 hover:underline hover:underline-offset-4 hover:shadow-gold transition-colors">Nuestra Tienda</Link>
        </nav>
        <div className="mt-auto flex flex-col gap-5 text-gold">
          <Link
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="py-2 transition-colors"
          >
            Instagram
          </Link>
          <Link
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="py-2 transition-colors"
          >
            Facebook
          </Link>
            <Link href="/carrito" onClick={() => setOpen(false)} className="relative py-2 transition-colors">
              <span>Carrito</span>
              {mounted && count > 0 && (
                <span
                  className="absolute -top-2 -right-4 h-2.5 w-2.5 rounded-full bg-gray-300 ring-1 ring-black/40"
                  suppressHydrationWarning
                  aria-hidden="true"
                />
              )}
            </Link>
            {autenticado ? (
              <>
                <Link href="/pedidos" onClick={() => setOpen(false)} className="py-2 hover:underline hover:underline-offset-4 hover:shadow-gold transition-colors">
                  Pedidos
                </Link>
                <Link href="/mi-cuenta/direcciones" onClick={() => setOpen(false)} className="py-2 hover:underline hover:underline-offset-4 hover:shadow-gold transition-colors">
                  Direcciones
                </Link>
                {usuario?.role === "ADMIN" && (
                  <Link href="/admin" onClick={() => setOpen(false)} className="py-2 hover:underline hover:underline-offset-4 hover:shadow-gold transition-colors">
                    Panel de Administración
                  </Link>
                )}
                <button
                  onClick={() => {
                    persistCartLocal();
                    fetch("/api/logout", { method: "POST" });
                    setAutenticado(false);
                    setUsuario(null);
                    setOpen(false);
                    router.push("/");
                  }}
                  className="text-left py-2 hover:underline hover:underline-offset-4 hover:shadow-gold transition-colors"
                >
                  Salir
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/ingresar"
                  onClick={() => setOpen(false)}
                  className="border-2 border-gold text-gold px-4 py-2 rounded-xl text-center hover:bg-gold hover:text-black transition-colors"
                >
                  Iniciar sesión
                </Link>
                <Link
                  href="/registrarse"
                  onClick={() => setOpen(false)}
                  className="border-2 border-gold text-gold px-4 py-2 rounded-xl text-center hover:bg-gold hover:text-black transition-colors"
                >
                  Registrarse
                </Link>
              </>
            )}
        </div>
      </div>
    </div>
  </>
  );
}
