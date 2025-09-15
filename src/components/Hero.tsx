import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden py-24 md:py-32">
      <div className="pointer-events-none absolute inset-0 [background:radial-gradient(600px_circle_at_30%_20%,rgba(212,175,55,0.15),transparent_60%),radial-gradient(400px_circle_at_80%_10%,rgba(212,175,55,0.08),transparent_50%)]" />
      <div className="relative mx-auto max-w-5xl text-center px-6">
        <h1 className="font-serif text-5xl md:text-6xl text-yellow-200 tracking-tight">
          Elegancia que se nota
        </h1>
        <p className="mt-5 text-lg md:text-xl text-neutral-300/90">
          Negro profundo. Detalles dorados. Piezas que hablan por ti.
        </p>
        <div className="mt-6 flex items-center justify-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-yellow-400/30 bg-black/40 px-3 py-1 text-sm text-yellow-100">
            <span className="h-1.5 w-1.5 rounded-full bg-yellow-400" />
            Compra y agenda sin registrarte <span className="opacity-80">— modo invitado</span>
          </span>
        </div>
        <div className="mt-8 flex items-center justify-center gap-4">
          <Link
            href="/tienda"
            className="px-6 py-3 rounded-full bg-yellow-400 text-black font-medium hover:brightness-110 transition"
          >
            Ver tienda
          </Link>
          <Link
            href="/nosotros"
            className="px-6 py-3 rounded-full border border-yellow-400/40 text-yellow-200 hover:border-yellow-300 hover:text-yellow-100 transition"
          >
            Más info
          </Link>
        </div>
      </div>
    </section>
  );
}
