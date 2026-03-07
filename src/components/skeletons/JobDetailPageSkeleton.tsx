'use client'

import Skeleton from '../ui/Skeleton'

export default function JobDetailPageSkeleton() {
  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-6">

      <div className="rounded-3xl border border-border/40 bg-card p-6">
        <div className="flex items-start gap-4">
          <Skeleton width={56} height={56} variant="rounded" animation="wave" />

          <div className="space-y-2">
            <Skeleton width={220} height={18} animation="wave" />
            <Skeleton width={160} height={12} animation="wave" />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border/40 bg-card p-6 space-y-4">
        <Skeleton width={140} height={16} animation="wave" />

        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} width="100%" height={14} animation="wave" />
        ))}
      </div>

      <div className="rounded-2xl border border-border/40 bg-card p-6 space-y-3">
        <Skeleton width={160} height={16} animation="wave" />
        <Skeleton width="100%" height={12} animation="wave" />
        <Skeleton width="90%" height={12} animation="wave" />
        <Skeleton width="80%" height={12} animation="wave" />
      </div>

      <div className="rounded-2xl border border-border/40 bg-card p-6 space-y-3">
        <Skeleton width={160} height={16} animation="wave" />
        <Skeleton width="100%" height={12} animation="wave" />
        <Skeleton width="90%" height={12} animation="wave" />
      </div>

      <div className="flex justify-end gap-3">
        <Skeleton width={120} height={40} variant="rounded" animation="wave" />
        <Skeleton width={120} height={40} variant="rounded" animation="wave" />
      </div>

    </div>
  )
}