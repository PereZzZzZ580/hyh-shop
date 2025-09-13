import ProductCardSkeleton from "../components/skeletons/ProductCardSkeleton";

export default function LoadingHome() {
  return (
    <section>
      <div className="h-8 w-44 animate-pulse rounded-lg bg-white/10" />
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 md:gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </section>
  );
}
