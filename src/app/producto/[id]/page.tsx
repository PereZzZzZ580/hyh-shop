import Image from "next/image";
import { notFound } from "next/navigation";
import { products } from "../../../lib/mockdata";
import AddToCart from "../../../components/product/AddToCart";

type Props = { params: { id: string } };

export default function ProductPage({ params }: Props) {
  const product = products.find((p) => p.id === params.id);
  if (!product) return notFound();

  return (
    <section className="grid md:grid-cols-2 gap-8">
      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-white/10">
        <Image src={product.image} alt={product.name} fill className="object-cover" />
      </div>

      <div>
        <h1 className="text-3xl font-bold">{product.name}</h1>
        <p className="mt-2 opacity-80">Categoría: {product.category}</p>
        <p className="mt-4 text-2xl font-semibold">
          ${product.price.toLocaleString("es-CO")}
        </p>

        <div className="mt-6">
          <AddToCart product={product} />
        </div>
      </div>
    </section>
  );
}
