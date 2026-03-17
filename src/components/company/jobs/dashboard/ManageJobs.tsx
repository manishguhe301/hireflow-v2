'use client'
import { AppSdk } from '@/src/utils/AppSdk'
import { JobStatus } from '@prisma/client'
import clsx from 'clsx'
import { Briefcase } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import JobsTable, { JobWithCount } from './JobsTable'
import DeleteJobModal from './DeleteJobModal'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import TableSkeleton from '@/src/components/skeletons/TableSkeleton'
import Link from 'next/link'
import { Button } from '@/src/components/ui/Button'
import { JOB_TABS } from '@/src/utils/constants'
import { signOut } from 'next-auth/react'
import { JOB_STATUS_TABS_STYLES } from '@/src/utils/helper'

const ManageJobs = () => {
  const [activeTab, setActiveTab] = useState<'ALL' | JobStatus>('ALL')
  const [deleteJobId, setDeleteJobId] = useState<string | null>(null)
  const [loadingAction, setLoadingAction] = useState<string | null>(null)
  const queryClient = useQueryClient()

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

  const statusMutation = useMutation({
    mutationFn: async ({
      slug,
      status,
    }: {
      slug: string
      status: 'ACTIVE' | 'CLOSED'
    }) => {
      const res = await fetch(`/api/company/jobs/${slug}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })

      if (res.status === 401 || res.status === 403) {
        signOut({ callbackUrl: '/login' })
        return
      }

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to update job status')
      }

      return data
    },
    onSuccess: (data) => {
      toast.success(data.message)
      queryClient.invalidateQueries({ queryKey: ['company-jobs'] })
      queryClient.invalidateQueries({ queryKey: ['company-dashboard'] })
    },
    onError: (error) => {
      toast.error(error.message || 'Something went wrong')
    },
    onSettled: () => {
      setLoadingAction(null)
    },
  })

  const handleStatusChange = async (slug: string, newStatus: 'ACTIVE' | 'CLOSED') => {
    const job = jobs.find(j => j.slug === slug)
    if (!job) return

    const actionType = newStatus === 'ACTIVE'
      ? (job.status === 'DRAFT' ? 'publish' : 'reopen')
      : 'close'

    setLoadingAction(`${actionType}-${job.id}`)

    statusMutation.mutate({
      slug,
      status: newStatus,
    })
  }

  const deleteMutation = useMutation({
    mutationFn: async ({ id, slug }: { id: string, slug: string }) => {
      const res = await fetch(`/api/company/jobs/${slug}`, {
        method: 'DELETE',
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to delete job')
      }

      return data
    },
    onSuccess: (data) => {
      if (data.action === 'closed') {
        toast.warning(data.message)
      } else {
        toast.success(data.message)
      }

      queryClient.invalidateQueries({ queryKey: ['company-jobs'] })
      queryClient.invalidateQueries({ queryKey: ['company-dashboard'] })
      setDeleteJobId(null)
    },
    onError: (error) => {
      toast.error(error.message || 'Something went wrong')
    },
    onSettled: () => {
      setLoadingAction(null)
    },
  })

  const handleDelete = async () => {
    if (!deleteJobId) return;

    const job = jobs.find(j => j.id === deleteJobId);
    if (!job) return;

    setLoadingAction(`delete-${deleteJobId}`);

    deleteMutation.mutate({
      id: job.id,
      slug: job.slug
    })
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
                disabled={isFetching || isLoading || statusMutation.isPending || deleteMutation.isPending || !!loadingAction}
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