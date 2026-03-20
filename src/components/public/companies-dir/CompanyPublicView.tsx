'use client'

import { Company, Job } from '@prisma/client'
import { Briefcase } from 'lucide-react'
import CompanyJobCard from './CompanyJobCard'
import { useSession } from 'next-auth/react'
import clsx from 'clsx'
import CompanyDetailsTopSection from '../../shared/CompanyDetailsTopSection'
import CompanyiInfo from '../../shared/CompanyiInfo'
import { useQuery } from '@tanstack/react-query'
import { AppSdk } from '@/src/utils/AppSdk'
import CompanyDetailsSkeleton from '../../skeletons/CompanyDetailsSkeleton'
import { notFound } from 'next/navigation'

const CompanyPublicView = ({ id }: { id: string }) => {
  const { data: session } = useSession()


  const { data, isLoading } = useQuery({
    queryKey: ['public-company', id],
    queryFn: async () => {
      const res = await AppSdk.getData(`/api/companies/${id}?full=true`, null)
      if (res.error) throw new Error(res.error)
      return res
    },
    staleTime: 1000 * 60 * 5,
    retry: false,
  })

  if (isLoading) {
    return (
      <div className=''>
        <CompanyDetailsSkeleton />
      </div>
    )
  }
  if (!data?.company) return notFound()

  const { company, jobs }: {
    company: Company,
    jobs: Job[]
  } = data


  return (
    <div className={clsx("mx-auto  space-y-10 px-4 py-6", session?.user.id ? 'max-w-6xl' : 'max-w-5xl')}>
      <CompanyDetailsTopSection company={company} />
      <CompanyiInfo company={company} />
      <div className="space-y-4">
        <h2 className="text-lg font-semibold tracking-tight">
          Open Positions ({jobs.length})
        </h2>

        {jobs.length === 0 ? (
          <div className="flex flex-col items-center py-12 text-center">
            <Briefcase className="h-8 w-8 text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground">
              No active job openings at the moment.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {jobs.map((job) => (
              <CompanyJobCard
                key={job.id}
                job={job}
                companyName={company.name}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
export default CompanyPublicView
