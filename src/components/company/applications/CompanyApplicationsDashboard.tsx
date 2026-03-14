'use client'

import { useEffect, useState } from 'react'
import { AppSdk } from '@/src/utils/AppSdk'
import { Button } from '@/src/components/ui/Button'
import {
  Layers,
  Eye,
  UserCheck,
  CalendarClock,
  XCircle,
  CheckCircle,
  RefreshCcw,
  FileCheck,
  OctagonAlert,
} from 'lucide-react'
import Pagination from '@/src/components/ui/Pagination'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { StatCardSkeleton } from '../../skeletons/StatCardSkeleton'
import TableSkeleton from '../../skeletons/TableSkeleton'

import CompanyApplicationsTable from './CompanyApplicationsTable'

export const StatCard = ({
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
  <div className="bg-card border border-border/60 rounded-2xl p-6 flex items-center justify-between hover:shadow-md hover:border-primary/30 transition">
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
  const [page, setPage] = useState(1)
  const queryClient = useQueryClient()

  const {
    data: applicationsData,
    isLoading: applicationsLoading,
    isFetching: pageChangeLoading,
    refetch: applicationRefetch
  } = useQuery({
    queryKey: ['company-applications', page],
    queryFn: async () => {

      const params = new URLSearchParams()
      params.set('page', page.toString())
      params.set('limit', '12')

      const res = await AppSdk.getData(
        `/api/company/applications?${params.toString()}`,
        null
      )

      if (res.error) {
        throw new Error(res.error)
      }

      return res
    },

    placeholderData: (prev) => prev,
    staleTime: 1000 * 60 * 5
  })

  const {
    data: statsData,
    isLoading: statsLoading,
    refetch: statsRefetch
  } = useQuery({
    queryKey: ['company-applications-stats'],
    queryFn: async () => {

      const res = await AppSdk.getData(
        `/api/company/applications/stats`,
        null
      )

      if (res.error) {
        throw new Error(res.error)
      }

      return res.stats
    },

    staleTime: 1000 * 60 * 5
  })

  useEffect(() => {
    if (!applicationsData) return

    const nextPage = page + 1

    if (nextPage <= applicationsData.pagination.totalPages) {
      queryClient.prefetchQuery({
        queryKey: ['company-applications', nextPage],
        queryFn: async () => {

          const params = new URLSearchParams()
          params.set('page', nextPage.toString())
          params.set('limit', '12')

          const res = await AppSdk.getData(
            `/api/company/applications?${params.toString()}`,
            null
          )

          return res
        }
      })
    }

  }, [applicationsData, page, queryClient])

  if ((!statsData || !applicationsData) && !statsLoading && !applicationsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="text-center">
          <p className="text-muted-foreground">
            Failed to load applications dashboard
          </p>
          <Button onClick={
            () => {
              applicationRefetch()
              statsRefetch()
            }
          } className="mt-4">
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

      {statsLoading ? (
        <section className="grid grid-cols-1 max-w-full md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <StatCardSkeleton key={i} />
          ))}
        </section>
      ) :
        <section className="grid grid-cols-1 max-w-full md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard
            title="Total"
            value={statsData.total}
            icon={<Layers className="h-5 w-5" />}
            color="bg-gray-500/10 text-gray-600"
          />
          <StatCard
            title="Reviewing"
            value={statsData.reviewing}
            icon={<Eye className="h-5 w-5" />}
            color="bg-yellow-500/10 text-yellow-600"
          />
          <StatCard
            title="Shortlisted"
            value={statsData.shortlisted}
            icon={<UserCheck className="h-5 w-5" />}
            color="bg-purple-500/10 text-purple-600"
          />
          <StatCard
            title="Interview Scheduled"
            value={statsData.interviewScheduled}
            icon={<CalendarClock className="h-5 w-5" />}
            color="bg-indigo-500/10 text-indigo-600"
          />
          <StatCard
            title="Rejected"
            value={statsData.rejected}
            icon={<XCircle className="h-5 w-5" />}
            color="bg-red-500/10 text-red-600"
          />
          <StatCard
            title="Hired"
            value={statsData.hired}
            icon={<CheckCircle className="h-5 w-5" />}
            color="bg-emerald-500/10 text-emerald-600"
          />
          <StatCard
            title="Offered"
            value={statsData.offered}
            icon={<FileCheck className="h-5 w-5" />}
            color="bg-amber-500/10 text-amber-600"
          />
          <StatCard
            title="On Hold"
            value={statsData.onHold}
            icon={<OctagonAlert className="h-5 w-5" />}
            color="bg-rose-500/10 text-rose-600"
          />
        </section>
      }

      {
        applicationsLoading ? (
          <TableSkeleton columns={5} rows={8} />
        ) :
          (
            <div className='flex flex-col gap-2'>
              <Button
                className='flex items-center justify-center gap-2 self-end'
                disabled={applicationsLoading || pageChangeLoading}
                onClick={() =>
                  applicationRefetch()
                }>
                <RefreshCcw className="h-4 w-4" /> Refresh
              </Button>
              <CompanyApplicationsTable data={applicationsData} />
            </div>
          )
      }

      {applicationsData && applicationsData.pagination.totalPages > 1 && (
        <Pagination
          page={applicationsData.pagination.page}
          totalPages={applicationsData.pagination.totalPages}
          onPageChange={(p) => setPage(p)}
        />
      )}
    </div >
  )
}