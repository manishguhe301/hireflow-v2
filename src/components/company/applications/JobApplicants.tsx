'use client'
import { AppSdk } from '@/src/utils/AppSdk';
import { ApplicationStatus, CurrentEmployment, ExperienceLevel } from '@prisma/client';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner';
import { Spinner } from '../../elements/Loader';
import { Button } from '../../ui/Button';
import { StatCard } from './CompanyApplicationsDashboard';
import { CalendarClock, CheckCircle, Eye, FileText, Layers, RefreshCw, Search, UserCheck, XCircle } from 'lucide-react';
import Pagination from '../../ui/Pagination';
import { APPLICATION_TABS_WITH_SORT, APPLICATIONS_TABS, getLabel } from '@/src/utils/helper';
import { FormSelect } from '../../ui/FormSelect';
import ApplicationsTableForJob from './ApplicationsTableForJob';
import Modal from '../../ui/Modal';
import useDebounce from '@/src/store/hooks/useDebounce';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { StatCardSkeleton } from '../../skeletons/StatCardSkeleton';
import TableSkeleton from '../../skeletons/TableSkeleton';
import clsx from 'clsx';

interface Stats {
  total: number,
  applied: number,
  reviewing: number,
  shortlisted: number
  interviewScheduled: number
  rejected: number,
  offered: number,
  hired: number,
};

export interface Applications {
  user: {
    profile: {
      skills: string[];
      country: string;
      city: string | null;
      name: string;
      avatar: string | null;
      phone: string;
      professionalTitle: string | null;
      yearsOfExperience: ExperienceLevel | null;
      currentEmployment: CurrentEmployment | null;
    } | null;
    id: string;
    email: string;
  };
  id: string;
  status: ApplicationStatus;
  createdAt: Date;
  updatedAt: Date;
  resumeUrl: string;
  coverLetter: string | null;
  statusHistory: JSON;
}

interface Pagination {
  total: number
  page: number
  limit: number
  totalPages: number
}

