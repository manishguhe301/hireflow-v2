'use client'
import { Spinner } from '@/src/components/elements/Loader'
import { AppSdk } from '@/src/utils/AppSdk'
import { JOB_TABS } from '@/src/utils/helper'
import { Job, JobStatus } from '@prisma/client'
import clsx from 'clsx'
import { Briefcase } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'
import JobsTable, { JobWithCount } from './JobsTable'
import DeleteJobModal from './DeleteJobModal'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import TableSkeleton from '@/src/components/skeletons/TableSkeleton'

const ManageJobs = () => {
  const [activeTab, setActiveTab] = useState<'ALL' | JobStatus>('ALL')
  // const [isLoading, setIsLoading] = useState(true)
  // const [jobs, setJobs] = useState<JobWithCount[]>([])
  const [deleteJobId, setDeleteJobId] = useState<string | null>(null)
  const [loadingAction, setLoadingAction] = useState<string | null>(null)
  const queryClient = useQueryClient()

  // const fetchJobs = async (status?: string, isLoadingNeeded: boolean = true) => {
  //   if (isLoadingNeeded) {
  //     setIsLoading(true)
  //   }
  //   try {
  //     const url = status
  //       ? `/api/company/jobs?status=${status}`
  //       : '/api/company/jobs'

  //     const res = await AppSdk.getData(url, null)

  //     if (res.jobs) {
  //       setJobs(res.jobs)
  //     }
  //   } catch (error) {
  //     console.error(error);
  //     toast.error('Failed to fetch jobs, please try again.')
  //   }
  //   finally {
  //     setIsLoading(false)
  //   }
  // }

  // useEffect(() => {
  //   fetchJobs(activeTab === 'ALL' ? undefined : activeTab)
  // }, [activeTab])

  const { data, isLoading } = useQuery({
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

    // try {
    //   const res = await fetch(`/api/company/jobs/${slug}/status`, {
    //     method: 'PATCH',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ status: newStatus })
    //   })

    //   const data = await res.json()

    //   if (!res.ok) {
    //     toast.error(data.error || 'Failed to update job status')
    //     return
    //   }

    //   toast.success(data.message)
    //   await fetchJobs(activeTab === 'ALL' ? undefined : activeTab, false)
    // } catch (error) {
    //   console.error(error)
    //   toast.error('Something went wrong')
    // } finally {
    //   setLoadingAction(null)
    // }
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

    // try {
    //   const res = await fetch(`/api/company/jobs/${job.slug}`, {
    //     method: 'DELETE'
    //   });

    //   const data = await res.json();

    //   if (!res.ok) {
    //     toast.error(data.error || 'Failed to delete job');
    //     return;
    //   }

    //   if (data.action === 'closed') {
    //     toast.warning(data.message);
    //   } else {
    //     toast.success(data.message);
    //   }

    //   setDeleteJobId(null);
    //   await fetchJobs(activeTab === 'ALL' ? undefined : activeTab, false);
    // } catch (error) {
    //   console.error(error);
    //   toast.error('Something went wrong');
    // } finally {
    //   setLoadingAction(null);
    // }

    deleteMutation.mutate({
      id: job.id,
      slug: job.slug
    })
  };


  return (
    <div className="space-y-8 w-full md:max-w-[1400px] md:mx-auto max-sm:max-w-screen">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex gap-2 items-center flex-wrap">
          {JOB_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={clsx(
                'px-4 py-2 rounded-xl text-sm font-medium border transition cursor-pointer',
                activeTab === tab.value
                  ? tab.value === 'ALL'
                    ? 'bg-primary text-primary-foreground border-primary/40 shadow-md'
                    : tab.value === 'DRAFT'
                      ? 'bg-amber-400 text-amber-950 border-amber-950/40 shadow-md'
                      : tab.value === 'ACTIVE'
                        ? 'bg-success/10 text-success border-success/40 shadow-md'
                        : 'bg-destructive/10 text-destructive border-destructive/40 shadow-md'
                  : 'bg-card border-border/40 hover:bg-muted/40'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      {isLoading ?
        <TableSkeleton columns={5} rows={6} /> :
        <>
          {jobs.length === 0 ? (
            <div className="py-20 text-center">
              <Briefcase className="h-10 w-10 mx-auto text-muted-foreground" />
              <p className="mt-4 text-muted-foreground">No Jobs found</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-border/60 bg-card">
              <JobsTable
                jobs={jobs}
                loadingAction={loadingAction}
                setDeleteJobId={setDeleteJobId}
                handleStatusChange={handleStatusChange}
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
      />
    </div >
  )
}

export default ManageJobs