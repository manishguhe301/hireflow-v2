'use client'

import { AppSdk } from '@/src/utils/AppSdk'

import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Spinner } from '../../elements/Loader'
import { Button } from '../../ui/Button'
import {
  Layers,
  Send,
  Eye,
  UserCheck,
  CalendarClock,
  XCircle,
  Gift,
  CheckCircle,
} from 'lucide-react'

interface DashboardStats {
  total: number
  applied: number
  reviewing: number
  shortlisted: number
  interviewScheduled: number
  rejected: number
  offered: number
  hired: number
}

const APPLICTION_TABS_STATUS_COLORS = {
  applied: 'bg-blue-500/10 text-blue-600',
  reviewing: 'bg-yellow-500/10 text-yellow-600',
  shortlisted: 'bg-purple-500/10 text-purple-600',
  interviewScheduled: 'bg-indigo-500/10 text-indigo-600',
  offered: 'bg-green-500/10 text-green-600',
  hired: 'bg-emerald-500/10 text-emerald-600',
  rejected: 'bg-red-500/10 text-red-600',
  total: 'bg-gray-500/10 text-gray-600',
}

const DashboardStatCard = ({ title, value, description, icon, colorClass }:
  { title: string, value: number, description: string, icon?: React.ReactNode, colorClass: string }) => {
  return (<div className="bg-card border border-border/60 rounded-2xl p-6 hover:border-primary/40 transition hover:shadow-lg">
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <p className="text-4xl font-bold mt-3 mb-2">{value}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      {icon &&
        <div className={`h-14 w-14 rounded-2xl ${colorClass} flex items-center justify-center flex-shrink-0 ml-4`}>
          {icon}
        </div>
      }
    </div>
  </div>)
}

const JobSeekerDashboard = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState<DashboardStats | null>(null)

  const fetchStats = async () => {
    try {
      const res = await AppSdk.getData('/api/applications/stats', null)

      if (res.error) {
        toast.error(res.error)
        return
      }
      setStats(res.stats)
    } catch (err) {
      console.error(err)
      toast.error('Failed to load applications')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
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
    <div className="p-4 md:p-8 space-y-10 max-w-[1400px] mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Dashboard
        </h1>
        <p className="text-muted-foreground mt-1">
          Here&apos;s a summary of your job applications
        </p>
      </div>

      <div className="grid grid-cols-1 max-w-full md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4">
        <DashboardStatCard
          title="Total"
          value={stats.total}
          description="All your applications"
          colorClass={APPLICTION_TABS_STATUS_COLORS.total}
          icon={<Layers className="h-5 w-5" />}
        />

        <DashboardStatCard
          title="Applied"
          value={stats.applied}
          description="Submitted applications"
          colorClass={APPLICTION_TABS_STATUS_COLORS.applied}
          icon={<Send className="h-5 w-5" />}
        />

        <DashboardStatCard
          title="Reviewing"
          value={stats.reviewing}
          description="Under review"
          colorClass={APPLICTION_TABS_STATUS_COLORS.reviewing}
          icon={<Eye className="h-5 w-5" />}
        />

        <DashboardStatCard
          title="Shortlisted"
          value={stats.shortlisted}
          description="Selected for interview"
          colorClass={APPLICTION_TABS_STATUS_COLORS.shortlisted}
          icon={<UserCheck className="h-5 w-5" />}
        />

        <DashboardStatCard
          title="Interview"
          value={stats.interviewScheduled}
          description="Interview scheduled"
          colorClass={APPLICTION_TABS_STATUS_COLORS.interviewScheduled}
          icon={<CalendarClock className="h-5 w-5" />}
        />

        <DashboardStatCard
          title="Rejected"
          value={stats.rejected}
          description="Not selected"
          colorClass={APPLICTION_TABS_STATUS_COLORS.rejected}
          icon={<XCircle className="h-5 w-5" />}
        />

        <DashboardStatCard
          title="Offered"
          value={stats.offered}
          description="Offer received"
          colorClass={APPLICTION_TABS_STATUS_COLORS.offered}
          icon={<Gift className="h-5 w-5" />}
        />

        <DashboardStatCard
          title="Hired"
          value={stats.hired}
          description="Successfully hired"
          colorClass={APPLICTION_TABS_STATUS_COLORS.hired}
          icon={<CheckCircle className="h-5 w-5" />}
        />
      </div>

    </div>
  )
}

export default JobSeekerDashboard
