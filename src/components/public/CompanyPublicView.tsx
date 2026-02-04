'use client'

import { Company, Job } from '@prisma/client'
import JobCard from './JobCard'
import InfoRow from '../admin/InfoRow'
import { ArrowLeft, Building2, Calendar, Globe, MapPin, Users } from 'lucide-react'
import { Button } from '../ui/Button'
import { useRouter } from 'next/navigation'

type CompanyPublicViewProps = {
  company: Company,
  jobs: Job[]
}

const CompanyPublicView = ({ company, jobs }: CompanyPublicViewProps) => {
  const router = useRouter()

  return (
    <div className="mx-auto max-w-5xl space-y-10 px-4 py-6">
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="inline-flex items-center gap-2 mb-6 p-0!"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to companies
      </Button>
      <div className="rounded-3xl border border-border/40 bg-card p-6 shadow-sm">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-border/40 bg-muted overflow-hidden">
              {company.logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={company.logo}
                  alt={`${company.name} logo`}
                  className="h-full w-full object-contain"
                />
              ) : (
                <span className="text-lg font-semibold text-muted-foreground">
                  {company.name.charAt(0)}
                </span>
              )}
            </div>

            <div className="space-y-1">
              <h1 className="text-2xl font-bold break-words">
                {company.name}
              </h1>
              <p className="text-sm text-muted-foreground capitalize">
                {company.industry} • {company.country}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border/40 bg-card p-6 space-y-3">
        <h2 className="text-lg font-semibold">About the Company</h2>
        <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap break-words">
          {company.description}
        </p>
      </div>

      {/* Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-border/40 bg-card p-6 space-y-4">
          <h3 className="text-base font-semibold">Company Information</h3>

          <div className="space-y-2 text-sm">
            <InfoRow icon={<Building2 />} label="Industry" value={company.industry} />
            <InfoRow icon={<MapPin />} label="Location" value={company.country} />
            <InfoRow icon={<Users />} label="Company Size" value={company.companySize} />
            <InfoRow
              icon={<Calendar />}
              label="Founded"
              value={company.foundedYear?.toString() || '—'}
            />
          </div>
        </div>

        <div className="rounded-2xl border border-border/40 bg-card p-6 space-y-4">
          <h3 className="text-base font-semibold">Links</h3>

          <div className="space-y-2 text-sm">
            <InfoRow
              icon={<Globe />}
              label="Website"
              value={company.website || '—'}
              isLink
            />
            <InfoRow
              icon={<Globe />}
              label="LinkedIn"
              value={company.linkedinProfile || '—'}
              isLink
            />
          </div>
        </div>
      </div>

      {/* Jobs */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">
          Open Positions ({jobs.length})
        </h2>

        {jobs.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No active job openings at the moment.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {jobs.map((job) => (
              <JobCard
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
