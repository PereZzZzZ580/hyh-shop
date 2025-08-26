import ProductsClient from "@/components/product/ProductsClient";
import type { Category, Product } from "@/types/product";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

type Props = {
  searchParams: { categoria?: string; min?: string; max?: string };
};

type CategoriaConHijos = Category & { children?: Category[] };

export const metadata = {
  title: "Productos",
  description: "Explora todos nuestros productos disponibles",
};

export default async function Productos({ searchParams }: Props) {
  const categoria = searchParams.categoria;
  const min = searchParams.min;
  const max = searchParams.max;

  const params = new URLSearchParams();
  if (categoria) params.set("categorySlug", categoria);
  if (min) params.set("minPrice", min);
  if (max) params.set("maxPrice", max);

  const [catsRes, prodRes] = await Promise.allSettled([
    fetch(`${API_URL}/categories`, { cache: "no-store" }),
    fetch(`${API_URL}/products?${params.toString()}`, {
      cache: "no-store",
    }),
  ]);

  let categorias: Category[] = [];
  if (catsRes.status === "fulfilled") {
    const categoriasData: CategoriaConHijos[] = await catsRes.value.json();
    categorias = categoriasData.flatMap((c) => [c, ...(c.children ?? [])]);
  }

  let products: Product[] = [];
  if (prodRes.status === "fulfilled"){
    const data = await prodRes.value.json();
    products = data.items;
  }
  
  return (
    <section>
      <h1 className="text-3xl font-bold">Productos</h1>
      <ProductsClient categories={categorias} initialProducts={products} />
    </section>
  );
}