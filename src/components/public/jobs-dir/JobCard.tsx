'use client'

import { formatDate, formatSalary, getLabel } from '@/src/utils/helper'
import {
  Building2,
  MapPin,
  Briefcase,
  DollarSign,
  Hourglass,
  Banknote,
} from 'lucide-react'
import Link from 'next/link'
import { DirJobType } from './JobsDirectory'
import {
  employmentTypes,
  experienceLevels,
  jobCategories,
  workModes,
} from '@/src/utils/utils'

export default function JobCard({ job }: { job: DirJobType }) {
  const location = job.city
    ? `${job.city}, ${job.country}`
    : job.country

  return (
    <Link
      href={`/jobs/${job.slug}`}
      className="group block rounded-2xl border border-border/40 bg-card p-6 transition-all duration-200 hover:border-primary/40 hover:shadow-lg"
    >
      <div className="flex items-start gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-border/40 bg-muted overflow-hidden">
          {job.company.logo ? (
            <img
              src={job.company.logo}
              alt={job.company.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <Building2 className="h-6 w-6 text-muted-foreground" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold leading-snug group-hover:text-primary transition line-clamp-1">
            {job.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-1">
            {job.company.name}
          </p>

          <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground ">
            <MapPin className="h-4 w-4 shrink-0" />
            <span className="line-clamp-1">{location}</span>
            <div className="hidden sm:block">
              <span className="rounded-full bg-primary/10 text-primary text-xs font-medium px-3 py-1">
                {getLabel(workModes, job.workMode)}
              </span>
            </div>
          </div>
        </div>


      </div>

      <div className="mt-4 flex flex-wrap items-center gap-6 text-sm">
        <div className="flex items-center gap-1 font-medium text-foreground">
          <Banknote className="h-4 w-4 text-primary" />
          {formatSalary(job.salaryMin, job.salaryMax)}
        </div>

        <div className="flex items-center gap-1 text-muted-foreground">
          <Briefcase className="h-4 w-4" />
          {getLabel(employmentTypes, job.employmentType)}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <span className="rounded-full border border-border/40 bg-muted/50 px-3 py-1 text-xs font-medium">
          {getLabel(experienceLevels, job.experienceLevel)}
        </span>
        <span className="rounded-full border border-border/40 bg-muted/50 px-3 py-1 text-xs font-medium">
          {getLabel(jobCategories, job.category)}
        </span>
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-border/40 pt-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <Hourglass className="h-3.5 w-3.5" />
          <span>Apply by {formatDate(job.applicationDeadline)}</span>
        </div>

        {Number(job.numberOfOpenings) > 1 && (
          <span className="font-medium text-foreground">
            {job.numberOfOpenings} openings
          </span>
        )}
      </div>
    </Link>
  )
}
