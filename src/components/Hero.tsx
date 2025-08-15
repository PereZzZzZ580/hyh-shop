import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative p-0 h-[60vh] min-h-[400px] max-h-[650px] flex items-center">
      <Image
        src="https://images.unsplash.com/photo-1512698459101-2e1ac9b6f3ce?auto=format&fit=crop&w=1200&q=80"
        alt="Barbero"
        fill
        priority
        className="object-cover"
      />
      <div className="absolute inset-0 bg-black/70" />
      <div className="relative z-10">
        <h1 className="text-gold text-[26px] sm:text-[38px] md:text-[64px] font-semibold">
          Corta con estilo
        </h1>
        <div className="mt-2 w-16 h-[2px] bg-gold" />
        <h3 className="mt-4 font-sans text-[#EAEAEA] text-[14px] sm:text-[16px] md:text-[20px]">
          Productos y servicios para tu barbería.
        </h3>
        <Link
          href="/catalogo"
          className="mt-6 inline-flex items-center justify-center h-[48px] w-full sm:w-auto px-[22px] bg-gold text-black rounded-xl hover:bg-gold600 hover:shadow-gold"
        >
          Ver catálogo
        </Link>
      </div>
    </section>
  );
}
