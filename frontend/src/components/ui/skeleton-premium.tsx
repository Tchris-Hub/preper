/**
 * PREMIUM SKELETON LOADER COMPONENT
 *
 * Enterprise-grade loading states. Never show blank white screens.
 * These shimmer placeholders maintain layout stability and
 * communicate "content is loading" without jarring flashes.
 */

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = "" }: SkeletonProps) {
  return <div className={`skeleton ${className}`} aria-hidden="true" />;
}

/** Full stat card skeleton */
export function StatCardSkeleton() {
  return (
    <div className="glass-card rounded-[2rem] p-8 space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-4 w-4 rounded-full" />
      </div>
      <Skeleton className="h-10 w-20" />
      <Skeleton className="h-3 w-32" />
    </div>
  );
}

/** History row skeleton */
export function HistoryRowSkeleton() {
  return (
    <div className="p-8 flex items-center gap-6">
      <Skeleton className="h-16 w-16 rounded-2xl shrink-0" />
      <div className="flex-1 space-y-3">
        <Skeleton className="h-5 w-48" />
        <Skeleton className="h-3 w-32" />
      </div>
      <div className="space-y-2 text-right">
        <Skeleton className="h-8 w-16 ml-auto" />
        <Skeleton className="h-3 w-12 ml-auto" />
      </div>
    </div>
  );
}

/** Dashboard card skeleton */
export function DashboardCardSkeleton() {
  return (
    <div className="glass-card rounded-[2.5rem] p-8 space-y-6">
      <Skeleton className="h-6 w-48" />
      <Skeleton className="h-4 w-64" />
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-16 w-full rounded-2xl" />
        ))}
      </div>
    </div>
  );
}

/** Profile avatar skeleton */
export function ProfileSkeleton() {
  return (
    <div className="glass-card rounded-xl p-8 flex flex-col items-center space-y-4">
      <Skeleton className="h-24 w-24 rounded-full" />
      <Skeleton className="h-5 w-32" />
      <Skeleton className="h-3 w-20" />
    </div>
  );
}
