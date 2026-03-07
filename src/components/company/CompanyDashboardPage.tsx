'use client'

import { useCompany } from '@/src/store/hooks/useCompany'
import { AppSdk } from '@/src/utils/AppSdk'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import {
  Briefcase,
  FileText,
  Eye,
  Users,
} from 'lucide-react'
import Link from 'next/link'
import { formatRelativeTime, getLabel, APPLICATIONS_TABS } from '@/src/utils/helper'
import clsx from 'clsx'
import { Spinner } from '../elements/Loader'
import { Button } from '../ui/Button'
import ApplicationOverTime from './ApplicationOverTime'
import TopJobs from './TopJobs'
import ApplicantionFunnel from './ApplicantionFunnel'
import { useQuery } from '@tanstack/react-query'
import AdminDashboardSkeleton from '../skeletons/DashboardSkeleton'

export interface DashboardStats {
  totalJobs: number
  activeJobs: number
  totalApplications: number
  totalViews: number
  statusBreakdown: {
    applied: number
    reviewing: number
    shortlisted: number
    interview: number
    rejected: number
    offered: number
    hired: number
  }
}

export interface TimeSeriesData {
  date: string
  applications: number
}

export interface RecentApplication {
  id: string
  status: string
  createdAt: string
  user: {
    profile: {
      name: string
      avatar: string | null
    } | null
  }
  job: {
    title: string
    slug: string
  }
}

export interface AnalyticsData {
  applicationsPerJob: {
    jobTitle: string
    applications: number
    views: number
  }[]
  funnel: {
    stage: string
    count: number
    percentage: number
  }[]
}

const StatCard = ({
  title,
  value,
  description,
  icon,
  colorClass,
}: {
  title: string
  value: number | string
  description: string
  icon: React.ReactNode
  colorClass: string
}) => (
  <div className="bg-card border border-border/60 rounded-2xl p-6 hover:border-primary/40 transition hover:shadow-lg">
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <p className="text-4xl font-bold mt-3 mb-2">{value}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <div
        className={`h-14 w-14 rounded-2xl ${colorClass} flex items-center justify-center flex-shrink-0 ml-4`}
      >
        {icon}
      </div>
    </div>
  </div>
)

