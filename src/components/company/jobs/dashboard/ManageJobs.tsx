'use client'
import { AppSdk } from '@/src/utils/AppSdk'
import { JobStatus } from '@prisma/client'
import clsx from 'clsx'
import { Briefcase } from 'lucide-react'
import { useEffect, useState } from 'react'
import JobsTable, { JobWithCount } from './JobsTable'
import DeleteJobModal from './DeleteJobModal'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import TableSkeleton from '@/src/components/skeletons/TableSkeleton'
import Link from 'next/link'
import { Button } from '@/src/components/ui/Button'
import { JOB_TABS } from '@/src/utils/constants'
import { JOB_STATUS_TABS_STYLES } from '@/src/utils/helper'
import { useCompanyJobActions } from '@/src/store/hooks/useCompanyJobActions'

const ManageJobs = () => {
  const [activeTab, setActiveTab] = useState<'ALL' | JobStatus>('ALL')
  const [deleteJobId, setDeleteJobId] = useState<string | null>(null)
  const [loadingAction, setLoadingAction] = useState<string | null>(null)
  const queryClient = useQueryClient()
  const { updateStatus, deleteJob, isStatusPending, isDeletePending } =
    useCompanyJobActions({
      onSettled: () => {
        setDeleteJobId(null)
        setLoadingAction(null)
      },
    })

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['company-jobs', activeTab],
    queryFn: async () => {
      const url =
        activeTab === 'ALL'
          ? '/api/company/jobs'
          : `/api/company/jobs?status=${activeTab}`

      const res = await AppSdk.getData(url, null)

      if (!res) throw new Error('Failed to fetch jobs')

      return res
    },
    staleTime: 1000 * 60 * 5,
  })

  const jobs: JobWithCount[] = data?.jobs ?? []

  const handleStatusChange = async (slug: string, newStatus: 'ACTIVE' | 'CLOSED') => {
    const job = jobs.find(j => j.slug === slug)
    if (!job) return

    const actionType = newStatus === 'ACTIVE'
      ? (job.status === 'DRAFT' ? 'publish' : 'reopen')
      : 'close'

    setLoadingAction(`${actionType}-${job.id}`)

    updateStatus(slug, newStatus)
  }

  const handleDelete = async () => {
    if (!deleteJobId) return;

    const job = jobs.find(j => j.id === deleteJobId);
    if (!job) return;

    setLoadingAction(`delete-${deleteJobId}`);

    deleteJob(job.slug)
  };

  useEffect(() => {
    ['ACTIVE', 'CLOSED', 'DRAFT'].forEach((status) => {
      queryClient.prefetchQuery({
        queryKey: ['company-jobs', status],
        queryFn: () => AppSdk.getData(`/api/company/jobs?status=${status}`, null),
      })
    })
  }, [])


  return (
    <div className="space-y-8 w-full md:max-w-[1400px] md:mx-auto max-sm:max-w-screen">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex gap-2 items-center flex-wrap">
          {JOB_TABS.map((tab) => {
            return (
              <Button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                size='sm'
                variant={tab.value === activeTab ? 'primary' : 'ghost'}
                disabled={!!loadingAction}
                className={clsx(
                  'shadow-md',
                  activeTab === tab.value ?
                    JOB_STATUS_TABS_STYLES[tab.value] :
                    'bg-card border-border/40 hover:bg-muted/40'
                )}
              >
                {tab.label}
              </Button>
            )
          }
          )}
        </div>
      </div>
      {isLoading ?
        <TableSkeleton columns={5} rows={6} /> :
        <>
          {jobs.length === 0 ? (
            <div className="py-20 text-center space-y-4">
              <Briefcase className="h-10 w-10 mx-auto text-muted-foreground" />

              <p className="text-muted-foreground">
                No jobs found
              </p>

              {activeTab === 'ALL' &&
                <Link href="/company/jobs/create">
                  <Button>
                    Post Your First Job
                  </Button>
                </Link>}
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-border/60 bg-card">
              <JobsTable
                jobs={jobs}
                loadingAction={loadingAction}
                setDeleteJobId={setDeleteJobId}
                handleStatusChange={handleStatusChange}
                disabled={isFetching || isLoading || isStatusPending || isDeletePending || !!loadingAction}
              />
            </div>
          )}
        </>
      }
      <DeleteJobModal
        deleteJobId={deleteJobId}
        setDeleteJobId={setDeleteJobId}
        handleDelete={handleDelete}
        loadingAction={loadingAction}
        jobTitle={jobs.find((j) => j.id === deleteJobId)?.title || ''}
      />
    </div >
  )
}

export default ManageJobs