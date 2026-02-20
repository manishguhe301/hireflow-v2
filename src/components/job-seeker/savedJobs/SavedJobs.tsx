'use client'
import { EmploymentType, ExperienceLevel, WorkMode } from '@prisma/client';
import clsx from 'clsx';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react'
import { Spinner } from '../../elements/Loader';
import { Bookmark, Briefcase } from 'lucide-react';
import Pagination from '../../ui/Pagination';
import JobCard from '../../public/jobs-dir/JobCard';
import { AppSdk } from '@/src/utils/AppSdk';
import { toast } from 'sonner';
import { formatRelativeTime } from '@/src/utils/helper';

export interface SavedJobs {
  company: {
    name: string;
    id: string;
    logo: string;
    website: string;
  };
  id: string;
  country: string;
  city: string;
  createdAt: string;
  updatedAt: string;
  slug: string;
  title: string;
  experienceLevel: string;
  employmentType: string;
  workMode: WorkMode;
  salaryMin: number;
  salaryMax: number;
  numberOfOpenings: string;
  applicationDeadline: string;
  category: string;
  // savedId: string;
  savedAt: string;
  isSaved: boolean;
}

type Pagination = {
  total: number
  page: number
  limit: number
  totalPages: number
}

const SavedJobs = () => {
  const searchParams = useSearchParams()
  const [pagination, setPagination] = useState<Pagination | null>(null)
  const [jobs, setJobs] = useState<SavedJobs[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [page, setPage] = useState(parseInt(searchParams.get('page') || '1'))
  const router = useRouter()

  const fetchSavedJobs = useCallback(async (isLoadingNeeded: boolean = true) => {
    if (isLoadingNeeded) {
      setIsLoading(true)
    }
    try {
      const params = new URLSearchParams()
      params.set('page', page.toString())
      params.set('limit', '12')

      const res = await AppSdk.getData(
        `/api/jobs/saved?${params.toString()}`,
        null
      )
      setJobs(res.savedJobs || [])
      setPagination(res.pagination)
    } catch (error) {
      console.error('Error fetching companies:', error)
    } finally {
      setIsLoading(false)
    }
  }, [page])

  useEffect(() => {
    const params = new URLSearchParams()
    if (page > 1) params.set('page', page.toString())

    const query = params.toString()
    const newUrl = query
      ? `/dashboard/saved-jobs?${query}`
      : `/dashboard/saved-jobs`

    if (newUrl !== window.location.pathname + window.location.search) {
      router.push(newUrl, { scroll: false })
    }
  }, [page])

  useEffect(() => {
    fetchSavedJobs()
  }, [page])

  const handleSaveToggle = async (jobId: string, currentlySaved: boolean) => {
    setSaving(true)
    try {
      if (currentlySaved) {
        const res = await AppSdk.deleteData(`/api/jobs/saved?jobId=${jobId}`, null)
        if (res.error) {
          toast.error(res.error || 'Failed to remove saved job')
          return
        }
        toast.success('Job removed from saved')
      } else {
        const res = await AppSdk.postData(`/api/jobs/saved`, {
          jobId
        })

        if (res.error) {
          toast.error(res.error || 'Failed to save job')
          return
        }

        toast.success('Job saved successfully')
      }
      fetchSavedJobs(false)
    } catch (error) {
      toast.error('Something went wrong')
    } finally {
      setSaving(false)
    }
  }


  return (
    <div className="p-4 md:p-8 space-y-10 max-w-[1400px] mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Saved Jobs</h1>
        <p className="text-muted-foreground mt-1">
          Manage the jobs you have saved for later. You can view details, apply, or remove them from your saved list.
        </p>
      </div>

      {!isLoading && pagination ? (
        <p className="text-sm text-muted-foreground">
          Showing <span className="font-medium text-foreground">{jobs.length}</span> of{' '}
          <span className="font-medium text-foreground">{pagination.total}</span> jobs
        </p>
      ) : <p className="text-sm text-muted-foreground ">Loading Results...</p>}

      <main className="flex-1 min-w-0">
        {isLoading && (
          <div className="flex justify-center py-24">
            <Spinner className="h-8 w-8" />
          </div>
        )}

        {!isLoading && jobs?.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-2">
            {jobs.map((job) => (
              <div key={job.id} className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="font-medium">Saved</span>
                  <span>•</span>
                  <span>{formatRelativeTime(job.savedAt)}</span>
                </div>

                <JobCard
                  job={job}
                  isSaved={job.isSaved}
                  onSaveToggle={() => handleSaveToggle(job.id, job.isSaved)}
                  disabled={saving}
                />
              </div>
            ))}
          </div>
        )}

        {!isLoading && jobs.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center w-full">
            <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
              <Bookmark className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-1">No saved jobs found</h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-sm">
              It looks like you haven&apos;t saved any jobs yet. Start exploring and save jobs that interest you to easily find them later.
            </p>

          </div>
        )}

        {!isLoading && pagination && pagination.totalPages > 1 && (
          <div className="mt-8">
            <Pagination
              page={page}
              totalPages={pagination.totalPages}
              onPageChange={(p) => setPage(p)}
            />
          </div>
        )}
      </main>
    </div>
  )
}

export default SavedJobs