import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-yellow-400/15 bg-black/60">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h4 className="font-serif text-yellow-200 text-lg">HYH Shop</h4>
            <p className="mt-3 text-neutral-400/90 max-w-xs">Elegancia diaria sin exceso.</p>
          </div>
          <div>
            <h5 className="text-yellow-100 font-medium">Tienda</h5>
            <ul className="mt-3 space-y-2 text-neutral-300">
              <li>Hombre</li>
              <li>Mujer</li>
              <li>Accesorios</li>
            </ul>
          </div>
          <div>
            <h5 className="text-yellow-100 font-medium">Soporte</h5>
            <ul className="mt-3 space-y-2 text-neutral-300">
              <li><Link href="/envios">Envíos</Link></li>
              <li><Link href="/devoluciones">Devoluciones</Link></li>
              <li><Link href="/contacto">Contacto</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="text-yellow-100 font-medium">Legal</h5>
            <ul className="mt-3 space-y-2 text-neutral-300">
              <li><Link href="/terminos">Términos y Condiciones</Link></li>
              <li><Link href="/privacidad">Privacidad</Link></li>
              <li><Link href="/cookies">Cookies</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-yellow-400/15">
          <h5 className="text-yellow-100 font-medium">Suscríbete a nuestro boletín</h5>
          <div className="mt-3 flex gap-2 max-w-md">
            <input
              className="flex-1 rounded-full bg-black/40 border border-yellow-400/25 px-4 py-2 placeholder:text-neutral-500 focus:outline-none focus:border-yellow-300"
              placeholder="tu@email.com"
            />
            <button className="px-4 rounded-full bg-yellow-400 text-black">Unirme</button>
          </div>
        </div>
      </div>
      <div className="py-6 text-center text-neutral-500 text-sm border-t border-yellow-400/15">
        © {new Date().getFullYear()} HYH Shop
      </div>
    </footer>
  );
}
