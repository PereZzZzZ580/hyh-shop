"use client";

import type { Category, Product } from "@/types/product";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

type Props = {
  categories: Category[];
  initialProducts: Product[];
};

export default function ProductsClient({ categories, initialProducts }: Props) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [categoria, setCategoria] = useState("");
  const [min, setMin] = useState("");
  const [max, setMax] = useState("");
  const [openCat, setOpenCat] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    setCategoria(searchParams.get("categoria") ?? "");
    setMin(searchParams.get("min") ?? "");
    setMax(searchParams.get("max") ?? "");
  }, [searchParams]);

  const fetchProducts = async (cat: string, minVal: string, maxVal: string) => {
    const params = new URLSearchParams();
    if (cat) params.set("categorySlug", cat);
    if (minVal) params.set("minPrice", minVal);
    if (maxVal) params.set("maxPrice", maxVal);
    const res = await fetch(`${API_URL}/products?${params.toString()}`, {
      cache: "no-store",
    });
    if (res.ok) {
      const data = await res.json();
      setProducts(data.items);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (categoria) params.set("categoria", categoria);
    if (min) params.set("min", min);
    if (max) params.set("max", max);
    router.replace(`/productos?${params.toString()}`);
    fetchProducts(categoria, min, max);
  };

  const handleClear = () => {
    setCategoria("");
    setMin("");
    setMax("");
    router.replace("/productos");
    fetchProducts("", "", "");
  };

  const selectCategoria = (slug: string) => {
    setCategoria(slug);
    setOpenCat(false);
  };

  const categoriaNombre =
    categories.find((c) => c.slug === categoria)?.name || "Todas las categorías";

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="mt-4 grid grid-cols-1 sm:grid-cols-4 gap-3 relative"
      >
        <div className="relative">
          <button
            type="button"
            onClick={() => setOpenCat((o) => !o)}
            className="h-10 rounded-lg bg-transparent border border-white/20 px-3 w-full flex items-center justify-between cursor-pointer text-white"
          >
            {categoriaNombre}
          </button>
          <div
          className={`absolute left-0 right-0 mt-1 bg-black text-white border border-white/20 rounded-lg p-2 z-20 shadow-lg transform transition-all duration-200 origin-top ${
            openCat ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none"
            }`}
          >
            <button
              type="button"
              onClick={() => selectCategoria("")}
              className="block w-full text-left px-2 py-1 hover:bg-white/10 cursor-pointer"
            >
              Todas las categorías
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => selectCategoria(c.slug)}
                className="block w-full text-left px-2 py-1 hover:bg-white/10 cursor-pointer"
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>

        <input
          name="min"
          type="number"
          placeholder="Precio mín."
          value={min}
          onChange={(e) => setMin(e.target.value)}
          className="h-10 rounded-lg bg-transparent border border-white/20 px-3"
        />
        <input
          name="max"
          type="number"
          placeholder="Precio máx."
          value={max}
          onChange={(e) => setMax(e.target.value)}
          className="h-10 rounded-lg bg-transparent border border-white/20 px-3"
        />

        <div className="flex gap-3">
          <button
            type="submit"
            className="h-10 rounded-lg px-4 border border-white/20 cursor-pointer"
          >
            Filtrar
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="h-10 rounded-lg px-4 border border-white/20 inline-flex items-center cursor-pointer"
          >
            Limpiar
          </button>
        </div>
      </form>

      <p className="mt-3 opacity-80 text-sm">{products.length} producto(s)</p>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </>
  );
}

