import { Spinner } from '@/src/components/elements/Loader'
import { DataTable, DataTableBody, DataTableCell, DataTableHeader, DataTableRow } from '@/src/components/shared/TableComponents'
import { Button } from '@/src/components/ui/Button'
import { formatDate, isRichTextEmpty } from '@/src/utils/helper'
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
  disabled
}: {
  jobs: JobWithCount[],
  setDeleteJobId: React.Dispatch<React.SetStateAction<string | null>>,
  loadingAction: string | null,
  handleStatusChange: (slug: string, newStatus: 'ACTIVE' | 'CLOSED') => Promise<void>
  disabled?: boolean
}) => {
  const [now] = useState(() => Date.now())

  const getIsDeadlinePassed = (deadline: Date | null) => {
    return deadline && new Date(deadline).getTime() < now
  }
  return (
    <DataTable className={clsx("w-full text-sm", disabled && 'opacity-60 cursor-not-allowed')}>
      <DataTableHeader >
        <DataTableRow>
          <DataTableCell>Title</DataTableCell>
          <DataTableCell>Deadline</DataTableCell>
          <DataTableCell>Status</DataTableCell>
          <DataTableCell>Views</DataTableCell>
          <DataTableCell>Applications</DataTableCell>
          <DataTableCell className="text-right">Actions</DataTableCell>
        </DataTableRow>
      </DataTableHeader>
      <DataTableBody>
        {jobs.map((job: JobWithCount) => {
          const isDeadlinePassed = getIsDeadlinePassed(job.applicationDeadline)
          return (
            <DataTableRow
              key={job.id}
              className='w-full hover:bg-muted/30 transition'
            >
              <DataTableCell >
                <div className="font-medium line-clamp-1">{job.title}</div>
              </DataTableCell>
              <DataTableCell>
                <span
                  className={clsx(
                    'text-xs font-medium',
                    isDeadlinePassed ? ' text-destructive' : ' text-primary'
                  )}
                >
                  {job.applicationDeadline
                    ? formatDate(job.applicationDeadline)
                    : '—'}
                </span>
              </DataTableCell>
              <DataTableCell>
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
              </DataTableCell>
              <DataTableCell>{job.views}</DataTableCell>
              <DataTableCell>{job._count.applications}</DataTableCell>
              <DataTableCell className="text-right">
                <div className="inline-flex items-center gap-3">
                  {job.status !== 'DRAFT' && (
                    <Link
                      href={disabled ? '#' : `/company/jobs/${job.slug}`}
                      className={clsx("text-xs text-primary hover:underline", loadingAction && 'pointer-events-none opacity-50')}
                    >
                      View
                    </Link>
                  )}

                  <Link
                    href={disabled ? '#' : `/company/jobs/edit/${job.slug}`}
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
                        disabled={loadingAction === `publish-${job.id}` || disabled}
                      >
                        {loadingAction === `publish-${job.id}` ? (
                          <span className="flex items-center gap-1">
                            <Spinner className="h-3 w-3" />
                            Publishing
                          </span>
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
                      disabled={loadingAction === `close-${job.id}` || disabled}
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
                      disabled={loadingAction === `reopen-${job.id}` || disabled}
                    >
                      Reopen
                    </Button>
                  )}

                  <Button
                    className={clsx("p-0! bg-transparent! border-none text-destructive! hover:text-destructive/80", loadingAction && 'pointer-events-none opacity-50')}
                    disabled={loadingAction === `delete-${job.id}` || disabled}
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
              </DataTableCell>
            </DataTableRow>
          )
        }
        )}
      </DataTableBody>
    </DataTable>
  )
}

export default JobsTable