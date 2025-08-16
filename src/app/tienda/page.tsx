import Image from "next/image";

export const metadata = {
  title: "Nuestra tienda",
  description: "Conoce nuestra barbería física y dónde encontrarnos",
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
        <p className="opacity-80">
          Visítanos en nuestra sede principal. Ofrecemos un ambiente cómodo y
          profesionales listos para atenderte.
        </p>
      </div>
    </section>
  );
}
