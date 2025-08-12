import { products } from "../lib/mockdata";
import ProductCard from "../components/product/ProductCard";

export default function Home() {
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
