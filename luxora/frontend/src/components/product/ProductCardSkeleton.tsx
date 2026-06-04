// ProductCardSkeleton.tsx
export function ProductCardSkeleton() {
  return (
    <div className="space-y-3">
      <div className="skeleton aspect-[3/4]" />
      <div className="skeleton h-3 w-1/3 rounded-none" />
      <div className="skeleton h-4 w-3/4 rounded-none" />
      <div className="skeleton h-4 w-1/2 rounded-none" />
      <div className="skeleton h-6 w-1/3 rounded-none" />
    </div>
  );
}
