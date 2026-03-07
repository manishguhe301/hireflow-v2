'use client'

import Skeleton from "../ui/Skeleton"

export default function LandingPageSkeleton() {
  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col">
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 py-28 grid gap-16 md:grid-cols-2 items-center">
          <div className="space-y-6">
            <Skeleton width={200} height={22} animation="wave" />
            <div className="space-y-3">
              <Skeleton width="90%" height={48} animation="wave" />
              <Skeleton width="70%" height={48} animation="wave" />
            </div>
            <div className="space-y-2 pt-2">
              <Skeleton width="100%" height={16} animation="wave" />
              <Skeleton width="85%" height={16} animation="wave" />
              <Skeleton width="60%" height={16} animation="wave" />
            </div>
            <div className="flex gap-4 pt-4">
              <Skeleton width={140} height={42} variant="rounded" animation="wave" />
              <Skeleton width={140} height={42} variant="rounded" animation="wave" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6 max-sm:grid-cols-1">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="rounded-2xl border border-border/60 bg-card p-6 space-y-3">
                <Skeleton variant="circle" width={28} height={28} animation="wave" />
                <Skeleton width="60%" height={16} animation="wave" />
                <Skeleton width="100%" height={12} animation="wave" />
                <Skeleton width="80%" height={12} animation="wave" />
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="border-t border-border/60">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="text-center mb-14 space-y-3">
            <Skeleton width={280} height={30} animation="wave" className="mx-auto" />
            <Skeleton width={420} height={14} animation="wave" className="mx-auto" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-3 rounded-2xl border border-border/60 bg-card p-6">
                <Skeleton variant="circle" width={48} height={48} animation="wave" />
                <Skeleton width={80} height={12} animation="wave" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}