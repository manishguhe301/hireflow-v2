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
  Briefcase,
  FileText,
  Bookmark,
  User,
} from 'lucide-react'
import Link from 'next/link'
import { ApplicationStatus, EmploymentType, ExperienceLevel, WorkMode } from '@prisma/client'
import { APPLICATIONS_TABS, formatRelativeTime, getLabel } from '@/src/utils/helper'
import clsx from 'clsx'
import JobCard from '../../public/jobs-dir/JobCard'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { StatCardSkeleton } from '../../skeletons/StatCardSkeleton'
import JobCardSkeleton from '../../skeletons/JobCardSkeleton'
import { ActivitySkeleton } from '../../skeletons/ActivitySkeleton'

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

interface Activities {
  id: string;
  status: ApplicationStatus;
  updatedAt: string;
  job: {
    title: string;
    company: {
      name: string;
    };
    slug: string;
  };
}

interface RecommendedJob {
  id: string;
  title: string;
  category: string;
  company: {
    name: string;
    id: string;
    logo: string;
    website: string
  };
  country: string;
  city: string;
  workMode: WorkMode;
  employmentType: EmploymentType;
  createdAt: string;
  updatedAt: string;
  experienceLevel: ExperienceLevel;
  salaryMin: number;
  salaryMax: number;
  numberOfOpenings: string;
  applicationDeadline: string;
  slug: string;
  isSaved: boolean
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

const QuickActionCard = ({ href, icon, colorClass, label, desc }:
  {
    href: string
    icon: React.ReactNode
    colorClass: string
    label: string
    desc: string
  }
) => {
  return (
    <Link
      href={href}
      className="p-6 bg-card border border-border/60 rounded-2xl hover:border-primary/40 transition hover:shadow-lg group"
    >
      <div className="flex items-center gap-4">
        <div className={`h-12 w-12 rounded-xl ${colorClass} flex items-center justify-center`}>
          {icon}
        </div>
        <div>
          <p className="font-semibold">{label}</p>
          <p className="text-sm text-muted-foreground">
            {desc}
          </p>
        </div>
      </div>
    </Link>
  )
}

const JobSeekerDashboard = () => {
  // const [isLoading, setIsLoading] = useState(true)
  // const [stats, setStats] = useState<DashboardStats | null>(null)
  // const [recentActivity, setRecentActivity] = useState<Activities[]>([])
  // const [recommendedJobs, setRecommendedJobs] = useState<RecommendedJob[]>([])
  // const [saving, setSaving] = useState(false)
  const queryClient = useQueryClient()

  // const fetchDashboardData = async () => {
  //   try {

  //     const [statsRes, activityRes, recommendedRes] = await Promise.all([
  //       AppSdk.getData('/api/applications/stats', null),
  //       AppSdk.getData('/api/applications/recent-activity', null),
  //       AppSdk.getData('/api/jobs/recommended', null),
  //     ])

  //     if (statsRes.error) {
  //       toast.error(statsRes.error)
  //     } else {
  //       setStats(statsRes.stats)
  //     }

  //     if (activityRes.error) {
  //       toast.error(activityRes.error)
  //     } else {
  //       setRecentActivity(activityRes.activities)
  //     }

  //     if (recommendedRes.error) {
  //       toast.error(recommendedRes.error)
  //     } else {
  //       setRecommendedJobs(recommendedRes.jobs)
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

  const { data: statsData, isLoading: statsLoading, isError: statsError } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const res = await AppSdk.getData('/api/applications/stats', null)
      if (res.error) throw new Error(res.error)
      return res.stats as DashboardStats
    },
  })

  const { data: activityData, isLoading: activityLoading } = useQuery({
    queryKey: ['dashboard-activity'],
    queryFn: async () => {
      const res = await AppSdk.getData('/api/applications/recent-activity', null)
      if (res.error) throw new Error(res.error)
      return res.activities as Activities[]
    },
  })

  const { data: recommendedData, isLoading: recommendedLoading } = useQuery({
    queryKey: ['dashboard-recommended'],
    queryFn: async () => {
      const res = await AppSdk.getData('/api/jobs/recommended', null)
      if (res.error) throw new Error(res.error)
      return res.jobs as RecommendedJob[]
    },
  })

  const saveMutation = useMutation({
    mutationFn: async ({ jobId, currentlySaved }: { jobId: string; currentlySaved: boolean }) => {
      if (currentlySaved) {
        const res = await AppSdk.deleteData(`/api/jobs/saved?jobId=${jobId}`, null)
        if (res.error) throw new Error(res.error)
        return { removed: true }
      } else {
        const res = await AppSdk.postData('/api/jobs/saved', { jobId })
        if (res.error) throw new Error(res.error)
        return { removed: false }
      }
    },
    onSuccess: ({ removed }) => {
      toast.success(removed ? 'Job removed from saved' : 'Job saved successfully')
      queryClient.invalidateQueries({ queryKey: ['dashboard-recommended'] })
      queryClient.invalidateQueries({ queryKey: ['saved-jobs'] })
    },
    onError: () => {
      toast.error('Something went wrong')
    },
  })


  const handleSaveToggle = async (jobId: string, currentlySaved: boolean) => {
    // setSaving(true)
    // try {
    //   if (currentlySaved) {
    //     const res = await AppSdk.deleteData(`/api/jobs/saved?jobId=${jobId}`, null)
    //     if (res.error) {
    //       toast.error(res.error || 'Failed to remove saved job')
    //       return
    //     }
    //     toast.success('Job removed from saved')
    //   } else {
    //     const res = await AppSdk.postData(`/api/jobs/saved`, {
    //       jobId
    //     })

    //     if (res.error) {
    //       toast.error(res.error || 'Failed to save job')
    //       return
    //     }

    //     toast.success('Job saved successfully')
    //   }
    //   fetchDashboardData()
    // } catch (error) {
    //   toast.error('Something went wrong')
    // } finally {
    //   setSaving(false)
    // }
    saveMutation.mutate({ jobId, currentlySaved })
  }

  // if (statsLoading || activityLoading || recommendedLoading) {
  //   return (
  //     <div className="flex items-center justify-center min-h-[400px]">
  //       <Spinner className="h-8 w-8" />
  //     </div>
  //   )
  // }

  if ((!statsData || !activityData || !recommendedData) && !statsLoading && !activityLoading && !recommendedLoading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="text-center">
          <p className="text-muted-foreground">Failed to load dashboard data</p>
          <Button
            onClick={() => {
              queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
              queryClient.invalidateQueries({ queryKey: ['dashboard-activity'] })
              queryClient.invalidateQueries({ queryKey: ['dashboard-recommended'] })
            }}
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

      <section className="space-y-6">
        <h2 className="text-xl font-semibold">Applications Overview</h2>
        <div className="grid grid-cols-1 max-w-full md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4">
          {statsLoading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <StatCardSkeleton key={i} />
            ))
          ) : (
            statsData && <>
              <DashboardStatCard
                title="Total"
                value={statsData.total}
                description="All your applications"
                colorClass={APPLICTION_TABS_STATUS_COLORS.total}
                icon={<Layers className="h-5 w-5" />}
              />

              <DashboardStatCard
                title="Applied"
                value={statsData.applied}
                description="Submitted applications"
                colorClass={APPLICTION_TABS_STATUS_COLORS.applied}
                icon={<Send className="h-5 w-5" />}
              />

              <DashboardStatCard
                title="Reviewing"
                value={statsData.reviewing}
                description="Under review"
                colorClass={APPLICTION_TABS_STATUS_COLORS.reviewing}
                icon={<Eye className="h-5 w-5" />}
              />

              <DashboardStatCard
                title="Shortlisted"
                value={statsData.shortlisted}
                description="Selected for interview"
                colorClass={APPLICTION_TABS_STATUS_COLORS.shortlisted}
                icon={<UserCheck className="h-5 w-5" />}
              />

              <DashboardStatCard
                title="Interview"
                value={statsData.interviewScheduled}
                description="Interview scheduled"
                colorClass={APPLICTION_TABS_STATUS_COLORS.interviewScheduled}
                icon={<CalendarClock className="h-5 w-5" />}
              />

              <DashboardStatCard
                title="Rejected"
                value={statsData.rejected}
                description="Not selected"
                colorClass={APPLICTION_TABS_STATUS_COLORS.rejected}
                icon={<XCircle className="h-5 w-5" />}
              />

              <DashboardStatCard
                title="Offered"
                value={statsData.offered}
                description="Offer received"
                colorClass={APPLICTION_TABS_STATUS_COLORS.offered}
                icon={<Gift className="h-5 w-5" />}
              />

              <DashboardStatCard
                title="Hired"
                value={statsData.hired}
                description="Successfully hired"
                colorClass={APPLICTION_TABS_STATUS_COLORS.hired}
                icon={<CheckCircle className="h-5 w-5" />}
              />
            </>
          )
          }
        </div>
      </section>
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Recommended For You</h2>
          <Link href="/jobs" className="text-sm text-primary hover:underline">
            View All →
          </Link>
        </div>

        {recommendedLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <JobCardSkeleton key={i} />
            ))}
          </div>
        ) : recommendedData && recommendedData.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recommendedData.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                isSaved={job.isSaved}
                onSaveToggle={() => handleSaveToggle(job.id, job.isSaved)}
                disabled={saveMutation.isPending}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground border border-border/60 rounded-xl">
            <Briefcase className="h-10 w-10 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No recommendations yet</p>
            <p className="text-xs mt-1">Complete your profile to get personalized job recommendations</p>
          </div>
        )}
      </section>
      <section className="space-y-6">
        <h2 className="text-xl font-semibold">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
          <QuickActionCard
            href='/jobs'
            label='Browse Jobs'
            icon={
              <Briefcase className="h-6 w-6 " />
            }
            desc='Discover new opportunities'
            colorClass='bg-primary/10 text-primary'
          />
          <QuickActionCard
            href='/dashboard/applications'
            label='My Applications'
            icon={
              <FileText className="h-6 w-6 " />
            }
            desc='Discover new opportunities'
            colorClass='bg-blue-500/10 text-blue-600'
          />
          <QuickActionCard
            href='/dashboard/saved-jobs'
            label='Saved Jobs'
            icon={
              <Bookmark className="h-6 w-6 " />
            }
            desc='Discover new opportunities'
            colorClass='bg-yellow-500/10 text-yellow-600'
          />
          <QuickActionCard
            href='/dashboard/profile'
            label='My Profile'
            icon={
              <User className="h-6 w-6 " />
            }
            desc='Discover new opportunities'
            colorClass='bg-muted text-slate-600 dark:text-slate-400'
          />
        </div>
      </section>
      <section className="space-y-6">
        <h2 className="text-xl font-semibold">Recent Activity</h2>
        {activityLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <ActivitySkeleton key={i} />
            ))}
          </div>
        ) : activityData && activityData.length > 0 ? (
          <div className="space-y-3">
            {activityData.map((activity) => (
              <Link
                key={activity.id}
                href={`/jobs/${activity.job.slug}`}
                className="block rounded-xl border border-border/60 bg-card p-4 hover:border-primary/40 hover:shadow-lg transition"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium line-clamp-1">{activity.job.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {activity.job.company.name}
                    </p>
                  </div>
                  <div className="text-right">
                    <span
                      className={clsx(
                        'inline-block px-3 py-1 rounded-full text-xs font-medium',
                        APPLICTION_TABS_STATUS_COLORS[activity.status.toLowerCase() as keyof typeof APPLICTION_TABS_STATUS_COLORS],
                      )}
                    >
                      {getLabel(APPLICATIONS_TABS, activity.status)}
                    </span>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatRelativeTime(activity.updatedAt)}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="h-10 w-10 mx-auto mb-2 opacity-50" />
            <p className="text-sm">It seems you have no recent activity</p>
          </div>
        )}
      </section>
    </div>
  )
}

export default JobSeekerDashboard
