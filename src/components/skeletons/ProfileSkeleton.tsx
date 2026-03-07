import clsx from "clsx";
import Skeleton from "../ui/Skeleton";

export function ProfileSkeleton({ className }: { className?: string }) {
  return (
    <div className={clsx("mx-auto max-w-5xl space-y-8 px-4 py-6", className!)}>

      <div className="rounded-3xl border border-border/40 bg-card p-6">
        <div className="flex items-center gap-4">
          <Skeleton width={64} height={64} variant="rounded" />
          <div className="space-y-2">
            <Skeleton width={180} height={18} />
            <Skeleton width={240} height={12} />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border/40 bg-card p-6 space-y-3">
        <Skeleton width={140} height={16} />
        <Skeleton width="100%" height={10} />
        <Skeleton width="95%" height={10} />
        <Skeleton width="90%" height={10} />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-border/40 bg-card p-6 space-y-3">
          <Skeleton width={150} height={16} />
          <Skeleton width="100%" height={12} />
          <Skeleton width="100%" height={12} />
          <Skeleton width="100%" height={12} />
        </div>

        <div className="rounded-2xl border border-border/40 bg-card p-6 space-y-3">
          <Skeleton width={150} height={16} />
          <Skeleton width="100%" height={12} />
          <Skeleton width="100%" height={12} />
          <Skeleton width="100%" height={12} />
        </div>
      </div>

      <div className="space-y-4">
        <Skeleton width={160} height={16} />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Skeleton height={80} />
          <Skeleton height={80} />
        </div>
      </div>

    </div>
  )
}