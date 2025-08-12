import ProductCard from "@/components/product/ProductCard";
import type { Product } from "@/types/product";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default async function Home() {
  const res = await fetch(`${API_URL}/products`, { cache: "no-store" });
  const data = await res.json();
  const products: Product[] = data.items;

  return (
    <section>
      <h1 className="text-3xl font-bold">Novedades</h1>
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
