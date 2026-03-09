'use client'

import { useSession } from "next-auth/react"
import Skeleton from "../ui/Skeleton"
import JobCardSkeleton from "./JobCardSkeleton"
import clsx from "clsx"

export default function JobsDirectorySkeleton() {
  const { data: session } = useSession()
  return (
    <div className={clsx("mx-auto max-w-5xl px-4 py-10 space-y-10", session && 'w-full max-w-full mx-0', 'max-sm:p-0')}>
      <div className={clsx("space-y-2 text-center", session && 'text-left! w-fit!')}>
        <Skeleton width={250} height={34} animation="wave" className={clsx("mx-auto", session && 'mx-0!')} />
        <Skeleton width={350} height={16} animation="wave" className={clsx("mx-auto", session && 'mx-0')} />
      </div>
      <div className="rounded-3xl border border-border/40 bg-card p-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
          <Skeleton height={48} animation="wave" className="md:col-span-3 rounded-xl" />
          <Skeleton height={48} animation="wave" className="rounded-xl" />
          <Skeleton height={48} animation="wave" className="rounded-xl" />
        </div>
      </div>
      <div className="flex gap-6">
        <div className="hidden lg:block w-80 space-y-4">
          <Skeleton height={22} width={120} animation="wave" />
          <Skeleton height={40} animation="wave" />
          <Skeleton height={40} animation="wave" />
          <Skeleton height={40} animation="wave" />
          <Skeleton height={40} animation="wave" />
        </div>
        <main className="flex-1">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {[...Array(6)].map((_, i) => (
              <JobCardSkeleton key={i} />
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}