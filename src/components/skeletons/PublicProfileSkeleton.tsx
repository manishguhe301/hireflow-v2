'use client'

import Skeleton from "../ui/Skeleton"


export default function PublicProfileSkeleton() {
  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-8">
      <Skeleton width={80} height={16} animation="wave" />
      <div className="rounded-3xl border border-border/40 bg-card p-6">
        <div className="flex items-center gap-5">
          <Skeleton variant="rounded" width={80} height={80} animation="wave" />
          <div className="space-y-2">
            <Skeleton width={200} height={20} animation="wave" />
            <Skeleton width={160} height={14} animation="wave" />
            <Skeleton width={180} height={12} animation="wave" />
          </div>
        </div>
      </div>
      <div className="rounded-2xl border border-border/40 bg-card p-6 space-y-3">
        <Skeleton width={120} height={18} animation="wave" />
        <Skeleton width="100%" height={12} animation="wave" />
        <Skeleton width="90%" height={12} animation="wave" />
        <Skeleton width="70%" height={12} animation="wave" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-border/40 bg-card p-6 space-y-4">
          <Skeleton width={180} height={18} animation="wave" />
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} width="100%" height={14} animation="wave" />
          ))}
        </div>
        <div className="rounded-2xl border border-border/40 bg-card p-6 space-y-4">
          <Skeleton width={180} height={18} animation="wave" />
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} width="100%" height={14} animation="wave" />
          ))}
        </div>
      </div>
      <div className="rounded-2xl border border-border/40 bg-card p-6 space-y-4">
        <Skeleton width={120} height={18} animation="wave" />
        <div className="flex gap-2 flex-wrap">
          {[...Array(6)].map((_, i) => (
            <Skeleton
              key={i}
              width={70}
              height={24}
              variant="rounded"
              animation="wave"
            />
          ))}
        </div>
      </div>
    </div>
  )
}