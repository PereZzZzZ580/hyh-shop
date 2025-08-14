import Hero from "@/components/Hero";
import ProductCard from "@/components/product/ProductCard";
import type { Product } from "@/types/product";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default async function Home() {
  const res = await fetch(`${API_URL}/products`, { cache: "no-store" });
  const data = await res.json();
  const products: Product[] = data.items;

  return (
    <>
      <Hero />
      <section>
        <h2 className="text-gold text-[26px] sm:text-[28px] md:text-[36px] font-semibold">
          Nuestros Productos
        </h2>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </>
  );
}
