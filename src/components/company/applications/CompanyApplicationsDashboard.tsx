'use client'

import { useEffect, useState } from 'react'
import { AppSdk } from '@/src/utils/AppSdk'
import { Spinner } from '@/src/components/elements/Loader'
import { Button } from '@/src/components/ui/Button'
import { toast } from 'sonner'
import Link from 'next/link'
import {
  Layers,
  Eye,
  UserCheck,
  CalendarClock,
  XCircle,
  CheckCircle,
  FileText,
} from 'lucide-react'
import { formatRelativeTime, getLabel, JOB_STATUS_STYLE, JOB_STATUSES, } from '@/src/utils/helper'
import Pagination from '@/src/components/ui/Pagination'
import clsx from 'clsx'
import { JobStatus } from '@prisma/client'

interface JobRow {
  id: string
  title: string
  slug: string
  status: string
  applicationsCount: number
  lastApplicationAt: string | null
  createdAt: string
}

interface Stats {
  total: number
  reviewing: number
  shortlisted: number
  interviewScheduled: number
  rejected: number
  hired: number
}
interface CompanyApplicationsResponse {
  jobs: JobRow[]
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

const StatCard = ({
  title,
  value,
  icon,
  color,
}: {
  title: string
  value: number
  icon: React.ReactNode
  color: string
}) => (
  <div className="bg-card border border-border/60 rounded-2xl p-6 flex items-center justify-between hover:shadow-md transition">
    <div>
      <p className="text-sm text-muted-foreground">{title}</p>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
    <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${color}`}>
      {icon}
    </div>
  </div>
)

export default function CompanyApplicationsPage() {
  const [data, setData] = useState<CompanyApplicationsResponse | null>(null)
  const [applicationsLoading, setApplicationsLoading] = useState(true)
  const [statsLoading, setStatsLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [stats, setStats] = useState<Stats | null>(null)

  const fetchApplications = async () => {
    setApplicationsLoading(true)
    try {
      const params = new URLSearchParams()
      params.set('page', page.toString())
      params.set('limit', '12')

      const res = await AppSdk.getData(
        `/api/company/applications?${params.toString()}`,
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

  const fetchStats = async () => {
    setStatsLoading(true)
    try {

      const res = await AppSdk.getData(
        `/api/company/applications/stats`,
        null,
      )

      if (res.error) {
        toast.error(res.error)
        return
      }

      setStats(res.stats)
    } catch (error) {
      console.error(error)
      toast.error('Failed to load applications stats')
    } finally {
      setStatsLoading(false)
    }
  }

  useEffect(() => {
    fetchApplications()
  }, [page])

  useEffect(() => {
    fetchStats()
  }, [])

  if (statsLoading && applicationsLoading) {
    return (
      <div className="flex items-center justify-center gap-2 min-h-[500px]">
        Loading...<Spinner className="h-8 w-8" />
      </div>
    )
  }

  if (!data || !stats) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="text-center">
          <p className="text-muted-foreground">
            Failed to load applications dashboard
          </p>
          <Button onClick={fetchApplications} className="mt-4">
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
          Applications
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage and review applications received for your jobs
        </p>
      </div>

      {stats &&
        <section className="grid grid-cols-1 max-w-full md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          <StatCard
            title="Total"
            value={stats.total}
            icon={<Layers className="h-5 w-5" />}
            color="bg-gray-500/10 text-gray-600"
          />
          <StatCard
            title="Reviewing"
            value={stats.reviewing}
            icon={<Eye className="h-5 w-5" />}
            color="bg-yellow-500/10 text-yellow-600"
          />
          <StatCard
            title="Shortlisted"
            value={stats.shortlisted}
            icon={<UserCheck className="h-5 w-5" />}
            color="bg-purple-500/10 text-purple-600"
          />
          <StatCard
            title="Interview Scheduled"
            value={stats.interviewScheduled}
            icon={<CalendarClock className="h-5 w-5" />}
            color="bg-indigo-500/10 text-indigo-600"
          />
          <StatCard
            title="Rejected"
            value={stats.rejected}
            icon={<XCircle className="h-5 w-5" />}
            color="bg-red-500/10 text-red-600"
          />
          <StatCard
            title="Hired"
            value={stats.hired}
            icon={<CheckCircle className="h-5 w-5" />}
            color="bg-emerald-500/10 text-emerald-600"
          />
        </section>
      }

      {
        applicationsLoading ? (
          <div className="flex items-center justify-center min-h-[200px]">
            <Spinner className="h-8 w-8" />
          </div>
        ) : (
          <CompanyApplicationsTable data={data} />
        )
      }

      {data && data.pagination.totalPages > 1 && (
        <Pagination
          page={data.pagination.page}
          totalPages={data.pagination.totalPages}
          onPageChange={(p) => setPage(p)}
        />
      )}
    </div >
  )
}

export const CompanyApplicationsTable = ({ data }: { data: CompanyApplicationsResponse }) => {
  return (
    <div className="overflow-x-auto rounded-2xl border border-border/60 bg-card">
      <table className="w-full text-sm">
        <thead className="bg-muted/40 border-b border-border/60">
          <tr>
            <th className="px-6 py-4 text-left">Job Title</th>
            <th className="px-6 py-4 text-left">Status</th>
            <th className="px-6 py-4 text-left">Applications</th>
            <th className="px-6 py-4 text-left">Last Application</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.jobs.length === 0 && (
            <tr>
              <td colSpan={5} className="text-center py-16">
                <div className="flex flex-col items-center gap-3">
                  <FileText className="h-10 w-10 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    No applications found
                  </p>
                </div>
              </td>
            </tr>
          )}

          {data.jobs.map((job) => (
            <tr key={job.id} className="hover:bg-muted/30 transition">
              <td className="px-6 py-4 font-medium">
                {job.title}
              </td>

              <td className='px-6 py-4 font-semibold'
              >
                <span
                  className={clsx(
                    'px-3 py-1 rounded-full text-xs font-medium',
                    JOB_STATUS_STYLE[job.status as JobStatus],
                  )}
                >
                  {getLabel(JOB_STATUSES, job.status)}
                </span>
              </td>

              <td className="px-6 py-4 font-semibold">
                {job.applicationsCount}
              </td>

              <td className="px-6 py-4 text-xs text-muted-foreground">
                {job.lastApplicationAt
                  ? formatRelativeTime(job.lastApplicationAt)
                  : '—'}
              </td>

              <td className="px-6 py-4 text-right">
                <Link
                  href={`/company/applications/${job.id}`}
                  className="text-primary text-xs hover:underline font-semibold"
                >
                  View →
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}