import { Spinner } from '@/src/components/elements/Loader'
import { Button } from '@/src/components/ui/Button'
import { formatDate, isRichTextEmpty } from '@/src/utils/helper'
import { jobCategories } from '@/src/utils/utils'
import { Job } from '@prisma/client'
import clsx from 'clsx'
import { CheckCircle, Clock, Pencil, Trash2, XCircle } from 'lucide-react'
import Link from 'next/link'
import React, { useState } from 'react'

export const checkIsPublishable = (job: Job) => {
  return Boolean(
    job.title?.trim() &&
    !isRichTextEmpty(job.description) &&
    !isRichTextEmpty(job.requirements) &&
    job.skills?.length > 0 &&
    job.experienceLevel &&
    job.employmentType &&
    job.workMode &&
    job.country?.trim() &&
    job.category?.trim() &&
    job.numberOfOpenings > 0
  )
}

export interface JobWithCount extends Job {
  _count: {
    applications: number
  }
}

const JobsTable = ({
  jobs,
  setDeleteJobId,
  loadingAction,
  handleStatusChange,
}: {
  jobs: JobWithCount[],
  setDeleteJobId: React.Dispatch<React.SetStateAction<string | null>>,
  loadingAction: string | null,
  handleStatusChange: (slug: string, newStatus: 'ACTIVE' | 'CLOSED') => Promise<void>
}) => {
  const [now] = useState(() => Date.now())

  const getIsDeadlinePassed = (deadline: Date | null) => {
    return deadline && new Date(deadline).getTime() < now
  }
  return (
    <table className="w-full text-sm">
      <thead className="bg-muted/40 border-b border-border/60">
        <tr>
          <th className="px-6 py-4 text-left">Title</th>
          <th className="px-6 py-4 text-left">Deadline</th>
          <th className="px-6 py-4 text-left">Status</th>
          <th className="px-6 py-4 text-left">Views</th>
          <th className="px-6 py-4 text-left">Applications</th>
          <th className="px-6 py-4 text-right">Actions</th>
        </tr>
      </thead>
      <tbody>
        {jobs.map((job: JobWithCount) => {
          // const jobCategory = jobCategories.filter((ind) => ind.value === job.category)[0]?.label
          const isDeadlinePassed = getIsDeadlinePassed(job.applicationDeadline)
          return (
            <tr
              key={job.id}
              className='w-full hover:bg-muted/30 transition'
            >
              <td className="px-6 py-4">
                <div className="font-medium capitalize">{job.title}</div>
              </td>
              <td className="px-6 py-4">
                <span
                  className={clsx(
                    'text-xs font-medium',
                    isDeadlinePassed ? ' text-red-500' : ' text-primary'
                  )}
                >
                  {job.applicationDeadline
                    ? formatDate(job.applicationDeadline)
                    : '—'}
                </span>
              </td>
              <td className="px-6 py-4">
                <span
                  className={clsx(
                    'inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium',
                    job.status === 'DRAFT'
                      ? 'bg-warning/10 text-warning'
                      : job.status === 'ACTIVE'
                        ? 'bg-success/10 text-success'
                        : 'bg-destructive/10 text-destructive'

                  )}
                >
                  {job.status === 'DRAFT' && <Clock className="h-3 w-3" />}
                  {job.status === 'ACTIVE' && <CheckCircle className="h-3 w-3" />}
                  {job.status === 'CLOSED' && <XCircle className="h-3 w-3" />}
                  {job.status}
                </span>
              </td>
              <td className="px-6 py-4">{job.views}</td>
              <td className="px-6 py-4">{job._count.applications}</td>
              <td className="px-6 py-4 text-right">
                <div className="inline-flex items-center gap-3">

                  {job.status !== 'DRAFT' && (
                    <Link
                      href={`/company/jobs/${job.slug}`}
                      className={clsx("text-xs text-muted-foreground hover:underline", loadingAction && 'pointer-events-none opacity-50')}
                    >
                      View
                    </Link>
                  )}

                  <Link
                    href={`/company/jobs/edit/${job.slug}`}
                    className={clsx("inline-flex items-center gap-1 text-xs text-primary hover:underline", loadingAction && 'pointer-events-none opacity-50')}
                  >
                    <Pencil className="h-3 w-3" />
                    Edit
                  </Link>

                  {job.status === 'DRAFT' && (
                    checkIsPublishable(job) && (
                      <Button
                        className={clsx("p-0! bg-transparent! border-none text-success hover:underline text-xs", loadingAction && 'pointer-events-none opacity-50')}
                        onClick={() => handleStatusChange(job.slug, 'ACTIVE')}
                        disabled={loadingAction === `publish-${job.id}`}
                      >
                        {loadingAction === `publish-${job.id}` ? (
                          <Spinner className="h-3 w-3" />
                        ) : (
                          'Publish'
                        )}
                      </Button>
                    )
                  )}

                  {job.status === 'ACTIVE' && (
                    <Button
                      className={clsx("p-0! bg-transparent! border-none text-destructive! hover:underline text-xs", loadingAction && 'pointer-events-none opacity-50')}
                      onClick={() => handleStatusChange(job.slug, 'CLOSED')}
                      disabled={loadingAction === `close-${job.id}`}
                    >
                      {loadingAction === `close-${job.id}` ? (
                        <Spinner className="h-3 w-3" />
                      ) : (
                        'Close'
                      )}
                    </Button>
                  )}

                  {job.status === 'CLOSED' && (
                    <Button
                      className={clsx("p-0! bg-transparent! border-none text-success! hover:underline text-xs", loadingAction && 'pointer-events-none opacity-50')}
                      onClick={() => handleStatusChange(job.slug, 'ACTIVE')}
                      disabled={loadingAction === `reopen-${job.id}`}
                    >
                      Reopen
                    </Button>
                  )}

                  <Button
                    className={clsx("p-0! bg-transparent! border-none text-destructive! hover:text-destructive/80", loadingAction && 'pointer-events-none opacity-50')}
                    disabled={loadingAction === `delete-${job.id}`}
                    onClick={() => setDeleteJobId(job.id)}
                    aria-label='Delete Job'
                  >
                    {loadingAction === `delete-${job.id}` ? (
                      <Spinner className="h-4 w-4" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </td>
            </tr>
          )
        }
        )}
      </tbody>
    </table>
  )
}

export default JobsTable