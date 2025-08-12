import Link from "next/link";
import { products } from "../../lib/mockdata";
import ProductCard from "../../components/product/ProductCard";

type Props = {
  searchParams: { categoria?: string; min?: string; max?: string };
};

export default function Catalogo({ searchParams }: Props) {
  const categoria = searchParams.categoria as "ropa" | "cabello" | undefined;
  const min = searchParams.min ? Number(searchParams.min) : undefined;
  const max = searchParams.max ? Number(searchParams.max) : undefined;

  const filtered = products.filter((p) => {
    if (categoria && p.category !== categoria) return false;
    if (min !== undefined && p.price < min) return false;
    if (max !== undefined && p.price > max) return false;
    return true;
  });

  return (
    <section>
      <h1 className="text-3xl font-bold">Catálogo</h1>

      {/* Filtros (método GET) */}
      <form className="mt-4 grid grid-cols-1 sm:grid-cols-4 gap-3" action="/catalogo" method="get">
        <select
          name="categoria"
          defaultValue={categoria ?? ""}
          className="h-10 rounded-lg bg-transparent border border-white/20 px-3"
        >
          <option value="">Todas las categorías</option>
          <option value="cabello">Cabello</option>
          <option value="ropa">Ropa</option>
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

      <p className="mt-3 opacity-80 text-sm">{filtered.length} producto(s)</p>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filtered.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
