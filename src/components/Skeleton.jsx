export function SkeletonCard() {
  return (
    <div className="animate-pulse">
      <div className="aspect-square bg-surface-lighter rounded-lg mb-3" />
      <div className="h-3.5 bg-surface-lighter rounded w-3/4 mb-2" />
      <div className="h-3 bg-surface-lighter rounded w-1/2" />
    </div>
  );
}

export function SkeletonRow() {
  return (
    <div className="flex items-center gap-3 px-4 py-2.5 animate-pulse">
      <div className="w-5 h-4 bg-surface-lighter rounded shrink-0" />
      <div className="w-10 h-10 bg-surface-lighter rounded shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="h-3.5 bg-surface-lighter rounded w-3/4 max-w-48 mb-1.5" />
        <div className="h-3 bg-surface-lighter rounded w-1/2 max-w-32" />
      </div>
      <div className="h-3 bg-surface-lighter rounded w-12 shrink-0" />
    </div>
  );
}

export function SkeletonGrid({ count = 6 }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
      {Array.from({ length: count }, (_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export function SkeletonList({ count = 8 }) {
  return (
    <div>
      {Array.from({ length: count }, (_, i) => (
        <SkeletonRow key={i} />
      ))}
    </div>
  );
}
