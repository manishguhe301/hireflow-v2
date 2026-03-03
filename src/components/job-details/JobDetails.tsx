'use client'

import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useMemo, useState } from 'react'
import { Spinner } from '../elements/Loader'
import { toast } from 'sonner'
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
import { Company, Job } from '@prisma/client'
import InfoCard from '../admin/InfoCard'
import InfoRow from '../admin/InfoRow'
import { formatDate, getLabel, isRichTextEmpty, JOB_STATUS_STYLE } from '@/src/utils/helper'
import { jobCategories } from '@/src/utils/utils'
import DeleteJobModal from '../company/jobs/dashboard/DeleteJobModal'

interface JobDetails extends Job {
  _count: {
    applications: number,
    savedJobs: number
  },
  applications: {
    id: string,
    status: string,
    createdAt: Date,
  }[]
  company: Company
}

const JobDetails = () => {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string | undefined
  const [loadingAction, setLoadingAction] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [job, setJob] = useState<JobDetails | null>(null)
  const [deleteJobId, setDeleteJobId] = useState<string | null>(null)
  const [imageLoaded, setImageLoaded] = useState(false)


  const fetchJobDetails = async () => {
    try {
      const res = await AppSdk.getData(
        `/api/company/jobs/${slug}?company=true&counts=true&applications=true&savedJobs=true`,
        null,
      )
      if (res.job) setJob(res.job)
    } catch (error) {
      console.error(error)
      toast.error('Failed to fetch job details')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!slug) return
    fetchJobDetails()
  }, [slug])

  const handleStatusChange = async (newStatus: 'ACTIVE' | 'CLOSED') => {
    if (!job) return

    setLoadingAction(`status-${job.id}`)

    try {
      const res = await fetch(`/api/company/jobs/${job.slug}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })

      const data = await res.json()

      if (!res.ok) {
        toast.error(data.error || 'Failed to update job status')
        return
      }

      toast.success(data.message)
      await fetchJobDetails()
    } catch (error) {
      console.error(error)
      toast.error('Something went wrong')
    } finally {
      setLoadingAction(null)
    }
  }

  const handleDelete = async () => {
    if (!job) return

    setLoadingAction(`delete-${job.id}`)

    try {
      const res = await fetch(`/api/company/jobs/${job.slug}`, {
        method: 'DELETE'
      })

      const data = await res.json()

      if (!res.ok) {
        toast.error(data.error || 'Failed to delete job')
        return
      }

      if (data.action === 'closed') {
        toast.warning(data.message)
        await fetchJobDetails()
      } else {
        toast.success(data.message)
        router.push('/company/jobs')
      }
    } catch (error) {
      console.error(error)
      toast.error('Something went wrong')
    } finally {
      setLoadingAction(null)
    }
  }

  const applicationStats = useMemo(() => {
    if (!job?.applications) return {}
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    return job.applications.reduce((acc: any, app: any) => {
      acc[app.status] = (acc[app.status] || 0) + 1
      return acc
    }, {})
  }, [job])

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 h-[90%] text-sm">
        Loading job details... <Spinner className="h-6 w-6" />
      </div>
    )
  }

  if (!job) return null

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-6">

      <div className="rounded-3xl border border-border/40 bg-card p-6 shadow-sm">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="flex items-start gap-4">
            <div className="  flex h-14 w-14 items-center justify-center rounded-2xl border border-border/40 bg-muted">
              {
                job.company.logo ? (
                  <div className='relative'>
                    {!imageLoaded && (
                      <div className="absolute inset-0 animate-pulse bg-muted rounded-full" />
                    )}
                    {/*  eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={job.company.logo}
                      alt={job.company.name}
                      onLoad={() => setImageLoaded(true)}
                      onError={() => setImageLoaded(true)}
                      // className="h-12 w-12 rounded-full"
                      className={clsx(
                        "h-12 w-12 rounded-full object-cover transition-opacity duration-300",
                        imageLoaded ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </div>
                ) :
                  <Briefcase className="h-6 w-6 text-muted-foreground" />}
            </div>

            <div>
              <h1 className="text-2xl font-bold">{job.title}</h1>
              <p className="text-sm text-muted-foreground">
                {job.company?.name} • {getLabel(jobCategories, job.category)}
              </p>
            </div>
          </div>

          <div
            className={clsx(
              'inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold',
              JOB_STATUS_STYLE[job.status],
            )}
          >
            {job.status === 'DRAFT' && <Clock className="h-4 w-4" />}
            {job.status === 'ACTIVE' && <CheckCircle className="h-4 w-4" />}
            {job.status === 'CLOSED' && <XCircle className="h-4 w-4" />}
            {job.status}
          </div>
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
              label={status}
              value={String(count)}
            />
          ))}
        </InfoCard>
      )}

      <div className="flex justify-end gap-3">
        <Button
          variant="outline"
          onClick={() => router.push(`/company/jobs/edit/${job.slug}`)}
          disabled={!!loadingAction}
          className='flex items-center justify-center gap-1 text-success border-success '

        >
          <Edit className="h-4 w-4 mr-1" />
          Edit Job
        </Button>

        {job.status === 'ACTIVE' && (
          <Button variant="outline"
            className='flex items-center justify-center gap-1 border-red-600 text-red-500'
            onClick={() => handleStatusChange('CLOSED')}
            disabled={loadingAction === `status-${job.id}`}
          >
            {loadingAction === `status-${job.id}` ? (
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
            disabled={loadingAction === `status-${job.id}`}
          >
            {loadingAction === `status-${job.id}` ? (
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

          {loadingAction === `delete-${job.id}` ? (
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

      <DeleteJobModal
        deleteJobId={deleteJobId}
        setDeleteJobId={setDeleteJobId}
        handleDelete={handleDelete}
        loadingAction={loadingAction}
      />

    </div >
  )
}

export default JobDetails
