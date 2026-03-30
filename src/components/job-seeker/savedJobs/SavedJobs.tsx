'use client'
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react'
import { Bookmark } from 'lucide-react';
import Pagination from '../../ui/Pagination';
import JobCard from '../../public/jobs-dir/JobCard';
import { AppSdk } from '@/src/utils/AppSdk';
import { formatRelativeTime } from '@/src/utils/helper';
import { useQuery } from '@tanstack/react-query';
import JobCardSkeleton from '../../skeletons/JobCardSkeleton';
import { PaginationType, SavedJob } from '@/src/types';
import { useSaveJob } from '@/src/store/hooks/useSaveJob';

const SavedJobs = () => {
  const searchParams = useSearchParams()
  const [page, setPage] = useState(parseInt(searchParams.get('page') || '1'))
  const router = useRouter()
  const { toggleSave, isPending: savePending } = useSaveJob({
    invalidateKeys: [
      ['saved-jobs'],
      ['jobs'],
      ['job-details'],
      ['dashboard-recommended']
    ]
  })

  const { data, isLoading } = useQuery({
    queryKey: ['saved-jobs', page],
    queryFn: async () => {
      const params = new URLSearchParams()
      params.set('page', page.toString())
      params.set('limit', '12')
      const res = await AppSdk.getData(`/api/jobs/saved?${params.toString()}`, null)
      if (res.error) throw new Error(res.error)
      return res
    },
    placeholderData: (prev) => prev,
  })

  const jobs: SavedJob[] = data?.savedJobs ?? []
  const pagination: PaginationType = data?.pagination ?? null

  useEffect(() => {
    const params = new URLSearchParams()

    if (page > 1) params.set('page', page.toString())

    router.push(`/dashboard/saved-jobs?${params.toString()}`, {
      scroll: false,
    })
  }, [page, router])

  useEffect(() => {
    window.scrollTo({ top: 80, behavior: 'smooth' })
  }, [page])


  return (
    <div className="p-4 md:p-8 space-y-10 max-w-[1400px] mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Saved Jobs</h1>
        <p className="text-muted-foreground mt-1">
          Manage the jobs you have saved for later. You can view details, apply, or remove them from your saved list.
        </p>
      </div>

      {!isLoading && pagination ? (
        jobs.length > 0 && (<p className="text-sm text-muted-foreground">
          Showing <span className="font-medium text-foreground">{jobs.length}</span> of{' '}
          <span className="font-medium text-foreground">{pagination.total}</span> jobs
        </p>)
      ) : <p className="text-sm text-muted-foreground ">Loading Results...</p>}

      <main className="flex-1 min-w-0">
        {isLoading && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {[...Array(6)].map((_, i) => (
              <JobCardSkeleton key={i} />
            ))}
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
                  isApplied={job.isApplied}
                  onSaveToggle={() => toggleSave(job.id, job.isSaved)}
                  disabled={savePending}
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