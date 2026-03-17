'use client'

import { AppSdk } from '@/src/utils/AppSdk'
import { toast } from 'sonner'
import { Button } from '../../ui/Button'
import {
  Briefcase,
  FileText,
  Bookmark,
  User,
} from 'lucide-react'
import Link from 'next/link'
import JobCard from '../../public/jobs-dir/JobCard'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { StatCardSkeleton } from '../../skeletons/StatCardSkeleton'
import JobCardSkeleton from '../../skeletons/JobCardSkeleton'
import { ActivitySkeleton } from '../../skeletons/ActivitySkeleton'
import QuickActionLink from '../../shared/QuickActionLink'
import { JobSeekerActivities, JobSeekerDashboardStats, RecommendedJob } from '@/src/types'
import ApplicationsOverview from './ApplicationsOverview'
import RecentActivityCard from './RecentActivityCard'
import NoRecommendationUI from './NoRecommendationUI'


const JobSeekerDashboard = () => {
  const queryClient = useQueryClient()

  const { data: statsData, isLoading: statsLoading, } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const res = await AppSdk.getData('/api/applications/stats', null)
      if (res.error) throw new Error(res.error)
      return res.stats as JobSeekerDashboardStats
    },
  })

  const { data: activityData, isLoading: activityLoading } = useQuery({
    queryKey: ['dashboard-activity'],
    queryFn: async () => {
      const res = await AppSdk.getData('/api/applications/recent-activity', null)
      if (res.error) throw new Error(res.error)
      return res.activities as JobSeekerActivities[]
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
    saveMutation.mutate({ jobId, currentlySaved })
  }

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
    <div className="p-4 md:p-8 space-y-12 max-w-[1400px] mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Dashboard
        </h1>
        <p className="text-muted-foreground mt-1">
          Here&apos;s a summary of your job applications
        </p>
      </div>

      <section className="space-y-6">
        <h2 className="text-lg font-semibold tracking-tight">Applications Overview</h2>
        <div className="grid grid-cols-1 max-w-full md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4">
          {statsLoading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <StatCardSkeleton key={i} />
            ))
          ) : (
            statsData &&
            <ApplicationsOverview statsData={statsData} />
          )
          }
        </div>
      </section>
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold tracking-tight">Recommended For You</h2>
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
          <NoRecommendationUI />
        )}
      </section>
      <section className="space-y-6">
        <h2 className="text-lg font-semibold tracking-tight">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
          <QuickActionLink
            href='/jobs'
            title="Browse Jobs"
            description="Explore new job openings"
            icon={
              <Briefcase className="h-6 w-6 " />
            }
            colorClass='bg-primary/10 text-primary'
          />
          <QuickActionLink
            href='/dashboard/applications'
            title="Saved Jobs"
            description="View bookmarked jobs"
            icon={
              <FileText className="h-6 w-6 " />
            }
            colorClass='bg-blue-500/10 text-blue-600'
          />
          <QuickActionLink
            href='/dashboard/saved-jobs'
            title="My Profile"
            description="Update your profile"
            icon={
              <Bookmark className="h-6 w-6 " />
            }
            colorClass='bg-yellow-500/10 text-yellow-600'
          />
          <QuickActionLink
            href='/dashboard/profile'
            title='My Profile'
            icon={
              <User className="h-6 w-6 " />
            }
            description='Discover new opportunities'
            colorClass='bg-muted text-slate-600 dark:text-slate-400'
          />
        </div>
      </section>
      <section className="space-y-6">
        <h2 className="text-lg font-semibold tracking-tight">Recent Activity</h2>
        {activityLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <ActivitySkeleton key={i} />
            ))}
          </div>
        ) : activityData && activityData.length > 0 ? (
          <div className="space-y-3">
            {activityData.map((activity) => (
              <RecentActivityCard key={activity.id} activity={activity} />
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
