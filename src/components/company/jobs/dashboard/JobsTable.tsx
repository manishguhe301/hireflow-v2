import { Spinner } from '@/src/components/elements/Loader'
import { Button } from '@/src/components/ui/Button'
import { jobCategories } from '@/src/utils/utils'
import { Job } from '@prisma/client'
import clsx from 'clsx'
import { CheckCircle, Clock, Pencil, Trash2, XCircle } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

export const checkIsPublishable = (job: Job) => {
  return Boolean(
    job.title?.trim() &&
    job.description?.trim() &&
    job.requirements?.trim() &&
    job.skills?.length > 0 &&
    job.experienceLevel &&
    job.employmentType &&
    job.workMode &&
    job.country?.trim() &&
    job.category?.trim() &&
    job.numberOfOpenings > 0
  )
}

const JobsTable = ({
  jobs,
  setDeleteJobId,
  loadingAction
}: {
  jobs: Job[],
  setDeleteJobId: React.Dispatch<React.SetStateAction<string | null>>,
  loadingAction: string | null,
}) => {
  return (
    <table className="w-full text-sm">
      <thead className="bg-muted/40 border-b border-border/60">
        <tr>
          <th className="px-6 py-4 text-left">Title</th>
          <th className="px-6 py-4 text-left">Category</th>
          <th className="px-6 py-4 text-left">Status</th>
          <th className="px-6 py-4 text-left">Views</th>
          <th className="px-6 py-4 text-right">Actions</th>
        </tr>
      </thead>
      <tbody>
        {jobs.map((job: Job) => {
          const jobCategory = jobCategories.filter((ind) => ind.value === job.category)[0]?.label
          return (
            <tr
              key={job.id}
              className='w-full hover:bg-muted/30 transition'
            >
              <td className="px-6 py-4">
                <div className="font-medium capitalize">{job.title}</div>
              </td>
              <td className="px-6 py-4">{jobCategory || 'N/A'}</td>
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
              {/* <td className="px-6 py-4 text-right">
                <div className="inline-flex items-center gap-2">
                  {job.status === 'ACTIVE' &&
                    <Link
                      href={`/company/jobs/${job.slug}`}
                      className="text-muted-foreground hover:underline text-xs"
                    >
                      View Details
                    </Link>
                  }

                  {job.status === 'DRAFT' && (
                    <>
                      <Button
                        // onClick={() => handleApprove(company.id)}
                        // disabled={
                        //   loadingAction === `approve-${company.id}` ||
                        //   !!rejectCompanyId
                        // }
                        className="text-success hover:underline text-xs border-none w-fit p-0! bg-transparent!"
                      >
                        Publish
                      </Button>
                    </>
                  )}

                  {job.status === 'ACTIVE' &&
                    <Button
                      onClick={() => {
                        setDeleteJobId(null)
                      }}
                      disabled={
                        !!loadingAction && loadingAction !== `close-${job.id}`
                      }
                      className="text-destructive! hover:underline text-xs border-none w-fit p-0! bg-transparent"
                    >
                      Mark as closed
                    </Button>
                  }
                  <Button
                    className="p-0! border-none text-destructive! bg-transparent hover:text-destructive/80"
                    disabled={loadingAction === `delete-${job.id}`}
                    onClick={() => {
                      setDeleteJobId(job.id)
                    }}
                  >
                    {loadingAction === `delete-${job.id}` ? (
                      <Spinner className="h-4 w-4" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>

                </div>
              </td> */}
              <td className="px-6 py-4 text-right">
                <div className="inline-flex items-center gap-3">

                  {job.status !== 'DRAFT' && (
                    <Link
                      href={`/company/jobs/${job.slug}`}
                      className="text-xs text-muted-foreground hover:underline"
                    >
                      View
                    </Link>
                  )}

                  <Link
                    href={`/company/jobs/edit/${job.slug}`}
                    className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                  >
                    <Pencil className="h-3 w-3" />
                    Edit
                  </Link>

                  {job.status === 'DRAFT' && (
                    checkIsPublishable(job) ? (
                      <Button
                        className="p-0! bg-transparent! border-none text-success hover:underline text-xs"
                      >
                        Publish
                      </Button>
                    ) : (
                      <Link
                        href={`/company/jobs/edit/${job.slug}`}
                        className="text-xs text-primary hover:underline"
                      >
                        Complete Details
                      </Link>
                    )
                  )}

                  {job.status === 'ACTIVE' && (
                    <Button
                      className="p-0! bg-transparent! border-none text-destructive! hover:underline text-xs"
                    >
                      Close
                    </Button>
                  )}

                  <Button
                    className="p-0! bg-transparent! border-none text-destructive! hover:text-destructive/80"
                    disabled={loadingAction === `delete-${job.id}`}
                    onClick={() => setDeleteJobId(job.id)}
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