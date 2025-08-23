import AboutBlock from "@/components/AboutBlock";
import Hero from "@/components/Hero";
import SectionTitle from "@/components/SectionTitle";
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
      <AboutBlock
        imageUrl="/foto_holman.png"
        title="Sobre Nosotros"
        text="En HYH, nos apasiona la barbería y ofrecemos productos de calidad para profesionales exigentes."
        bullets={["Materiales premium", "Envío rápido y seguro", "Atención personalizada"]}
      />
      <section className="py-10 md:py-12">
        <SectionTitle underline>Nuestros Productos</SectionTitle>
        {products.length > 0 ? (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <p className="mt-6 text-center text-white/90">
            No hay productos disponibles.
          </p>
        )}
      </section>
    </>
  );
}
