import { JobSeekerActivities } from '@/src/types'
import { APPLICATIONS_TABS } from '@/src/utils/constants'
import { APPLICATION_TABS_STATUS_COLORS, formatRelativeTime, getLabel } from '@/src/utils/helper'
import clsx from 'clsx'
import { FileText } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const RecentActivityCard = ({ activity }: {
  activity: JobSeekerActivities
}) => {
  return (
    <Link
      key={activity.id}
      href={`/jobs/${activity.job.slug}`}
      className="block rounded-xl border border-border/60 bg-card p-4 hover:border-primary/40 hover:shadow-lg transition"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center">
          <FileText className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium line-clamp-1">{activity.job.title}</p>
          <p className="text-sm text-muted-foreground">
            {activity.job.company.name}
          </p>
        </div>
        <div className="text-right">
          <span
            className={clsx(
              'inline-block px-3 py-1 rounded-full text-xs font-medium',
              APPLICATION_TABS_STATUS_COLORS[activity.status.toLowerCase() as keyof typeof APPLICATION_TABS_STATUS_COLORS],
            )}
          >
            {getLabel(APPLICATIONS_TABS, activity.status)}
          </span>
          <p className="text-xs text-muted-foreground mt-1">
            {formatRelativeTime(activity.updatedAt)}
          </p>
        </div>
      </div>
    </Link>
  )
}

export default RecentActivityCard