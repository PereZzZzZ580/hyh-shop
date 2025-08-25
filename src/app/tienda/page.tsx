import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Nuestra tienda",
  description:
    "No tenemos sede física, pero llevamos el estilo y la barbería hasta tu casa.",
};

export default function Tienda() {
  return (
    <section>
      <h1 className="text-3xl font-bold text-center">Nuestra Tienda</h1>
      <div className="mt-8 grid gap-6 md:grid-cols-2 items-center">
        <Image
          src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80"
          alt="Interior de la barbería"
          width={600}
          height={400}
          className="rounded-xl object-cover"
        />
        <div>
          <p className="opacity-80">
            No tenemos sede física, pero llevamos el estilo y la barbería hasta
            tu casa. Ropa urbana y accesorios a domicilio. Servicio de corte de
            cabello en el lugar y horario que elijas. Haz tu pedido o agenda tu
            cita ahora.
          </p>
          <div className="mt-6 flex gap-4">
            <Link
              href="/productos"
              className="px-6 py-3 rounded-full bg-yellow-400 text-black font-medium hover:brightness-110 transition"
            >
              Ver Catálogo
            </Link>
            <Link
              href="/servicios"
              className="px-6 py-3 rounded-full border border-yellow-400/40 text-yellow-200 hover:border-yellow-300 hover:text-yellow-100 transition"
            >
              Agendar por WhatsApp
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
