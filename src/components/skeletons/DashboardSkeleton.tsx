'use client'

import Skeleton from "../ui/Skeleton"

export default function DashboardSkeleton() {
  return (
    <div className="p-4 md:p-8 space-y-10 max-w-[1400px] mx-auto">
      <div className="space-y-3">
        <Skeleton width={260} height={34} animation="wave" />
        <Skeleton width={360} height={16} animation="wave" />
      </div>
      <section className="space-y-4">
        <Skeleton width={200} height={22} animation="wave" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-border/60 bg-card p-6 space-y-3"
            >
              <Skeleton width={120} height={14} animation="wave" />
              <Skeleton width={80} height={28} animation="wave" />
              <Skeleton width={160} height={12} animation="wave" />
            </div>
          ))}
        </div>
      </section>
      <section className="space-y-4">
        <Skeleton width={220} height={22} animation="wave" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-border/60 bg-card p-6 space-y-3"
            >
              <Skeleton width={120} height={14} animation="wave" />
              <Skeleton width={80} height={28} animation="wave" />
              <Skeleton width={160} height={12} animation="wave" />
            </div>
          ))}
        </div>
      </section>
      <section className="space-y-4">
        <Skeleton width={260} height={22} animation="wave" />
        <div className="rounded-2xl border border-border/60 bg-card p-6">
          <Skeleton width="100%" height={280} animation="wave" />
        </div>
      </section>
    </div>
  )
}