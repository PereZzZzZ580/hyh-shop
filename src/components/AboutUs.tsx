import Image from "next/image";

export default function AboutUs() {
  return (
    <section className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center py-10 md:py-12">
      <div className="relative w-full aspect-[4/3] border border-gold">
        <Image
          src="https://images.unsplash.com/photo-1556229010-945ffcb54b17?auto=format&fit=crop&w=1200&q=80"
          alt="Equipo de HYH"
          fill
          className="object-cover"
        />
      </div>
      <div>
        <h2 className="text-gold text-[26px] sm:text-[28px] md:text-[36px] font-semibold">
          Sobre Nosotros
        </h2>
        <p className="mt-4 text-white/90">
          En HYH, nos apasiona la barbería y ofrecemos productos de calidad para
          profesionales exigentes.
        </p>
        <ul className="mt-6 space-y-2">
          <li className="flex items-start gap-2">
            <span className="text-gold">✓</span>
            <span className="text-white/90">Materiales premium</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-gold">✓</span>
            <span className="text-white/90">Envío rápido y seguro</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-gold">✓</span>
            <span className="text-white/90">Atención personalizada</span>
          </li>
        </ul>
      </div>
    </section>
  );
}