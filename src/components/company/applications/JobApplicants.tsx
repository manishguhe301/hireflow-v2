'use client'
import { AppSdk } from '@/src/utils/AppSdk';
import { ApplicationStatus, CurrentEmployment, ExperienceLevel } from '@prisma/client';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner';
import { Spinner } from '../../elements/Loader';
import { Button } from '../../ui/Button';
import { StatCard } from './CompanyApplicationsDashboard';
import { CalendarClock, CheckCircle, Eye, Layers, UserCheck, XCircle } from 'lucide-react';

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

interface Applications {
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

interface JobApplication {
  job: {
    id: string;
    title: string;
  };
  applications: Applications[];
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
  };
  stats: Stats
}

const JobApplicants = () => {
  const [data, setData] = useState<JobApplication | null>(null)
  const [applicationsLoading, setApplicationsLoading] = useState(true)
  const [page, setPage] = useState(1)
  const searchParams = useSearchParams()
  const { slug } = useParams()
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [status, setStatus] = useState(searchParams.get('status') || '')
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || '')
  const router = useRouter()

  const fetchApplicationsAndStats = async () => {
    try {
      const params = new URLSearchParams()
      if (search) params.set('search', search)
      if (status) params.set('status', status)
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

      setData(res)
    } catch (error) {
      console.error(error)
      toast.error('Failed to load applications')
    } finally {
      setApplicationsLoading(false)
    }
  }

  useEffect(() => {
    fetchApplicationsAndStats()
  }, [page])

  useEffect(() => {
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (status) params.set('status', status)
    if (sortBy) params.set('sortBy', sortBy)
    if (page > 1) params.set('page', page.toString())

    router.push(`/company/applications/${slug}/?${params.toString()}`, { scroll: false })
  }, [search, status, sortBy, page, router])

  useEffect(() => {
    const shouldDebounce = search.length > 0 || status || sortBy
    const delay = shouldDebounce ? 500 : 0

    const timer = setTimeout(() => {
      fetchApplicationsAndStats()
    }, delay)

    return () => clearTimeout(timer)
  }, [search, status, page, sortBy])

  if (applicationsLoading) {
    return (
      <div className="flex items-center justify-center gap-2 min-h-[500px]">
        Loading...<Spinner className="h-4 w-4" />
      </div>
    )
  }

  if (!data) {
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

  return (
    <div className=" p-4 md:p-8 space-y-8 w-full md:max-w-[1400px] md:mx-auto max-sm:max-w-screen">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {data.job.title}
        </h1>
        <p className="text-muted-foreground mt-1">
          View and manage job applicants
        </p>
      </div>

      {data.stats &&
        <section className="grid grid-cols-1 max-w-full md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          <StatCard
            title="Total"
            value={data.stats.total}
            icon={<Layers className="h-5 w-5" />}
            color="bg-gray-500/10 text-gray-600"
          />
          <StatCard
            title="Reviewing"
            value={data.stats.reviewing}
            icon={<Eye className="h-5 w-5" />}
            color="bg-yellow-500/10 text-yellow-600"
          />
          <StatCard
            title="Shortlisted"
            value={data.stats.shortlisted}
            icon={<UserCheck className="h-5 w-5" />}
            color="bg-purple-500/10 text-purple-600"
          />
          <StatCard
            title="Interview Scheduled"
            value={data.stats.interviewScheduled}
            icon={<CalendarClock className="h-5 w-5" />}
            color="bg-indigo-500/10 text-indigo-600"
          />
          <StatCard
            title="Rejected"
            value={data.stats.rejected}
            icon={<XCircle className="h-5 w-5" />}
            color="bg-red-500/10 text-red-600"
          />
          <StatCard
            title="Hired"
            value={data.stats.hired}
            icon={<CheckCircle className="h-5 w-5" />}
            color="bg-emerald-500/10 text-emerald-600"
          />
        </section>
      }
    </div>
  )
}

export default JobApplicants