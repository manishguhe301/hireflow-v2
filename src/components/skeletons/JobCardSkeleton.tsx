'use client'

import Skeleton from "../ui/Skeleton"

export default function JobCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border/60 bg-card p-6 space-y-4">
      <div className="flex items-start gap-4">
        <Skeleton variant="circle" width={48} height={48} animation="wave" />
        <div className="flex-1 space-y-2">
          <Skeleton width="70%" height={16} animation="wave" />
          <Skeleton width="40%" height={12} animation="wave" />
        </div>
      </div>
      <div className="flex gap-4">
        <Skeleton width={80} height={10} animation="wave" />
        <Skeleton width={100} height={10} animation="wave" />
      </div>
      <div className="flex gap-2">
        <Skeleton width={70} height={20} variant="rounded" animation="wave" />
        <Skeleton width={90} height={20} variant="rounded" animation="wave" />
      </div>
    </div>
  )
}