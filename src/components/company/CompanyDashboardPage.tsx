'use client'

import { useCompany } from '@/src/store/hooks/useCompany'
import { AppSdk } from '@/src/utils/AppSdk'
import {
  Briefcase,
  FileText,
  Wrench,
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '../ui/Button'
import ApplicationOverTime from './ApplicationOverTime'
import TopJobs from './TopJobs'
import ApplicantionFunnel from './ApplicantionFunnel'
import { useQuery } from '@tanstack/react-query'
import AdminDashboardSkeleton from '../skeletons/DashboardSkeleton'
import { AnalyticsData, CompanyDashboardStats, RecentApplication, TimeSeriesData } from '@/src/types'
import RecentApplicationCard from '../shared/RecentApplicationCard'
import QuickActionLink from '../shared/QuickActionLink'
import Overview from './Overview'

export default function CompanyDashboard() {
  const { company } = useCompany()
  const companyName = company?.name

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

  const stats: CompanyDashboardStats | null = data?.stats ?? null
  const timeSeriesData: TimeSeriesData[] = data?.timeSeriesData ?? []
  const recentApplications: RecentApplication[] = data?.recentApplications ?? []
  const analytics: AnalyticsData | null = data?.analytics ?? null

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
        <h1 className="text-3xl font-bold tracking-tight">Welcome, {companyName}</h1>
        <p className="text-muted-foreground mt-1">
          Company Dashboard
        </p>
      </div>

      <section className="space-y-6">
        <h2 className="text-xl font-semibold">Overview</h2>
        <Overview stats={stats} />
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
              <RecentApplicationCard key={app.id} app={app} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="h-10 w-10 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No recent applications</p>
          </div>
        )}
      </section>

      <section className="space-y-4 pt-2">
        <h2 className="text-2xl font-semibold tracking-tight">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <QuickActionLink
            icon={
              <Briefcase className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            }
            title='Create New Job'
            description='Create a new job listing'
            href="/company/jobs/create"
          />
          <QuickActionLink
            icon={
              <FileText className="h-6 w-6 text-violet-600 dark:text-violet-400" />
            }
            description='View and manage job applications'
            href="/company/applications"
            title='Manage Applications'
          />
          <QuickActionLink
            href="/company/jobs"
            icon={
              <Wrench className="h-6 w-6 text-slate-600 dark:text-slate-400" />
            }
            title='Manage Jobs'
            description='View and manage job postings'
          />
        </div>
      </section>
    </div>
  )
}
