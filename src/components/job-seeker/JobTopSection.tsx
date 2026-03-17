'use client'
import { JobDetailsType } from '@/src/types'
import React from 'react'
import { Button } from '../ui/Button'
import clsx from 'clsx'
import { Bookmark, BookmarkCheck } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { formatRelativeTime, getLabel } from '@/src/utils/helper'
import { employmentTypes, workModes } from '@/src/utils/constants'

const JobTopSection = ({ job, isPending, isSaved, onSaveToggle }: {
  job: JobDetailsType,
  isSaved: boolean
  onSaveToggle: (jobId: string, currentlySaved: boolean) => Promise<void>
  isPending: boolean
}) => {
  const { data: session } = useSession()
  return (
    <div className="space-y-4">
      <div className="flex flex-row items-start justify-between gap-4">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
          {job.title}
        </h1>
        <Button
          onClick={(e) => {
            e.preventDefault()
            onSaveToggle(job.id, isSaved)
          }}
          variant='outline'
          className={clsx("p-2! h-full!  bg-background/80 hover:bg-background",
            !session?.user.id && "hidden"
          )}
          disabled={isPending}
          aria-label='Bookmark Job'
        >
          {isSaved ? (
            <BookmarkCheck className="h-5 w-5 text-primary" />
          ) : (
            <Bookmark className="h-5 w-5 text-muted-foreground" />
          )}
        </Button>

      </div>

      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
        <span>{job.company.name}</span>
        <span>•</span>
        <span>
          {job.city ? `${job.city}, ${job.country}` : job.country}
        </span>
        <span>•</span>
        <span>{getLabel(workModes, job.workMode)}</span>
        <span>•</span>
        <span>{getLabel(employmentTypes, job.employmentType)}</span>
        <span>•</span>
        <span>{formatRelativeTime(job.createdAt)}</span>
      </div>
    </div>
  )
}

export default JobTopSection