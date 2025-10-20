"use client";

import { useAuth } from "@/store/auth";
import { useCart } from "@/store/cart";
import type { LucideProps } from "lucide-react";
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
  const TikTokIcon = ({ size = 24, color = "currentColor", className, ...props }: LucideProps) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={color}
      className={className}
      focusable="false"
      aria-hidden={props["aria-hidden"] ?? true}
      {...props}
    >
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
    </svg>
  );

  const socialLinks = [
    {
      label: "Instagram",
      href: "https://www.instagram.com/hhbarberhome/",
      Icon: Instagram,
    },
    {
      label: "Facebook",
      href: "https://facebook.com",
      Icon: Facebook,
    },
    {
      label: "TikTok",
      href: "https://www.tiktok.com/@hhbarbershop0?_t=ZS-90hEHV8UcUr&_r=1",
      Icon: TikTokIcon,
    },
  ];
  const socialButtonClasses =
    "group relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-gold/40 bg-black/40 text-gold shadow-[0_0_12px_rgba(255,215,0,0.2)] transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:border-gold hover:text-black hover:shadow-[0_0_28px_rgba(255,215,0,0.55)] hover:bg-gradient-to-br hover:from-[#FCE7B4] hover:to-[#D8A24D]";
  const socialHighlightClasses =
    "pointer-events-none absolute inset-0 rounded-full bg-gradient-to-br from-transparent via-[#FFE9A3]/20 to-[#FFD46F]/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100";
  const socialMobileClasses =
    "group flex items-center gap-4 rounded-xl border border-gold/20 bg-black/40 px-4 py-3 text-gold transition-all duration-300 hover:border-gold hover:bg-gold/10";
  const socialMobileIconClasses =
    "flex h-8 w-8 items-center justify-center rounded-full border border-gold/35 bg-black/40 shadow-[0_0_10px_rgba(255,215,0,0.25)] transition-all duration-300 group-hover:border-gold group-hover:bg-gold group-hover:text-black group-hover:shadow-[0_0_20px_rgba(255,215,0,0.45)]";

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
        <div className="hidden lg:flex items-center gap-5">
          {socialLinks.map(({ href, label, Icon }) => (
            <Link
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className={socialButtonClasses}
            >
              <span className={socialHighlightClasses} />
              <Icon size={18} className="relative transition-transform duration-300 group-hover:scale-110" />
            </Link>
          ))}
          <Link href="/carrito" aria-label="Carrito" className="relative text-gold hover:shadow-gold">
            <ShoppingCart className="h-6 w-6" />
            {mounted && count > 0 && (
              <span
                className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-gold shadow-[0_0_6px_2px_rgba(255,215,0,0.7)] ring-1 ring-white/50"
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
                className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-gold shadow-[0_0_6px_2px_rgba(255,215,0,0.7)] ring-1 ring-white/50"
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
          {socialLinks.map(({ href, label, Icon }) => (
            <Link
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className={socialMobileClasses}
            >
              <span className={socialMobileIconClasses}>
                <Icon size={16} className="transition-transform duration-300 group-hover:scale-110" />
              </span>
              <span className="flex flex-col leading-tight">
                <span className="text-sm font-semibold group-hover:text-gold">{label}</span>
                <span className="text-xs uppercase tracking-[0.3em] text-gold/70 group-hover:text-gold/80">
                  Siguenos
                </span>
              </span>
            </Link>
          ))}
            <Link href="/carrito" onClick={() => setOpen(false)} className="relative py-2 transition-colors">
              <span>Carrito</span>
              {mounted && count > 0 && (
                <span
                  className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-gold shadow-[0_0_6px_2px_rgba(255,215,0,0.7)] ring-1 ring-white/50"
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
