'use client'
import { ApplicationStatus, EmploymentType, ExperienceLevel, JobStatus, WorkMode } from '@prisma/client'
import React, { useEffect, useState } from 'react'
import { Spinner } from '../../elements/Loader'
import { toast } from 'sonner'
import { AppSdk } from '@/src/utils/AppSdk'
import { Button } from '../../ui/Button'
import ApplicationsTable from './ApplicationsTable'
import Pagination from '../../ui/Pagination'
import { APPLICATIONS_TABS } from '@/src/utils/helper'

interface Application {
  job: {
    company: {
      id: string
      name: string
      logo: string | null
    }
    id: string
    status: JobStatus
    title: string
    experienceLevel: ExperienceLevel
    employmentType: EmploymentType
    workMode: WorkMode
    salaryMin?: number | null
    salaryMax?: number | null
    category: string
    slug: string
  }
  id: string
  resumeUrl: string
  coverLetter: string | null
  status: ApplicationStatus
  statusHistory: JSON | null
  createdAt: Date
  updatedAt: Date
}

export interface ApplicationWithPagination {
  applications: Application[]
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

const ApplicationsPage = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [data, setData] = useState
    <ApplicationWithPagination | null>(null)
  const [activeTab, setActiveTab] =
    useState<'ALL' | ApplicationStatus>('ALL')
  const [page, setPage] = useState(1)

  const fetchApplications = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      if (activeTab !== 'ALL') params.set('status', activeTab)
      params.set('page', page.toString())
      params.set('limit', '12')

      const res = await AppSdk.getData(
        `/api/applications?${params.toString()}`,
        null,
      )

      if (res.error) {
        toast.error(res.error)
        return
      }
      setData(res)
    } catch (err) {
      console.error(err)
      toast.error('Failed to load applications')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchApplications()
  }, [page, activeTab])

  if (!isLoading && !data) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="text-center">
          <p className="text-muted-foreground">Failed to load your applications</p>
          <Button
            onClick={fetchApplications}
            className="mt-4"
          >
            Retry
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className=" p-4 md:p-8 space-y-8 w-full md:max-w-[1400px] md:mx-auto animate-in fade-in duration-500 max-sm:max-w-screen">
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
                disabled={isLoading}
              >
                {tab.label}
              </Button>
            )
          })
        }
      </div>
      {
        isLoading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <Spinner className="h-8 w-8" />
          </div>
        ) : (
          <ApplicationsTable
            data={data}
          />
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

export default ApplicationsPage