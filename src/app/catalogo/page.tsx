import ProductCard from "@/components/product/ProductCard";
import type { Product, Category } from "@/types/product";
import { ChevronDown } from "lucide-react";
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
      <form action="/catalogo" method="get" className="mt-6 rounded-2xl border border-yellow-400/15 bg-black/40 p-4">
        <div className="flex flex-col md:flex-row items-center gap-4">
          {/* Categoría */}
          <div className="relative w-full md:w-auto md:flex-1">
            <select
              name="categoria"
              defaultValue={categoria ?? ""}
              className="w-full appearance-none rounded-lg border border-white/15 bg-neutral-800/80 py-2.5 pl-4 pr-10 text-white placeholder:text-neutral-400 focus:border-yellow-400 focus:outline-none"
            >
              <option value="">Todas las categorías</option>
              {categorias.map((c) => (
                <option key={c.id} value={c.slug} className="bg-neutral-800 text-white">
                  {c.name}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-yellow-300" />
          </div>

          {/* Precios */}
          <div className="flex w-full items-center gap-3 md:w-auto">
            <input
              name="min"
              type="number"
              placeholder="Precio mín."
              defaultValue={min ?? ""}
              className="w-full rounded-lg border border-white/15 bg-neutral-800/80 p-2.5 text-white placeholder:text-neutral-400 focus:border-yellow-400 focus:outline-none"
            />
            <span className="text-neutral-400">-</span>
            <input
              name="max"
              type="number"
              placeholder="Precio máx."
              defaultValue={max ?? ""}
              className="w-full rounded-lg border border-white/15 bg-neutral-800/80 p-2.5 text-white placeholder:text-neutral-400 focus:border-yellow-400 focus:outline-none"
            />
          </div>

          {/* Botones */}
          <div className="flex w-full items-center gap-3 md:w-auto">
            <button className="w-full rounded-lg bg-yellow-400 px-5 py-2.5 text-black font-medium hover:bg-yellow-500 transition-colors md:w-auto">
              Filtrar
            </button>
            <Link
              href="/catalogo"
              className="inline-flex w-full items-center justify-center rounded-lg border border-white/20 px-5 py-2.5 text-white transition-colors hover:bg-white/10 md:w-auto"
            >
              Limpiar
            </Link>
          </div>
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
