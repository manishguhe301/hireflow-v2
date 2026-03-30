'use client'

import { useEffect, useRef, useState } from 'react'
import { AppSdk } from '@/src/utils/AppSdk'
import { Button } from '@/src/components/ui/Button'
import { RefreshCcw } from 'lucide-react'
import Pagination from '@/src/components/ui/Pagination'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { StatCardSkeleton } from '../../skeletons/StatCardSkeleton'
import TableSkeleton from '../../skeletons/TableSkeleton'

import CompanyApplicationsTable from './CompanyApplicationsTable'
import ApplicationDashboardStats from './ApplicationDashboardStats'

export default function CompanyApplicationsPage() {
  const [page, setPage] = useState(1)
  const queryClient = useQueryClient()
  const tableRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    tableRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    })
  }, [page])

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

  const loading = () => {
    return (
      <section className="grid grid-cols-1 max-w-full md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </section>)
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
        loading()
      ) :
        <ApplicationDashboardStats statsData={statsData} />
      }
      {
        applicationsLoading ? (
          <TableSkeleton columns={5} rows={8} />
        ) :
          (
            <div className='flex flex-col gap-2' ref={tableRef}>
              <Button
                className='flex items-center justify-center gap-2 self-end'
                size='sm'
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