import Skeleton from "../ui/Skeleton"

export const ActivitySkeleton = () => {
  return (
    <div className="rounded-xl border border-border/60 bg-card p-4">
      <div className="flex justify-between">
        <div className="space-y-2">
          <Skeleton width={180} height={12} />
          <Skeleton width={120} height={10} />
        </div>

        <div className="space-y-2 text-right">
          <Skeleton width={70} height={18} variant="rounded" />
          <Skeleton width={60} height={10} />
        </div>
      </div>
    </div>
  )
}