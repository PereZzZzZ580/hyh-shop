import ProductDetail from "@/components/product/ProductDetail";
import ProductGallery from "@/components/product/ProductGallery";
import type { Product } from "@/types/product";
import { notFound } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

type Props = { params: { slug: string } };

type Media = { id: string; url: string };
type ProductWithMedia = Product & {
  images?: Media[]; // imágenes del producto
  variants?: Array<{ id: string; media?: Media[] }>; // media por variante
};

export default async function ProductPage({ params }: Props) {
  const { slug } = params;

  const res = await fetch(`${API_URL}/products/${encodeURIComponent(slug)}`, {
    cache: "no-store",
  });
  if (!res.ok) return notFound();

  // ✅ parseo seguro
  const raw = await res.text();
  if (!raw.trim()) return notFound();

  let product: ProductWithMedia | null = null;
  try {
    product = JSON.parse(raw) as ProductWithMedia | null;
  } catch {
    return notFound();
  }
  if (!product) return notFound();

  const images: string[] =
    product.images?.map((i) => i.url) ??
    product.variants?.flatMap((v) => v.media?.map((m) => m.url) ?? []) ??
    [];

  return (
    <section className="container mx-auto grid gap-8 py-8 md:grid-cols-2">
      <ProductGallery images={images} />
      <ProductDetail product={product} />
    </section>
  );
}
