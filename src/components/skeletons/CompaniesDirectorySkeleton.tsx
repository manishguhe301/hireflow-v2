'use client'

import Skeleton from "../ui/Skeleton"
import CompanyCardSkeleton from "./CompanyCardSkeleton"

export default function CompaniesDirectorySkeleton() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 space-y-10">

      {/* Title */}
      <div className="text-center space-y-3">
        <Skeleton width={260} height={34} animation="wave" className="mx-auto" />
        <Skeleton width={340} height={16} animation="wave" className="mx-auto" />
      </div>

      {/* Search filters */}
      <div className="rounded-3xl border border-border/40 bg-card p-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">

          <Skeleton
            height={48}
            animation="wave"
            className="md:col-span-2 rounded-xl"
          />

          <Skeleton height={48} animation="wave" className="rounded-xl" />

          <Skeleton height={48} animation="wave" className="rounded-xl" />

        </div>
      </div>

      {/* Company cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

        {[...Array(8)].map((_, i) => (
          <CompanyCardSkeleton key={i} />
        ))}

      </div>

    </div>
  )
}