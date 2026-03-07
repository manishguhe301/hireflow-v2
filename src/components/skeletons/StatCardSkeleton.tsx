import Skeleton from "../ui/Skeleton";

export function StatCardSkeleton() {
  return (
    <div className="bg-card border border-border/60 rounded-2xl p-6 flex items-center justify-between">
      <div className="space-y-2">
        <Skeleton width={80} height={12} />
        <Skeleton width={60} height={28} />
      </div>

      <Skeleton width={48} height={48} variant="rounded" />
    </div>
  )
}