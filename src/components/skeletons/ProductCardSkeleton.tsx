export default function ProductCardSkeleton() {
  return (
    <div className="rounded-lg bg-white/10 p-4 flex flex-col gap-4 animate-pulse h-64">
      <div className="h-32 w-full bg-white/20 rounded-md" />
      <div className="h-6 w-2/3 bg-white/20 rounded" />
      <div className="h-4 w-1/3 bg-white/20 rounded" />
    </div>
  );
}