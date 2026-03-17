import { RecentApplication } from '@/src/types'
import { APPLICATIONS_TABS, STATUS_STYLES } from '@/src/utils/constants'
import { formatRelativeTime, getLabel } from '@/src/utils/helper'
import { ApplicationStatus } from '@prisma/client'
import clsx from 'clsx'
import Link from 'next/link'
import React from 'react'

const RecentApplicationCard = ({ app }: { app: RecentApplication }) => {
  return (
    <Link
      key={app.id}
      href={`/company/applications/${app.job.slug}`}
      className="block rounded-xl border border-border/60 bg-card p-4 hover:border-primary/40 hover:shadow-lg transition"
    >
      <div className="flex items-center justify-between gap-4">
        <div className=" flex items-center gap-3 flex-1 min-w-0">
          {app?.user?.profile?.avatar ? (
            <div className='relative'>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={app.user.profile.avatar}
                alt={app.user.profile.name}
                // className="h-10 w-10 rounded-full object-cover"
                className={clsx(
                  "h-10 w-10 object-cover rounded-full transition-opacity duration-300",
                )}
              />
            </div>
          ) : (
            <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center" >
              {app.user.profile?.name && app.user.profile?.name?.[0] || '?'}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="font-medium line-clamp-1">
              {app.user.profile?.name || 'Anonymous'}
            </p>
            <p className="text-sm text-muted-foreground line-clamp-1">
              Applied to {app.job.title}
            </p>
          </div>
        </div>
        <div className="text-right">
          <span
            className={clsx(
              'inline-block px-3 py-1 rounded-full text-xs font-medium',
              STATUS_STYLES[app.status as ApplicationStatus],
            )}
          >
            {getLabel(APPLICATIONS_TABS, app.status)}
          </span>
          <p className="text-xs text-muted-foreground mt-1">
            {formatRelativeTime(app.createdAt)}
          </p>
        </div>
      </div>
    </Link>
  )
}

export default RecentApplicationCard