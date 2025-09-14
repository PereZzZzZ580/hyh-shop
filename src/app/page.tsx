import AboutBlock from "@/components/AboutBlock";
import Hero from "@/components/Hero";
import Divider from "@/components/Divider";
import SectionTitle from "@/components/SectionTitle";
import StickyCTA from "@/components/StickyCTA";
import ProductCard from "@/components/product/ProductCard";
import type { Product } from "@/types/product";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default async function Home() {
let products: Product[] = [];
  try {
    const res = await fetch(`${API_URL}/products`, { cache: "no-store" });
    const data = await res.json();
    products = data.items ?? [];
  } catch {
    products = [];
  }
  return (
    <>
      <Hero />
      <Divider />
      <AboutBlock
        imageUrl="/foto_holman.png"
        title="Sobre Nosotros"
        text="En HYH, nos apasiona la barbería y ofrecemos productos de calidad para profesionales exigentes."
        bullets={["Materiales premium", "Envío rápido y seguro", "Atención personalizada"]}
      />
      <Divider />
      <section className="py-16 md:py-20">
        <div className="space-y-6 md:space-y-8">
          <SectionTitle>Nuestros Productos</SectionTitle>
          {products.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 md:gap-6">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <p className="text-center text-neutral-300/90">
              No hay productos disponibles.
            </p>
          )}
        </div>
      </section>
      <Divider />
      <section className="py-16 md:py-20">
        <header className="text-center max-w-2xl mx-auto">
          <h2 className="font-serif text-3xl md:text-4xl text-yellow-200">Por qué elegirnos</h2>
          <p className="mt-3 text-neutral-300/90">Detalles que suman a tu presencia.</p>
        </header>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            ["Acabado premium", "Materiales seleccionados y montaje preciso."],
            ["Ediciones limitadas", "Piezas con disponibilidad controlada."],
            ["Garantía real", "Soporte humano y cambios sin drama."],
          ].map(([t, d]) => (
            <div
              key={String(t)}
              className="rounded-xl border border-yellow-400/15 bg-black/40 p-6"
            >
              <div className="h-10 w-10 rounded-full bg-yellow-400/20 flex items-center justify-center">
                <span className="text-yellow-200">★</span>
              </div>
              <h3 className="mt-4 font-medium text-yellow-100">{t}</h3>
              <p className="mt-2 text-neutral-300">{d}</p>
            </div>
          ))}
        </div>
      </section>
      <StickyCTA />
    </>
  );
}
