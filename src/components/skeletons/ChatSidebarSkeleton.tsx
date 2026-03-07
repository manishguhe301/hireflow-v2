'use client'

import Skeleton from '../ui/Skeleton'

export default function ChatSidebarSkeleton() {
  return (
    <div className="w-full sm:w-80 h-full border-r border-border p-3 space-y-3">

      <Skeleton height={36} width="100%" variant="rounded" animation="wave" />

      {[...Array(8)].map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-2">

          <Skeleton variant="circle" width={40} height={40} animation="wave" />

          <div className="flex-1 space-y-2">
            <Skeleton width="70%" height={12} animation="wave" />
            <Skeleton width="50%" height={10} animation="wave" />
          </div>

        </div>
      ))}
    </div>
  )
}