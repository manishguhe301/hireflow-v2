'use client'

import Skeleton from "../ui/Skeleton"

export default function JobDetailsSkeleton() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 space-y-10">
      <Skeleton width={120} height={16} animation="wave" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          <div className="space-y-3">
            <Skeleton width="70%" height={34} animation="wave" />
            <Skeleton width="40%" height={14} animation="wave" />
          </div>
          <div className="flex gap-6">
            <Skeleton width={120} height={14} animation="wave" />
            <Skeleton width={100} height={14} animation="wave" />
            <Skeleton width={80} height={14} animation="wave" />
          </div>
          <div className="space-y-3">
            <Skeleton width={150} height={18} animation="wave" />
            <div className="flex gap-2">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} width={70} height={24} variant="rounded" animation="wave" />
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <Skeleton width={200} height={20} animation="wave" />
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} width="100%" height={12} animation="wave" />
            ))}
          </div>
          <div className="space-y-4">
            <Skeleton width={200} height={20} animation="wave" />
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} width="100%" height={12} animation="wave" />
            ))}
          </div>
        </div>
        <div className="space-y-6">
          <div className="rounded-2xl border border-border/40 bg-card p-6 space-y-4">
            <Skeleton width="100%" height={44} variant="rounded" animation="wave" />
            <Skeleton width="70%" height={12} animation="wave" className="mx-auto" />
          </div>
          <div className="rounded-2xl border border-border/40 bg-card p-6 space-y-4">
            <div className="flex items-center gap-4">
              <Skeleton variant="circle" width={56} height={56} animation="wave" />
              <div className="space-y-2">
                <Skeleton width={140} height={14} animation="wave" />
                <Skeleton width={100} height={12} animation="wave" />
              </div>
            </div>
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} width="100%" height={12} animation="wave" />
            ))}
            <Skeleton width={120} height={14} animation="wave" />
          </div>
        </div>
      </div>
      <div className="space-y-6 border-t border-border/40 pt-10">
        <Skeleton width={160} height={22} animation="wave" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="rounded-2xl border border-border/40 bg-card p-5 space-y-3">
              <Skeleton width="80%" height={16} animation="wave" />
              <Skeleton width="50%" height={12} animation="wave" />
              <div className="flex gap-3">
                <Skeleton width={80} height={10} animation="wave" />
                <Skeleton width={90} height={10} animation="wave" />
              </div>
              <Skeleton width={70} height={10} animation="wave" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}