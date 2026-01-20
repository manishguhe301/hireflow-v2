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
  ArrowRight
} from 'lucide-react'
import Link from 'next/link'
import StatCard from './StatCard'
import { Button } from '../ui/Button'

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
}

const AdminDashboard = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState<DashboardStats | null>(null)

  const fetchStats = async () => {
    if (!isLoading) setIsLoading(true)
    try {
      const res = await AppSdk.getData('/api/admin/stats', null)
      if (res.error) {
        toast.error(res.error || 'Failed to fetch stats, please try again.')
        return
      }
      setStats(res)
    } catch (error) {
      console.error(error)
      toast.error('Failed to fetch stats, please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <Spinner className="h-8 w-8" />
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="text-center">
          <p className="text-muted-foreground">Failed to load dashboard data</p>
          <Button
            onClick={fetchStats}
            className="mt-4"
          >
            Retry
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 space-y-10 max-w-[1400px] mx-auto animate-in fade-in duration-500">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Manage companies, users, and platform settings
        </p>
      </div>

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
            icon={<Building2 className="h-7 w-7 text-blue-600 dark:text-blue-400" />}
            colorClass="bg-info/10"
          />

          <StatCard
            title="Pending Approval"
            value={stats.companies.pending}
            description="Awaiting admin review"
            icon={<Clock className="h-7 w-7 text-amber-500 dark:text-amber-400" />}
            colorClass="bg-warning/10"
          />

          <StatCard
            title="Approved"
            value={stats.companies.approved}
            description="Active companies"
            icon={<CheckCircle className="h-7 w-7 text-emerald-600 dark:text-emerald-400" />}
            colorClass="bg-success/10"
          />

          <StatCard
            title="Rejected"
            value={stats.companies.rejected}
            description="Declined companies"
            icon={<XCircle className="h-7 w-7 text-red-600 dark:text-red-400" />}
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
            icon={<Users className="h-7 w-7 text-violet-600 dark:text-violet-400" />}
            colorClass="bg-info/10"
          />

          <StatCard
            title="Job Seekers"
            value={stats.users.jobSeekers}
            description="Active job seekers"
            icon={<Briefcase className="h-7 w-7 text-primary" />}
            colorClass="bg-primary/10"
          />

          <StatCard
            title="Platform Admins"
            value={stats.users.admins}
            description="Admin accounts"
            icon={<UserCog className="h-7 w-7 text-slate-600 dark:text-slate-400" />}
            colorClass="bg-muted"
          />


        </div>
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