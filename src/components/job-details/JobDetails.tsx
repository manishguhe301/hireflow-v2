'use client'

import { useParams, useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import { Spinner } from '../elements/Loader'
import { AppSdk } from '@/src/utils/AppSdk'
import {
  Briefcase,
  Eye,
  Users,
  Edit,
  Trash2,
  XCircle,
  Clock,
  CheckCircle,
  Calendar,
  RefreshCcwDot,
} from 'lucide-react'
import clsx from 'clsx'
import RichTextRenderer from '@/src/components/ui/RichTextRenderer'
import { Button } from '../ui/Button'
import InfoCard from '../shared/InfoCard'
import InfoRow from '../shared/InfoRow'
import { formatDate, getLabel, isRichTextEmpty, } from '@/src/utils/helper'
import DeleteJobModal from '../company/jobs/dashboard/DeleteJobModal'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import JobDetailPageSkeleton from '../skeletons/JobDetailPageSkeleton'
import { APPLICATIONS_TABS, JOB_STATUS_STYLE, jobCategories } from '@/src/utils/constants'
import { JobDetails as JobDetailsType } from '@/src/types'
import { useCompanyJobActions } from '@/src/store/hooks/useCompanyJobActions'

const JobDetails = () => {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string | undefined
  const [loadingAction, setLoadingAction] = useState<string | null>(null)
  const [deleteJobId, setDeleteJobId] = useState<string | null>(null)
  const queryClient = useQueryClient()

  const { updateStatus, deleteJob } = useCompanyJobActions({
    onSettled: () => setLoadingAction(null),
    onDeleteSuccess: (data) => {
      if (data?.action === 'closed') {
        queryClient.invalidateQueries({
          queryKey: ['company-job', slug]
        })
        queryClient.invalidateQueries({
          queryKey: ['company-dashboard']
        })

        return
      }
      router.push('/company/jobs')
    },
    onStatusSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['company-job', slug]
      })
    },
  })

  const { data, isLoading } = useQuery({
    queryKey: ['company-job', slug],
    queryFn: async () => {
      const res = await AppSdk.getData(
        `/api/company/jobs/${slug}?company=true&counts=true&applications=true&savedJobs=true`,
        null
      )

      if (!res?.job) {
        throw new Error('Job not found')
      }

      return res.job
    },
    enabled: !!slug,
    staleTime: 0,
    refetchOnMount: 'always'
  })

  const job: JobDetailsType = data

  const handleStatusChange = async (newStatus: 'ACTIVE' | 'CLOSED') => {
    if (!job) return

    setLoadingAction(`status-${job.id}`)

    updateStatus(job.slug, newStatus)
  }

  const handleDelete = async () => {
    if (!job) return

    setLoadingAction(`delete-${job.id}`)

    deleteJob(job.slug)
  }

  const applicationStats = useMemo(() => {
    if (!job?.applications) return {}
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    return job.applications.reduce((acc: any, app: any) => {
      acc[app.status] = (acc[app.status] || 0) + 1
      return acc
    }, {})
  }, [job])

  if (isLoading) {
    return (
      <JobDetailPageSkeleton />
    )
  }

  if (!job) return null

  const renderActions = () => {
    const isStatusLoading = loadingAction === `status-${job.id}`;
    const isDeleteLoading = loadingAction === `delete-${job.id}`;
    return (
      <div className="flex justify-end gap-3">
        <Button
          variant="outline"
          onClick={() => router.push(`/company/jobs/edit/${job.slug}`)}
          disabled={!!loadingAction}
          className='flex items-center justify-center gap-1 '

        >
          <Edit className="h-4 w-4 mr-1" />
          Edit Job
        </Button>

        {job.status === 'ACTIVE' && (
          <Button variant="outline"
            className='flex items-center justify-center gap-1 border-red-600 text-red-500'
            onClick={() => handleStatusChange('CLOSED')}
            disabled={isStatusLoading}
          >
            {isStatusLoading ? (
              <span className='flex justify-center items-center gap-1'>
                <Spinner className="h-4 w-4 mr-1" />
                Closing...
              </span>
            ) : (
              <span className='flex items-center justify-center gap-1'>
                <XCircle className="h-4 w-4 mr-1" />
                Close Job
              </span>
            )}

          </Button>
        )}
        {job.status === 'CLOSED' && (
          <Button
            variant="primary"
            className='flex items-center justify-center gap-1'
            onClick={() => handleStatusChange('ACTIVE')}
            disabled={isStatusLoading}
          >
            {isStatusLoading ? (
              <span className='flex justify-center items-center gap-1'>
                <Spinner className="h-4 w-4 mr-1" />
                Reopening...
              </span>
            ) : (
              <span className='flex items-center justify-center gap-1'>
                <RefreshCcwDot className="h-4 w-4 mr-1" />
                Reopen
              </span>
            )}
          </Button>
        )}

        <Button
          variant="danger"
          className="flex items-center justify-center gap-1"
          onClick={() => setDeleteJobId(job.id)}
          disabled={!!loadingAction}
        >

          {isDeleteLoading ? (
            <span className='flex justify-center items-center gap-1'>
              <Spinner className="h-4 w-4 mr-1" />
              Deleting...
            </span>
          ) : (
            <span className='flex items-center justify-center gap-1'>
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </span>
          )}
        </Button>
      </div>
    )
  }


  const renderStatusBadge = () => {
    const iconMap = {
      DRAFT: <Clock className="h-4 w-4" />,
      ACTIVE: <CheckCircle className="h-4 w-4" />,
      CLOSED: <XCircle className="h-4 w-4" />,
    };

    return (
      <div
        className={clsx(
          "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold",
          JOB_STATUS_STYLE[job.status]
        )}
      >
        {iconMap[job.status]}
        {job.status}
      </div>
    );
  };

  const renderCompanyLogo = () => {
    if (job.company?.logo) {
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={job.company.logo}
          alt={job.company.name}
          className="h-12 w-12 rounded-full object-cover"
        />
      );
    }

    return (
      <span className="text-lg font-semibold text-muted-foreground">
        {job.company?.name?.charAt(0).toUpperCase()}
      </span>
    );
  };

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-6">
      <div className="rounded-3xl border border-border/40 bg-card p-6 shadow-sm">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="flex items-start gap-4">
            <div className="  flex h-14 w-14 items-center justify-center rounded-2xl border border-border/40 bg-muted">
              {renderCompanyLogo()}
            </div>

            <div>
              <h1 className="text-2xl font-bold">{job.title}</h1>
              <p className="text-sm text-muted-foreground">
                {job.company?.name} • {getLabel(jobCategories, job.category)}
              </p>
            </div>
          </div>

          {renderStatusBadge()}
        </div>
      </div>

      <InfoCard title="Job Performance">
        <InfoRow icon={<Eye />} label="Views" value={job.views.toString()} />
        <InfoRow
          icon={<Users />}
          label="Applications"
          value={job._count?.applications?.toString() || '0'}
        />
        <InfoRow
          icon={<Briefcase />}
          label="Saved by Candidates"
          value={job._count?.savedJobs?.toString() || '0'}
        />
        <InfoRow
          icon={<Calendar />}
          label="Posted On"
          value={formatDate(job.createdAt)}
        />
      </InfoCard>

      <div className="space-y-6">
        <div className="rounded-2xl border border-border/40 bg-card p-6">
          <h2 className="text-base font-semibold">Job Description</h2>
          <div className="mt-4">
            <RichTextRenderer content={job.description} />
          </div>
        </div>

        <div className="rounded-2xl border border-border/40 bg-card p-6">
          <h2 className="text-base font-semibold">Requirements</h2>
          <div className="mt-4">
            <RichTextRenderer content={job.requirements} />
          </div>
        </div>

        {!isRichTextEmpty(job.responsibilities as string) && (
          <div className="rounded-2xl border border-border/40 bg-card p-6">
            <h2 className="text-base font-semibold">Responsibilities</h2>
            <div className="mt-4">
              <RichTextRenderer content={job.responsibilities as string} />
            </div>
          </div>
        )}
      </div>

      {job.applications?.length > 0 && (
        <InfoCard title="Application Status Breakdown">
          {Object.entries(applicationStats).map(([status, count]) => (
            <InfoRow
              key={status}
              icon={<Users />}
              label={getLabel(APPLICATIONS_TABS, status) as string}
              value={String(count)}
            />
          ))}
        </InfoCard>
      )}

      {renderActions()}

      <DeleteJobModal
        deleteJobId={deleteJobId}
        setDeleteJobId={setDeleteJobId}
        handleDelete={handleDelete}
        loadingAction={loadingAction}
        jobTitle={job.title}
      />

    </div >
  )
}

export default JobDetails
