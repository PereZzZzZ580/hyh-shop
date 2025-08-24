import ProductCardSkeleton from "../components/skeletons/ProductCardSkeleton";

export default function LoadingHome() {
  return (
    <section>
      <div className="h-8 w-44 animate-pulse rounded-lg bg-white/10" />
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </section>
  );
}
