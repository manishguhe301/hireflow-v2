'use client'
import { Spinner } from '@/src/components/elements/Loader'
import { AppSdk } from '@/src/utils/AppSdk'
import { JOB_TABS } from '@/src/utils/helper'
import { Job, JobStatus } from '@prisma/client'
import clsx from 'clsx'
import { Briefcase } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'
import JobsTable from './JobsTable'

const ManageJobs = () => {
  const [jobs, setJobs] = useState<Job[]>([])
  const [activeTab, setActiveTab] = useState<'ALL' | JobStatus>('ALL')
  const [isLoading, setIsLoading] = useState(true)
  const [deleteJobId, setDeleteJobId] = useState<string | null>(null)
  const [loadingAction, setLoadingAction] = useState<string | null>(null)


  const fetchJobs = async (status?: string, isLoadingNeeded: boolean = true) => {
    if (isLoadingNeeded) {
      setIsLoading(true)
    }
    try {
      const url = status
        ? `/api/company/jobs?status=${status}`
        : '/api/company/jobs'

      const res = await AppSdk.getData(url, null)

      if (res.jobs) {
        setJobs(res.jobs)
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch jobs, please try again.')
    }
    finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchJobs(activeTab === 'ALL' ? undefined : activeTab)
  }, [activeTab])


  return (
    <div className="space-y-8 w-full md:max-w-[1400px] md:mx-auto animate-in fade-in duration-500 max-sm:max-w-screen">
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
        <div className='flex items-center justify-center min-h-75'>
          <Spinner />
        </div > : <>
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
              // handleApprove={handleApprove}
              // loadingAction={loadingAction}
              // rejectCompanyId={rejectCompanyId}
              // setRejectCompanyId={setRejectCompanyId}
              />
            </div>
          )}
        </>
      }
      {/* <DeleteCompanyModal
        deleteCompanyId={deleteCompanyId}
        setDeleteCompanyId={setDeleteCompanyId}
        handleDelete={handleDelete}
        loadingAction={loadingAction}
      /> */}
    </div >
  )
}

export default ManageJobs