export default function CompanyDashboard() {
  const { company } = useCompany()
  // const [isLoading, setIsLoading] = useState(true)
  // const [stats, setStats] = useState<DashboardStats | null>(null)
  // const [timeSeriesData, setTimeSeriesData] = useState<TimeSeriesData[]>([])
  // const [recentApplications, setRecentApplications] = useState<RecentApplication[]>([])
  // const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)


  // const fetchDashboardData = async () => {
  //   try {
  //     const [statsRes, analyticsRes] = await Promise.all([
  //       AppSdk.getData('/api/company/dashboard/stats', null),
  //       AppSdk.getData('/api/company/dashboard/analytics', null),
  //     ])

  //     if (statsRes.error) {
  //       toast.error(statsRes.error)
  //     } else {
  //       setStats(statsRes.stats)
  //       setTimeSeriesData(statsRes.timeSeriesData)
  //       setRecentApplications(statsRes.recentApplications)
  //     }

  //     if (analyticsRes.error) {
  //       toast.error(analyticsRes.error)
  //     } else {
  //       setAnalytics(analyticsRes)
  //     }
  //   } catch (err) {
  //     console.error(err)
  //     toast.error('Failed to load dashboard data')
  //   } finally {
  //     setIsLoading(false)
  //   }
  // }

  // useEffect(() => {
  //   fetchDashboardData()
  // }, [])

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['company-dashboard'],
    queryFn: async () => {
      const [statsRes, analyticsRes] = await Promise.all([
        AppSdk.getData('/api/company/dashboard/stats', null),
        AppSdk.getData('/api/company/dashboard/analytics', null),
      ])

      if (statsRes.error) {
        throw new Error(statsRes.error)
      }

      if (analyticsRes.error) {
        throw new Error(analyticsRes.error)
      }

      return {
        stats: statsRes.stats,
        timeSeriesData: statsRes.timeSeriesData,
        recentApplications: statsRes.recentApplications,
        analytics: analyticsRes,
      }
    },
    staleTime: 1000 * 60 * 5,
  })

  const stats: DashboardStats | null = data?.stats ?? null
  const timeSeriesData: TimeSeriesData[] = data?.timeSeriesData ?? []
  const recentApplications: RecentApplication[] = data?.recentApplications ?? []
  const analytics: AnalyticsData = data?.analytics ?? null

  if (isLoading) {
    return (
      <AdminDashboardSkeleton />
    )
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="text-center">
          <p className="text-muted-foreground">Failed to load dashboard data</p>
          <Button onClick={() => refetch()} className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-8 space-y-10 max-w-[1400px] mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Company Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome, {company?.name}</p>
      </div>

      <section className="space-y-6">
        <h2 className="text-xl font-semibold">Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Jobs"
            value={stats.totalJobs}
            description={`${stats.activeJobs} active`}
            icon={<Briefcase className="h-5 w-5" />}
            colorClass="bg-primary/10 text-primary"
          />
          <StatCard
            title="Applications"
            value={stats.totalApplications}
            description="All time"
            icon={<FileText className="h-5 w-5" />}
            colorClass="bg-blue-500/10 text-blue-600"
          />
          <StatCard
            title="Total Views"
            value={stats.totalViews}
            description="Job impressions"
            icon={<Eye className="h-5 w-5" />}
            colorClass="bg-purple-500/10 text-purple-600"
          />
          <StatCard
            title="Hired"
            value={stats.statusBreakdown.hired}
            description="Successful hires"
            icon={<Users className="h-5 w-5" />}
            colorClass="bg-emerald-500/10 text-emerald-600"
          />
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Applications Over Time (Last 30 Days)</h2>
        </div>
        <ApplicationOverTime
          timeSeriesData={timeSeriesData}
        />
      </section>

      {analytics && analytics.applicationsPerJob.length > 0 && (
        <section className="space-y-6">
          <h2 className="text-xl font-semibold">Top Jobs by Applications</h2>
          <TopJobs analytics={analytics} />
        </section>
      )}

      {analytics && (
        <ApplicantionFunnel analytics={analytics} />
      )}

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Recent Applications</h2>
          <Link href="/company/applications" className="text-sm text-primary hover:underline">
            View All →
          </Link>
        </div>
        {recentApplications.length > 0 ? (
          <div className="space-y-3">
            {recentApplications.map((app) => (
              <Link
                key={app.id}
                href={`/company/applications/${app.job.slug}`}
                className="block rounded-xl border border-border/60 bg-card p-4 hover:border-primary/40 hover:shadow-lg transition"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className=" flex items-center gap-3 flex-1 min-w-0">
                    {app.user.profile?.avatar ? (
                      <div className='relative'>

                        <img
                          src={app.user.profile.avatar}
                          alt={app.user.profile.name}
                          // className="h-10 w-10 rounded-full object-cover"
                          className={clsx(
                            "h-10 w-10 object-cover rounded-full transition-opacity duration-300",
                          )}
                        />
                      </div>
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center" >
                        {app.user.profile?.name && app.user.profile.name[0]}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium line-clamp-1">
                        {app.user.profile?.name || 'Anonymous'}
                      </p>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        Applied to {app.job.title}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span
                      className={clsx(
                        'inline-block px-3 py-1 rounded-full text-xs font-medium',
                        app.status === 'APPLIED' && 'bg-blue-500/10 text-blue-600',
                        app.status === 'REVIEWING' && 'bg-yellow-500/10 text-yellow-600',
                        app.status === 'SHORTLISTED' && 'bg-purple-500/10 text-purple-600',
                      )}
                    >
                      {getLabel(APPLICATIONS_TABS, app.status)}
                    </span>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatRelativeTime(app.createdAt)}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="h-10 w-10 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No recent applications</p>
          </div>
        )}
      </section>
    </div>
  )
}
