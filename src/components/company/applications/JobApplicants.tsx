'use client'
import { AppSdk } from '@/src/utils/AppSdk';
import { ApplicationStatus, CurrentEmployment, ExperienceLevel } from '@prisma/client';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner';
import { Spinner } from '../../elements/Loader';
import { Button } from '../../ui/Button';
import { StatCard } from './CompanyApplicationsDashboard';
import { CalendarClock, CheckCircle, Eye, FileText, Layers, Search, UserCheck, XCircle } from 'lucide-react';
import Pagination from '../../ui/Pagination';
import { APPLICATION_TABS_WITH_SORT, APPLICATIONS_TABS, getLabel } from '@/src/utils/helper';
import { FormSelect } from '../../ui/FormSelect';
import ApplicationsTableForJob from './ApplicationsTableForJob';

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
  const [applications, setApplications] = useState<Applications[] | null>(null)
  const [applicationsLoading, setApplicationsLoading] = useState(true)
  const [page, setPage] = useState(1)
  const searchParams = useSearchParams()
  const { slug } = useParams()
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [activeTab, setActiveTab] =
    useState<'ALL' | ApplicationStatus>('ALL')
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || '')
  const [pagination, setPagination] = useState<Pagination | null>(null)
  const [job, setJob] = useState<{
    id: string;
    title: string;
  } | null>(null)
  const [stats, setStats] = useState<Stats | null>(null)
  const [fetchingApplicationsforFilter, setFetchingApplicationsforFilter] = useState(false)
  const router = useRouter()
  const [selectedApplicants, setSelectedApplicants] = useState<string[]>([])

  const fetchApplicationsAndStats = async () => {
    setFetchingApplicationsforFilter(true)
    try {
      const params = new URLSearchParams()
      if (search) params.set('search', search)
      if (activeTab !== 'ALL') params.set('status', activeTab)
      if (sortBy) params.set('sortBy', sortBy)
      params.set('page', page.toString())
      params.set('limit', '12')

      const res = await AppSdk.getData(
        `/api/company/applications/${slug}?${params.toString()}`,
        null,
      )

      if (res.error) {
        toast.error(res.error)
        return
      }

      setApplications(res.applications)
      setPagination(res.pagination)
      setJob(res.job)
      setStats(res.stats)
    } catch (error) {
      console.error(error)
      toast.error('Failed to load applications')
    } finally {
      setApplicationsLoading(false)
      setFetchingApplicationsforFilter(false)
    }
  }

  useEffect(() => {
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (activeTab !== 'ALL') params.set('status', activeTab)
    if (sortBy) params.set('sortBy', sortBy)
    if (page > 1) params.set('page', page.toString())

    router.push(`/company/applications/${slug}/?${params.toString()}`, { scroll: false })
  }, [search, activeTab, sortBy, page, router])

  useEffect(() => {
    const shouldDebounce = search.length > 0 || activeTab || sortBy
    const delay = shouldDebounce ? 500 : 0

    const timer = setTimeout(() => {
      fetchApplicationsAndStats()
    }, delay)

    return () => clearTimeout(timer)
  }, [search, activeTab, page, sortBy])

  useEffect(() => {
    console.log(selectedApplicants);
  }, [selectedApplicants])


  if (applicationsLoading) {
    return (
      <div className="flex items-center justify-center gap-2 min-h-[500px]">
        Loading...<Spinner className="h-4 w-4" />
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
              fetchApplicationsAndStats()
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

  const checkBoxHandler = (appId: string) => {
    setSelectedApplicants(prev => {
      if (prev.includes(appId)) {
        return prev.filter(id => id !== appId)
      }
      return [...prev, appId]
    })
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
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <p className="text-muted-foreground text-sm">
            {applicationsLoading ? 'Loading...' : `Showing ${applications.length} of ${pagination?.total} applicants`}
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <FormSelect
          options={APPLICATION_TABS_WITH_SORT}
          disabled={applicationsLoading}
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
            className="w-full rounded-xl border border-border/60 bg-background pl-9 pr-4 py-2 text-sm outline-none focus:border-primary/40"
          />
        </div>
      </div>
      {
        applicationsLoading || fetchingApplicationsforFilter ? (
          <div className="flex items-center justify-center min-h-[200px]">
            <Spinner className="h-8 w-8" />
          </div>
        ) : (
          applications.length > 0 ?
            <ApplicationsTableForJob
              applications={applications}
              fetchApplications={fetchApplicationsAndStats}
              selectAllApplicants={selectAllApplicants}
              selectedApplicants={selectedApplicants}
              applicationsLength={applications.length}
              checkBoxHandler={checkBoxHandler}
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

      {
        !applicationsLoading && pagination && pagination.totalPages > 1 && (
          <div className="mt-8">
            <Pagination
              page={page}
              totalPages={pagination.totalPages}
              onPageChange={(p) => setPage(p)}
            />
          </div>
        )
      }
    </div>
  )
}

export default JobApplicants





