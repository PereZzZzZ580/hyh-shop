import Link from "next/link";
import { Facebook, Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-bg">
      <div className="container py-10 md:py-14 lg:py-18">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-white/85">
          <div className="min-w-[220px] max-w-[260px]">
            <h3 className="text-gold text-base md:text-lg font-semibold mb-4">Empresa</h3>
            <ul className="flex flex-col gap-2">
              <li>
                <Link href="/nosotros" className="hover:text-gold">Nosotros</Link>
              </li>
              <li>
                <Link href="/contacto" className="hover:text-gold">Contacto</Link>
              </li>
              <li>
                <Link href="/galeria" className="hover:text-gold">Galería</Link>
              </li>
            </ul>
          </div>
          <div className="min-w-[220px] max-w-[260px]">
            <h3 className="text-gold text-base md:text-lg font-semibold mb-4">Soporte</h3>
            <ul className="flex flex-col gap-2">
              <li>
                <Link href="/ayuda" className="hover:text-gold">Ayuda</Link>
              </li>
              <li>
                <Link href="/envios" className="hover:text-gold">Envíos</Link>
              </li>
              <li>
                <Link href="/devoluciones" className="hover:text-gold">Devoluciones</Link>
              </li>
            </ul>
          </div>
          <div className="min-w-[220px] max-w-[260px]">
            <h3 className="text-gold text-base md:text-lg font-semibold mb-4">Legal</h3>
            <ul className="flex flex-col gap-2">
              <li>
                <Link href="/terminos" className="hover:text-gold">Términos</Link>
              </li>
              <li>
                <Link href="/privacidad" className="hover:text-gold">Privacidad</Link>
              </li>
              <li>
                <Link href="/cookies" className="hover:text-gold">Cookies</Link>
              </li>
            </ul>
          </div>
          <div className="min-w-[220px] max-w-[260px]">
            <h3 className="text-gold text-base md:text-lg font-semibold mb-4">Síguenos</h3>
            <div className="flex gap-4">
              <Link
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-gold hover:text-gold-600"
              >
                <Instagram size={24} />
              </Link>
              <Link
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="text-gold hover:text-gold-600"
              >
                <Facebook size={24} />
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-border pt-4 text-muted text-xs">
          <p>© {new Date().getFullYear()} HYH Shop. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}