const JobApplicants = () => {
  const [page, setPage] = useState(1)
  const searchParams = useSearchParams()
  const { slug } = useParams()
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [activeTab, setActiveTab] =
    useState<'ALL' | ApplicationStatus>('ALL')
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || '')
  const router = useRouter()
  const [selectedApplicants, setSelectedApplicants] = useState<string[]>([])
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false)
  const [bulkAction, setBulkAction] = useState<'update_status' | 'reject' | null>(null)
  const [bulkStatus, setBulkStatus] = useState<ApplicationStatus | ''>('APPLIED')
  const [bulkRejectReason, setBulkRejectReason] = useState('')
  const debouncedSearch = useDebounce(search, 500)
  const queryClient = useQueryClient()
  const [isRefreshing, setIsRefreshing] = useState(false);

  const {
    data,
    isLoading,
    isFetching,
    refetch
  } = useQuery({
    queryKey: [
      'job-applications',
      slug,
      page,
      debouncedSearch,
      activeTab,
      sortBy
    ],
    queryFn: async () => {

      const params = new URLSearchParams()

      if (debouncedSearch) params.set('search', debouncedSearch)
      if (activeTab !== 'ALL') params.set('status', activeTab)
      if (sortBy) params.set('sortBy', sortBy)

      params.set('page', page.toString())
      params.set('limit', '12')

      const res = await AppSdk.getData(
        `/api/company/applications/${slug}?${params.toString()}`,
        null
      )

      if (res.error) {
        throw new Error(res.error)
      }

      return res
    },
    placeholderData: (prev) => prev,
    staleTime: 1000 * 60 * 5
  })

  const applications: Applications[] | null = data?.applications || null
  const pagination: Pagination = data?.pagination
  const job: {
    id: string;
    title: string;
  } | null = data?.job || null
  const stats: Stats | null = data?.stats || null

  useEffect(() => {
    //eslint-disable-next-line
    setPage(1)
  }, [debouncedSearch, activeTab, sortBy])

  useEffect(() => {
    const params = new URLSearchParams()
    if (debouncedSearch) params.set('search', debouncedSearch)
    if (activeTab !== 'ALL') params.set('status', activeTab)
    if (sortBy) params.set('sortBy', sortBy)
    if (page > 1) params.set('page', page.toString())

    router.push(`/company/applications/${slug}/?${params.toString()}`, { scroll: false })
  }, [debouncedSearch, activeTab, sortBy, page, router, slug])

  const checkBoxHandler = (appId: string) => {
    setSelectedApplicants(prev => {
      if (prev.includes(appId)) {
        return prev.filter(id => id !== appId)
      }
      return [...prev, appId]
    })
  }

  const bulkMutation = useMutation({
    mutationFn: async () => {
      return AppSdk.patchData('/api/company/applications/bulk', {
        applicationIds: selectedApplicants,
        action: bulkAction,
        status: bulkStatus,
        rejectReason: bulkRejectReason
      })
    },

    onSuccess: (res) => {
      toast.success(res.message)

      queryClient.invalidateQueries({
        queryKey: ['job-applications', slug]
      })
      queryClient.invalidateQueries({
        queryKey: ['applications']
      })

      setSelectedApplicants([])
      setIsBulkModalOpen(false)
      setBulkRejectReason('')
    },
    onSettled: () => {
      toast.dismiss()
    }
  })

  const handleBulkAction = async () => {
    if (selectedApplicants.length === 0) {
      toast.error('No applicants selected')
      return
    }

    if (!bulkAction) return

    toast.loading('Processing bulk action...')

    bulkMutation.mutate()
  }

  const isBulkProcessing = bulkMutation.isPending

  useEffect(() => {

    if (!data) return

    const nextPage = page + 1

    if (nextPage <= data.pagination.totalPages) {

      queryClient.prefetchQuery({
        queryKey: [
          'job-applications',
          slug,
          nextPage,
          debouncedSearch,
          activeTab,
          sortBy
        ],
        queryFn: async () => {

          const params = new URLSearchParams()

          if (debouncedSearch) params.set('search', debouncedSearch)
          if (activeTab !== 'ALL') params.set('status', activeTab)
          if (sortBy) params.set('sortBy', sortBy)

          params.set('page', nextPage.toString())
          params.set('limit', '12')

          return AppSdk.getData(
            `/api/company/applications/${slug}?${params.toString()}`,
            null
          )
        }
      })

    }

  }, [data, page, slug, debouncedSearch, activeTab, sortBy, queryClient])

  useEffect(() => {
    //eslint-disable-next-line
    setSelectedApplicants([])
  }, [debouncedSearch, activeTab, sortBy, isRefreshing])

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 p-6">
        <section className="grid grid-cols-1 max-w-full md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <StatCardSkeleton key={i} />
          ))}
        </section>
        <TableSkeleton columns={5} rows={8} />
      </div>
    )
  }


  if (!applications) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="text-center">
          <p className="text-muted-foreground">
            Failed to load applications dashboard
          </p>
          <Button onClick={
            () => {
              refetch()
            }
          } className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    )
  }

  const selectAllApplicants = () => {
    if (selectedApplicants.length === applications.length) {
      setSelectedApplicants([])
    } else {
      setSelectedApplicants(applications.map(app => app.id))
    }
  }


  return (
    <div className="p-4 md:p-8 space-y-8 w-full md:max-w-[1400px] md:mx-auto max-sm:max-w-screen">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {job?.title || slug}
        </h1>
        <p className="text-muted-foreground mt-1">
          View and manage job applicants
        </p>
      </div>

      {stats &&
        <section className="grid grid-cols-1 max-w-full md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          <StatCard
            title="Total"
            value={stats.total}
            icon={<Layers className="h-5 w-5" />}
            color="bg-gray-500/10 text-gray-600"
          />
          <StatCard
            title="Reviewing"
            value={stats.reviewing}
            icon={<Eye className="h-5 w-5" />}
            color="bg-yellow-500/10 text-yellow-600"
          />
          <StatCard
            title="Shortlisted"
            value={stats.shortlisted}
            icon={<UserCheck className="h-5 w-5" />}
            color="bg-purple-500/10 text-purple-600"
          />
          <StatCard
            title="Interview Scheduled"
            value={stats.interviewScheduled}
            icon={<CalendarClock className="h-5 w-5" />}
            color="bg-indigo-500/10 text-indigo-600"
          />
          <StatCard
            title="Rejected"
            value={stats.rejected}
            icon={<XCircle className="h-5 w-5" />}
            color="bg-red-500/10 text-red-600"
          />
          <StatCard
            title="Hired"
            value={stats.hired}
            icon={<CheckCircle className="h-5 w-5" />}
            color="bg-emerald-500/10 text-emerald-600"
          />
        </section>
      }

      <div>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border border-border/60 bg-card rounded-2xl p-4">
          <FormSelect
            options={APPLICATION_TABS_WITH_SORT}
            disabled={isLoading}
            placeholder='Filters'
            onChange={(value) => {
              setPage(1)

              if (value === 'name' || value === 'recent' || value === 'oldest') {
                setSortBy(value)
                setActiveTab('ALL')
                return
              }

              if (value === 'ALL') {
                setActiveTab('ALL')
                setSortBy('')
                return
              }

              setActiveTab(value as ApplicationStatus)
              setSortBy('')
            }}
            className='py-2! w-full md:w-80'
          />
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search applicants..."
              className="w-full md:w-64 rounded-xl border border-border/60 bg-background pl-9 pr-4 py-2 text-sm outline-none focus:border-primary/40"
              aria-label="Search applicants"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs"
              >
                Clear
              </button>
            )}
          </div>
          <Button
            className='flex items-center gap-2'
            disabled={isRefreshing}
            onClick={() => {
              if (isRefreshing) return;
              setPage(1)
              setActiveTab('ALL')
              setSortBy('')
              setSearch('')

              setIsRefreshing(true);
              refetch();

              setTimeout(() => setIsRefreshing(false), 1000);
            }}>
            <RefreshCw
              size={16}
              className={clsx(
                'transition',
                isRefreshing && 'animate-spin opacity-50 cursor-not-allowed'
              )}
            />
            Refresh

          </Button>
        </div>
        <div className="flex items-center  gap-4 mt-4">
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-semibold text-foreground">{applications.length} </span>
            of <span className="font-semibold text-foreground">{pagination?.total}</span> applicants
          </p>

        </div>
      </div>
      {selectedApplicants.length > 0 && (
        <div className="flex items-center gap-4 rounded-xl border border-primary/40 bg-primary/5 px-4 py-3 max-sm:flex-col max-sm:items-start">
          <p className="text-sm font-semibold text-primary">
            {selectedApplicants.length} applicant{selectedApplicants.length > 1 ? 's' : ''} selected
          </p>

          <div className="flex gap-2 ml-auto max-sm:items-start max-sm:ml-0">
            <Button
              size="sm"
              variant="outline"
              className="flex items-center gap-1"
              onClick={() => {
                setBulkAction('update_status')
                setIsBulkModalOpen(true)
              }}
            >
              <UserCheck className="h-4 w-4" />
              Update Status
            </Button>

            <Button
              size="sm"
              variant="danger"
              className='flex items-center gap-1'
              onClick={() => {
                setBulkAction('reject')
                setIsBulkModalOpen(true)
              }}
            >
              <XCircle className="h-4 w-4" />
              Reject All
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={() => setSelectedApplicants([])}
            >
              Clear Selection
            </Button>
          </div>
        </div>
      )}
      <>
        {
          isFetching ? (
            <TableSkeleton columns={5} rows={5} />
          ) : (
            applications.length > 0 ?
              <ApplicationsTableForJob
                applications={applications}
                selectAllApplicants={selectAllApplicants}
                selectedApplicants={selectedApplicants}
                applicationsLength={applications.length}
                checkBoxHandler={checkBoxHandler}
                isBulkProcessing={isBulkProcessing}
                jobId={job?.id || ''}
              /> : (
                <div className="flex flex-col items-center justify-center py-20 text-center space-y-3">
                  <FileText className="h-10 w-10 text-muted-foreground" />

                  <p className="text-lg font-medium">
                    No applicants found
                  </p>

                  <p className="text-sm text-muted-foreground max-w-md">
                    {activeTab !== 'ALL' && search
                      ? `No applicants match the "${getLabel(
                        APPLICATIONS_TABS,
                        activeTab,
                      )}" status with search term "${search}". `
                      : activeTab !== 'ALL'
                        ? `No applicants found under "${getLabel(
                          APPLICATIONS_TABS,
                          activeTab,
                        )}" status. `
                        : search
                          ? `No applicants match the search term "${search}". `
                          : `There are no applicants for this job yet. `}
                    try adjusting your filters to find what you&apos;re looking for.
                  </p>

                  {(activeTab !== 'ALL' || search) && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setActiveTab('ALL')
                        setSearch('')
                      }}
                    >
                      Clear Filters
                    </Button>
                  )}
                </div>
              )
          )
        }
      </>

      {
        !isLoading && pagination && pagination.totalPages > 1 && (
          <div className="mt-8">
            <Pagination
              page={page}
              totalPages={pagination.totalPages}
              onPageChange={(p) => setPage(p)}
            />
          </div>
        )
      }

      <Modal
        open={isBulkModalOpen}
        onClose={() => {
          if (!isBulkProcessing) {
            setIsBulkModalOpen(false)
            setBulkRejectReason('')
          }
        }}
      >
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">
            {bulkAction === 'reject' ? 'Bulk Reject Applications' : 'Bulk Update Status'}
          </h3>

          <p className="text-sm text-muted-foreground">
            This action will update <span className="font-semibold">{selectedApplicants.length}</span> application
            {selectedApplicants.length > 1 ? 's' : ''}.
          </p>

          {bulkAction === 'update_status' && (
            <div>
              <label className="text-sm font-medium mb-2 block">New Status</label>
              <select
                value={bulkStatus}
                onChange={(e) => setBulkStatus(e.target.value as ApplicationStatus)}
                disabled={isBulkProcessing}
                className="w-full rounded-xl border border-border/60 bg-background px-4 py-3 text-sm outline-none focus:border-primary/40"
              >
                {Object.values(ApplicationStatus).filter(s => s !== 'REJECTED').map((status) => (
                  <option key={status} value={status}>
                    {getLabel(APPLICATIONS_TABS, status)}
                  </option>
                ))}
              </select>
            </div>
          )}

          {bulkAction === 'reject' && (
            <div>
              <label className="text-sm font-medium mb-2 block">Rejection Reason (Optional)</label>
              <textarea
                value={bulkRejectReason}
                onChange={(e) => setBulkRejectReason(e.target.value)}
                placeholder="Add internal notes..."
                rows={4}
                disabled={isBulkProcessing}
                className="w-full rounded-xl border border-border/60 bg-background px-4 py-3 text-sm outline-none focus:border-primary/40" />
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => setIsBulkModalOpen(false)}
              disabled={isBulkProcessing}
            >
              Cancel
            </Button>

            <Button
              variant={bulkAction === 'reject' ? 'danger' : 'primary'}
              onClick={handleBulkAction}
              disabled={isBulkProcessing}
            >
              {isBulkProcessing ? <Spinner className="h-4 w-4" /> : 'Confirm'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default JobApplicants





