'use client'
import { ApplicationStatus } from '@prisma/client'
import { useEffect, useState } from 'react'
import { AppSdk } from '@/src/utils/AppSdk'
import { Button } from '../../ui/Button'
import ApplicationsTable from './ApplicationsTable'
import Pagination from '../../ui/Pagination'
import { useQuery } from '@tanstack/react-query'
import TableSkeleton from '../../skeletons/TableSkeleton'
import { APPLICATIONS_TABS } from '@/src/utils/constants'
import { Briefcase, RefreshCcw } from 'lucide-react'
import { ApplicationWithPagination } from '@/src/types'
import Link from 'next/link'

const ApplicationsPage = () => {
  const [activeTab, setActiveTab] =
    useState<ApplicationStatus | 'ALL'>('ALL')
  const [page, setPage] = useState(1)

  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ['applications', activeTab, page],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (activeTab !== 'ALL') params.set('status', activeTab)
      params.set('page', page.toString())
      params.set('limit', '12')
      const res = await AppSdk.getData(`/api/applications?${params.toString()}`, null)
      if (res.error) throw new Error(res.error)
      return res as ApplicationWithPagination
    },
    placeholderData: (prev) => prev,
  })

  useEffect(() => {
    window.scrollTo({ top: 80, behavior: 'smooth' })
  }, [page])


  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="text-center">
          <p className="text-muted-foreground">Failed to load your applications</p>
          <Button
            onClick={() => refetch()}
            className="mt-4"
          >
            Retry
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className=" p-4 md:p-8 space-y-8 w-full md:max-w-[1400px] md:mx-auto  max-sm:max-w-screen">
      <div >
        <h1 className="text-3xl font-bold tracking-tight">Applications</h1>
        <p className="mt-2  text-muted-foreground">
          Here you can find all the applications you have made
        </p>
      </div >
      <div className="flex flex-wrap gap-2">
        {APPLICATIONS_TABS.map(
          (tab) => {
            return (
              <Button
                key={tab.value}
                variant={activeTab === tab.value ? 'primary' : 'outline'}
                size="sm"
                onClick={() => {
                  setActiveTab(tab.value)
                  setPage(1)
                }}
                disabled={isLoading || isFetching}
              >
                {tab.label}
              </Button>
            )
          })}
        <Button
          className='flex items-center justify-center gap-2 maxsm'
          size='sm'
          disabled={isLoading || isFetching}
          onClick={() =>
            refetch()
          }>
          <RefreshCcw className="h-4 w-4" /> Refresh
        </Button>
      </div>
      {
        isLoading ? (
          <TableSkeleton columns={5} rows={6} />
        ) : (
          data &&
            data.applications.length === 0 ? (
            <div className='py-4 w-full border border-border rounded-xl'>
              <div className="flex flex-col items-center gap-3">
                <Briefcase className="h-10 w-10 text-muted-foreground" />
                <p className="text-muted-foreground">
                  No applications found
                </p>

                <Link href="/jobs">
                  <Button size="sm" className="mt-4">
                    Browse Jobs
                  </Button>
                </Link>
              </div>
            </div>
          )
            :
            < ApplicationsTable
              data={data as ApplicationWithPagination}
              refetch={refetch}
              disabled={isLoading || isFetching}
            />
        )
      }
      {
        data && data.pagination.totalPages > 1 && (
          <Pagination
            page={data.pagination.page}
            totalPages={data.pagination.totalPages}
            onPageChange={(p) => setPage(p)}
          />
        )
      }
    </div >
  )
}

export default ApplicationsPage