import Image from "next/image";
import { notFound } from "next/navigation";
import AddToCart from "@/components/product/AddToCart";
import type { Product } from "@/types/product";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

type Props = { params: { slug: string } };

export default async function ProductPage({ params }: Props) {
  const res = await fetch(`${API_URL}/products/${params.slug}`, {
    cache: "no-store",
  });
  if (!res.ok) return notFound();
  const product: Product | null = await res.json();
  if (!product) return notFound();

  const image = product.images[0]?.url;
  const variant = product.variants[0];

  return (
    <section className="grid md:grid-cols-2 gap-8">
      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-white/10">
        {image && (
          <Image src={image} alt={product.name} fill className="object-cover" />
        )}
      </div>

      <div>
        <h1 className="text-3xl font-bold">{product.name}</h1>
        <p className="mt-2 opacity-80">Categoría: {product.category.name}</p>
        {variant && (
          <p className="mt-4 text-2xl font-semibold">
            ${variant.price.toLocaleString("es-CO")}
          </p>
        )}

        {variant && (
          <div className="mt-6">
            <AddToCart variantId={variant.id} />
          </div>
        )}
      </div>
    </section>
  );
}
