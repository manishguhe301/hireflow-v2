'use client'

import Skeleton from '../ui/Skeleton'

export default function CompanyDetailsSkeleton() {
  return (
    <div className="md:p-8 p-4 space-y-10 max-w-[1200px] mx-auto">
      <Skeleton width={80} height={16} animation="wave" />
      <div className="rounded-3xl border border-border/40 bg-card p-8">
        <div className="flex items-start gap-4">
          <Skeleton variant="rounded" width={64} height={64} animation="wave" />
          <div className="space-y-3">
            <Skeleton width={240} height={24} animation="wave" />
            <Skeleton width={200} height={14} animation="wave" />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border/40 bg-card p-6 space-y-3">
        <Skeleton width={180} height={18} animation="wave" />
        <Skeleton width="100%" height={12} animation="wave" />
        <Skeleton width="100%" height={12} animation="wave" />
        <Skeleton width="70%" height={12} animation="wave" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-border/40 bg-card p-6 space-y-4">
          <Skeleton width={160} height={18} animation="wave" />
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} width="100%" height={14} animation="wave" />
          ))}
        </div>
        <div className="rounded-2xl border border-border/40 bg-card p-6 space-y-4">
          <Skeleton width={160} height={18} animation="wave" />

          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} width="100%" height={14} animation="wave" />
          ))}
        </div>
      </div>
    </div>
  )
}