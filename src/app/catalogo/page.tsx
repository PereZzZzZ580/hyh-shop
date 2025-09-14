import ProductCard from "@/components/product/ProductCard";
import type { Product, Category } from "@/types/product";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

type Props = {
  searchParams: Promise<{ categoria?: string; min?: string; max?: string }>;
};

type CategoriaConHijos = Category & { children?: Category[] };

export default async function Catalogo({ searchParams }: Props) {
  const { categoria, min, max } = await searchParams;

  const params = new URLSearchParams();
  if (categoria) params.set("categorySlug", categoria);
  if (min) params.set("minPrice", min);
  if (max) params.set("maxPrice", max);

  const [catsRes, prodRes] = await Promise.all([
    fetch(`${API_URL}/categories`, { cache: "no-store" }),
    fetch(`${API_URL}/products?${params.toString()}`, {
      cache: "no-store",
    }),
  ]);

  const categoriasData: CategoriaConHijos[] = await catsRes.json();
  const categorias: Category[] = categoriasData.flatMap((c) => [c, ...(c.children ?? [])]);

  const data = await prodRes.json();
  const products: Product[] = data.items;

  return (
    <section>
      <h1 className="text-3xl font-bold">Catálogo</h1>
    <form
        className="mt-4 grid grid-cols-1 sm:grid-cols-4 gap-3"
        action="/catalogo"
        method="get"
      >
      {/* Filtros (método GET) */}

        <select
          name="categoria"
          defaultValue={categoria ?? ""}
          className="h-10 rounded-lg bg-transparent border border-white/20 px-3"
        >
          <option value="">Todas las categorías</option>
          {categorias.map((c) => (
            <option key={c.id} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>

        <input
          name="min"
          type="number"
          placeholder="Precio mín."
          defaultValue={min ?? ""}
          className="h-10 rounded-lg bg-transparent border border-white/20 px-3"
        />
        <input
          name="max"
          type="number"
          placeholder="Precio máx."
          defaultValue={max ?? ""}
          className="h-10 rounded-lg bg-transparent border border-white/20 px-3"
        />

        <div className="flex gap-3">
          <button className="h-10 rounded-lg px-4 border border-white/20">Filtrar</button>
          <Link href="/catalogo" className="h-10 rounded-lg px-4 border border-white/20 inline-flex items-center">
            Limpiar
          </Link>
        </div>
      </form>

      <p className="mt-3 opacity-80 text-sm">{products.length} producto(s)</p>

    <div className="mt-6 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 md:gap-6">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
