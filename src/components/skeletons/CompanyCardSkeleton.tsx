'use client'

import Skeleton from "../ui/Skeleton"

export default function CompanyCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border/40 bg-card p-6 space-y-4">
      <div className="flex items-center gap-4">
        <Skeleton variant="circle" width={48} height={48} animation="wave" />
        <div className="flex-1 space-y-2">
          <Skeleton width="70%" height={14} animation="wave" />
          <Skeleton width="40%" height={12} animation="wave" />
        </div>
      </div>
      <div className="flex gap-3">
        <Skeleton width={80} height={10} animation="wave" />
        <Skeleton width={60} height={10} animation="wave" />
      </div>
      <Skeleton width={120} height={12} animation="wave" />
    </div>
  )
}