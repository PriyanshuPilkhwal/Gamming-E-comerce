export function GameCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-lg border border-white/10 bg-card shadow-lg">
      {/* Shimmer effect container */}
      <div className="relative h-48 w-full animate-pulse bg-white/5"></div>

      <div className="flex flex-1 flex-col p-4">
        {/* Title placeholder */}
        <div className="h-6 w-3/4 animate-pulse rounded bg-white/5"></div>
        {/* Genre placeholder */}
        <div className="mt-2 h-4 w-1/2 animate-pulse rounded bg-white/5"></div>

        {/* Rating and Platforms placeholder */}
        <div className="mt-2 flex items-center justify-between">
          <div className="h-5 w-1/3 animate-pulse rounded bg-white/5"></div>
          <div className="h-5 w-1/4 animate-pulse rounded bg-white/5"></div>
        </div>

        {/* Price and Button placeholder */}
        <div className="mt-4 flex flex-1 items-end justify-between">
          <div className="h-8 w-1/3 animate-pulse rounded bg-white/5"></div>
          <div className="h-9 w-9 animate-pulse rounded-md bg-white/5"></div>
        </div>
      </div>
    </div>
  )
}