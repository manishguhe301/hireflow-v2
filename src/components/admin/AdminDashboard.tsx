'use client'
import { AppSdk } from '@/src/utils/AppSdk'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Spinner } from '../elements/Loader'
import {
  Building2,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  UserCog,
  Briefcase,
  ArrowRight,
  FileText,
  TrendingUp,
  Activity,
} from 'lucide-react'
import Link from 'next/link'
import StatCard from './StatCard'
import { Button } from '../ui/Button'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { formatRelativeTime } from '@/src/utils/helper'
import { useQuery } from '@tanstack/react-query'

interface DashboardStats {
  companies: {
    total: number
    pending: number
    rejected: number
    approved: number
  }
  users: {
    total: number
    jobSeekers: number
    admins: number
  }
  platform: {
    totalJobs: number
    totalApplications: number
    recentApprovals: number
    recentRejections: number
  }
  analytics: {
    userGrowth: { month: string; users: number }[]
    jobTrends: { month: string; jobs: number }[]
    topCompanies: { name: string; jobs: number }[]
    recentActivity: {
      action: string
      timestamp: Date
      details: string
    }[]
  }
}

const AdminDashboard = () => {
  // const [isLoading, setIsLoading] = useState(true)
  // const [stats, setStats] = useState<DashboardStats | null>(null)

  // const fetchStats = async () => {
  //   if (!isLoading) setIsLoading(true)
  //   try {
  //     const res = await AppSdk.getData('/api/admin/stats', null)
  //     if (res.error) {
  //       toast.error(res.error || 'Failed to fetch stats, please try again.')
  //       return
  //     }
  //     setStats(res)
  //   } catch (error) {
  //     console.error(error)
  //     toast.error('Failed to fetch stats, please try again.')
  //   } finally {
  //     setIsLoading(false)
  //   }
  // }

  // useEffect(() => {
  //   fetchStats()
  // }, [])

  const { data: stats, isLoading, refetch, isError } = useQuery({
    queryKey: ['admin-dashboard-stats'],
    queryFn: async () => {
      const res = await AppSdk.getData('/api/admin/stats', null)

      if (res.error) {
        throw new Error(res.error || 'Failed to fetch stats')
      }

      return res as DashboardStats
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <Spinner className="h-8 w-8" />
      </div>
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

  return (
    <div className="p-4 md:p-8 space-y-10 max-w-[1400px] mx-auto">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Manage companies, users, and platform settings
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Platform Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Jobs"
            value={stats.platform.totalJobs}
            description="Posted on platform"
            icon={<Briefcase className="h-6 w-6 text-primary" />}
            colorClass="bg-primary/10"
          />
          <StatCard
            title="Applications"
            value={stats.platform.totalApplications}
            description="Total submissions"
            icon={<FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />}
            colorClass="bg-info/10"
          />
          <StatCard
            title="Approved (30d)"
            value={stats.platform.recentApprovals}
            description="Companies approved"
            icon={<CheckCircle className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />}
            colorClass="bg-success/10"
          />
          <StatCard
            title="Rejected (30d)"
            value={stats.platform.recentRejections}
            description="Companies rejected"
            icon={<XCircle className="h-6 w-6 text-red-600 dark:text-red-400" />}
            colorClass="bg-destructive/10"
          />
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Companies Overview</h2>
          <Link
            href="/admin/companies"
            className="text-sm text-primary hover:underline flex items-center gap-1"
          >
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Companies"
            value={stats.companies.total}
            description="All registered companies"
            icon={<Building2 className="h-6 w-6 text-blue-600 dark:text-blue-400" />}
            colorClass="bg-info/10"
          />
          <StatCard
            title="Pending Approval"
            value={stats.companies.pending}
            description="Awaiting admin review"
            icon={<Clock className="h-6 w-6 text-amber-500 dark:text-amber-400" />}
            colorClass="bg-warning/10"
          />
          <StatCard
            title="Approved"
            value={stats.companies.approved}
            description="Active companies"
            icon={<CheckCircle className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />}
            colorClass="bg-success/10"
          />
          <StatCard
            title="Rejected"
            value={stats.companies.rejected}
            description="Declined companies"
            icon={<XCircle className="h-6 w-6 text-red-600 dark:text-red-400" />}
            colorClass="bg-destructive/10"
          />
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Users Overview</h2>
          <Link
            href="/admin/users"
            className="text-sm text-primary hover:underline flex items-center gap-1"
          >
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="Total Users"
            value={stats.users.total}
            description="All platform users"
            icon={<Users className="h-6 w-6 text-violet-600 dark:text-violet-400" />}
            colorClass="bg-info/10"
          />
          <StatCard
            title="Job Seekers"
            value={stats.users.jobSeekers}
            description="Active job seekers"
            icon={<Briefcase className="h-6 w-6 text-primary" />}
            colorClass="bg-primary/10"
          />
          <StatCard
            title="Platform Admins"
            value={stats.users.admins}
            description="Admin accounts"
            icon={<UserCog className="h-6 w-6 text-slate-600 dark:text-slate-400" />}
            colorClass="bg-muted"
          />
        </div>
      </section>

      {stats.analytics.userGrowth.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-semibold">User Growth (Last 12 Months)</h2>
          </div>
          <div className="bg-card border border-border/60 rounded-2xl p-6">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={stats.analytics.userGrowth}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--border))" />
                <XAxis dataKey="month" stroke="rgb(var(--muted-foreground))" />
                <YAxis stroke="rgb(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgb(var(--card))',
                    border: '1px solid rgb(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="users"
                  stroke="rgb(var(--primary))"
                  strokeWidth={2}
                  dot={{ fill: 'rgb(var(--primary))' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>
      )}

      {stats.analytics.jobTrends.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Job Posting Trends (Last 12 Months)</h2>
          <div className="bg-card border border-border/60 rounded-2xl p-6">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.analytics.jobTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--border))" />
                <XAxis dataKey="month" stroke="rgb(var(--muted-foreground))" />
                <YAxis stroke="rgb(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgb(var(--card))',
                    border: '1px solid rgb(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="jobs" fill="rgb(var(--primary))" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      )}

      {stats.analytics.topCompanies.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Top Companies by Job Count</h2>
          <div className="bg-card border border-border/60 rounded-2xl p-6">
            <div className="space-y-4">
              {stats.analytics.topCompanies.map((company, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold text-sm">
                      {index + 1}
                    </div>
                    <p className="font-medium">{company.name}</p>
                  </div>
                  <span className="text-muted-foreground">{company.jobs} jobs</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          <h2 className="text-2xl font-semibold">Recent Activity</h2>
        </div>
        {stats.analytics.recentActivity.length > 0 ? (
          <div className="space-y-3">
            {stats.analytics.recentActivity.map((activity, index) => (
              <div
                key={index}
                className="block rounded-xl border border-border/60 bg-card p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium">{activity.action}</p>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {activity.details}
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground whitespace-nowrap">
                    {formatRelativeTime(activity.timestamp)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Activity className="h-10 w-10 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No recent activity</p>
          </div>
        )}
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/admin/companies"
            className="p-6 bg-card border border-border/60 rounded-2xl hover:border-primary/40 transition hover:shadow-lg group"
          >
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-info/10 flex items-center justify-center transition">
                <Building2 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="font-semibold">Manage Companies</p>
                <p className="text-sm text-muted-foreground">
                  Review and approve companies
                </p>
              </div>
            </div>
          </Link>

          <Link
            href="/admin/users"
            className="p-6 bg-card border border-border/60 rounded-2xl hover:border-primary/40 transition hover:shadow-lg group"
          >
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center transition">
                <Users className="h-6 w-6 text-violet-600 dark:text-violet-400" />
              </div>
              <div>
                <p className="font-semibold">Manage Users</p>
                <p className="text-sm text-muted-foreground">
                  View and manage all users
                </p>
              </div>
            </div>
          </Link>

          <Link
            href="/admin/create-admin"
            className="p-6 bg-card border border-border/60 rounded-2xl hover:border-primary/40 transition hover:shadow-lg group"
          >
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center transition">
                <UserCog className="h-6 w-6 text-slate-600 dark:text-slate-400" />
              </div>
              <div>
                <p className="font-semibold">Create Admin</p>
                <p className="text-sm text-muted-foreground">
                  Add new platform admin
                </p>
              </div>
            </div>
          </Link>
        </div>
      </section>
    </div>
  )
}

export default AdminDashboard