'use client'

import { Company, Job } from '@prisma/client'
import { Briefcase } from 'lucide-react'
import CompanyJobCard from './CompanyJobCard'
import { useSession } from 'next-auth/react'
import clsx from 'clsx'
import CompanyDetailsTopSection from '../../shared/CompanyDetailsTopSection'
import CompanyiInfo from '../../shared/CompanyiInfo'

type CompanyPublicViewProps = {
  company: Company,
  jobs: Job[]
}

const CompanyPublicView = ({ company, jobs }: CompanyPublicViewProps) => {
  const { data: session } = useSession()

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
