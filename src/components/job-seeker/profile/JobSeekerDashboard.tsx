'use client'
import { AppSdk } from '@/src/utils/AppSdk'
import { ApplicationStatus, EmploymentType, ExperienceLevel, JobStatus, WorkMode } from '@prisma/client'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Spinner } from '../../elements/Loader'
import { Button } from '../../ui/Button'
import ApplicationsTable from './ApplicationsTable'

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

interface Application {
  job: {
    company: {
      id: string;
      name: string;
      logo: string | null;
    };
    id: string;
    status: JobStatus;
    title: string;
    experienceLevel: ExperienceLevel;
    employmentType: EmploymentType;
    workMode: WorkMode;
    salaryMin?: number | null;
    salaryMax?: number | null;
    category: string;
    slug: string;
  };
  id: string;
  resumeUrl: string;
  coverLetter: string | null;
  status: ApplicationStatus;
  statusHistory: JSON | null;
  createdAt: Date;
  updatedAt: Date;
}

interface ApplicationWithStats {
  applications: Application[]
  stats: DashboardStats
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export const TABS: { label: string; value: ApplicationStatus | 'ALL' }[] = [
  { label: 'All', value: 'ALL' },
  { label: 'Applied', value: ApplicationStatus.APPLIED },
  { label: 'Rejected', value: ApplicationStatus.SHORTLISTED },
  { label: 'Rejected', value: ApplicationStatus.REVIEWING },
  { label: 'Rejected', value: ApplicationStatus.INTERVIEW_SCHEDULED },
  { label: 'Rejected', value: ApplicationStatus.OFFERED },
  { label: 'Rejected', value: ApplicationStatus.REJECTED },
  { label: 'Approved', value: ApplicationStatus.HIRED },
];

const JobSeekerDashboard = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [applicationsWithStats, setApplicationsWithStats] = useState<ApplicationWithStats | null>(null)
  const [activeTab, setActiveTab] = useState<'ALL' | ApplicationStatus>('ALL')

  const fetchStats = async () => {
    if (!isLoading) setIsLoading(true)
    try {
      const res = await AppSdk.getData('/api/applications/', null)
      if (res.error) {
        toast.error(res.error || 'Failed to fetch stats, please try again.')
        return
      }
      setApplicationsWithStats(res)
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

  if (!applicationsWithStats) {
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
    <div className="p-4 md:p-8 space-y-10 max-w-[1400px] mx-auto animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="mt-2  text-muted-foreground">
          View and manage your job applications
        </p>
      </div>

    </div>
  )
}

export default JobSeekerDashboard