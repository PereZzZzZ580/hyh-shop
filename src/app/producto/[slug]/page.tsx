import ProductDetail from "@/components/product/ProductDetail";
import type { Product } from "@/types/product";
import { notFound } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

type Props = { params: { slug: string } };

export default async function ProductPage({ params }: Props) {
  const res = await fetch(`${API_URL}/products/${params.slug}`, {
    cache: "no-store",
  });
  if (!res.ok) return notFound();
  const product: Product | null = await res.json();
  if (!product) return notFound();

  return <ProductDetail product={product} />;
}
