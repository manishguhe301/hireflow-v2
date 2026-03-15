'use client'
import { AppSdk } from '@/src/utils/AppSdk';
import { ApplicationStatus, CurrentEmployment, ExperienceLevel } from '@prisma/client';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react'
import { toast } from 'sonner';
import { Button } from '../../ui/Button';
import Pagination from '../../ui/Pagination';
import ApplicationsTableForJob from './ApplicationsTableForJob';
import useDebounce from '@/src/store/hooks/useDebounce';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { StatCardSkeleton } from '../../skeletons/StatCardSkeleton';
import TableSkeleton from '../../skeletons/TableSkeleton';
import ApplicationStats from './ApplicationStats';
import BulkActionModal from './BulkActionModal';
import JobApplicationFilters from './JobApplicationFilters';
import SelectedApplicantsUI from './SelectedApplicantsUI';
import NoApplications from './NoApplications';

export interface Stats {
  total: number,
  applied: number,
  reviewing: number,
  shortlisted: number
  interviewScheduled: number
  rejected: number,
  offered: number,
  hired: number,
  onHold: number
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
  const [bulkStatus, setBulkStatus] = useState<ApplicationStatus | ''>('REVIEWING')
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
      queryClient.invalidateQueries({
        queryKey: ['company-dashboard']
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
        <ApplicationStats stats={stats} />
      }
      <JobApplicationFilters
        isLoading={isLoading}
        isRefreshing={isRefreshing}
        refetch={refetch}
        search={search}
        setActiveTab={setActiveTab}
        setIsRefreshing={setIsRefreshing}
        setPage={setPage}
        setSearch={setSearch}
        setSortBy={setSortBy}
        paginationTotal={pagination?.total}
        applicationsLength={applications?.length}
      />
      {selectedApplicants.length > 0 && (
        <SelectedApplicantsUI
          selectedApplicantsLength={selectedApplicants.length}
          setSelectedApplicants={setSelectedApplicants}
          setIsBulkModalOpen={setIsBulkModalOpen}
          setBulkAction={setBulkAction}
        />
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
                <NoApplications
                  activeTab={activeTab}
                  search={search}
                  setActiveTab={setActiveTab}
                  setSearch={setSearch}
                />
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

      <BulkActionModal
        isBulkModalOpen={isBulkModalOpen}
        setIsBulkModalOpen={setIsBulkModalOpen}
        bulkAction={bulkAction}
        bulkRejectReason={bulkRejectReason}
        bulkStatus={bulkStatus}
        handleBulkAction={handleBulkAction}
        isBulkProcessing={isBulkProcessing}
        selectedApplicants={selectedApplicants}
        setBulkRejectReason={setBulkRejectReason}
        setBulkStatus={setBulkStatus}
      />
    </div>
  )
}

export default JobApplicants