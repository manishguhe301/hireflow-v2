'use client'
import { AppSdk } from '@/src/utils/AppSdk'
import {
  Building2,
  Users,
  UserCog,
  ArrowRight,
  TrendingUp,
  Activity,
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '../ui/Button'
import { useQuery } from '@tanstack/react-query'
import AdminDashboardSkeleton from '../skeletons/DashboardSkeleton'
import CompanyOverView from './dashboard/CompanyOverView'
import UsersOverView from './dashboard/UsersOverView'
import UserGrowthChart from './dashboard/UserGrowthChart'
import JobTrendsChart from './dashboard/JobTrendsChart'
import TopCompanyCard from './dashboard/TopCompanyCard'
import RecentActivity from './dashboard/RecentActivity'
import PlatFormOverView from './dashboard/PlatFormOverView'
import QuickActionLink from '../shared/QuickActionLink'
import { AdminDashboardStats } from '@/src/types'

const AdminDashboard = () => {
  const { data: stats, isLoading, refetch, isError } = useQuery({
    queryKey: ['admin-dashboard-stats'],
    queryFn: async () => {
      const res = await AppSdk.getData('/api/admin/stats', null)

      if (res.error) {
        throw new Error(res.error || 'Failed to fetch stats')
      }

      return res as AdminDashboardStats
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  })

  if (isLoading) {
    return (
      <AdminDashboardSkeleton />
    )
  }

  if (!stats || isError) {
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

  const pendingCount = stats.companies.pending

  return (
    <div className="p-4 md:p-8 space-y-10 max-w-[1400px] mx-auto">
      {stats.companies.pending > 0 && (
        <div className="bg-warning/10 border border-warning/30 rounded-xl p-4">
          <p className="text-sm font-medium">
            {pendingCount} {pendingCount === 1 ? 'company' : 'companies'} awaiting approval
          </p>
        </div>
      )}
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Manage companies, users, and platform settings
        </p>
      </div>
      <section className="space-y-4 pt-2">
        <h2 className="text-2xl font-semibold tracking-tight">Platform Overview</h2>
        <PlatFormOverView stats={stats} />
      </section>

      <section className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold tracking-tight">Companies Overview</h2>
          <Link
            href="/admin/companies"
            className="text-sm text-primary hover:underline flex items-center gap-1"
          >
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <CompanyOverView stats={stats} />
      </section>

      <section className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold tracking-tight">Users Overview</h2>
          <Link
            href="/admin/users"
            className="text-sm text-primary hover:underline flex items-center gap-1"
          >
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <UsersOverView stats={stats} />
      </section>

      {stats.analytics.userGrowth.length > 0 && (
        <section className="space-y-4 pt-2">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-semibold tracking-tight">User Growth (Last 12 Months)</h2>
          </div>
          <UserGrowthChart stats={stats} />
        </section>
      )}

      {stats.analytics.jobTrends.length > 0 && (
        <section className="space-y-4 pt-2">
          <h2 className="text-2xl font-semibold tracking-tight">Job Posting Trends (Last 12 Months)</h2>
          <JobTrendsChart stats={stats} />
        </section>
      )}

      {stats.analytics.topCompanies.length > 0 && (
        <section className="space-y-4 pt-2">
          <h2 className="text-2xl font-semibold tracking-tight">Top Companies by Job Count</h2>
          <div className="bg-card border border-border/60 rounded-2xl p-6">
            <div className="space-y-4 pt-2">
              {stats.analytics.topCompanies.map((company, index) => (
                <TopCompanyCard company={company} index={index} key={index} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="space-y-4 pt-2">
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          <h2 className="text-2xl font-semibold tracking-tight">Recent Activity</h2>
        </div>
        {stats.analytics.recentActivity.length > 0 ? (
          <div className="space-y-3">
            <RecentActivity stats={stats} />
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Activity className="h-10 w-10 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No recent activity</p>
          </div>
        )}
      </section>

      <section className="space-y-4 pt-2">
        <h2 className="text-2xl font-semibold tracking-tight">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <QuickActionLink
            href="/admin/companies"
            icon={
              <Building2 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            }
            description='Review and approve companies'
            title='Manage Companies'
          />
          <QuickActionLink
            href='/admin/users'
            icon={
              <Users className="h-6 w-6 text-violet-600 dark:text-violet-400" />
            }
            title='Manage Users'
            description='View and manage all users'
          />
          <QuickActionLink
            href='/admin/create-admin'
            icon={
              <UserCog className="h-6 w-6 text-slate-600 dark:text-slate-400" />
            }
            title='Create Admin'
            description='Add new platform admin'
          />
        </div>
      </section>
    </div>
  )
}

export default AdminDashboard