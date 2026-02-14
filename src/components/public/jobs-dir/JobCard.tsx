'use client'

import { formatDate, formatSalary, getLabel } from '@/src/utils/helper'
import { Building2, MapPin, Briefcase, Clock, DollarSign, Hourglass } from 'lucide-react'
import Link from 'next/link'
import { DirJobType } from './JobsDirectory'
import { employmentTypes, experienceLevels, jobCategories, workModes } from '@/src/utils/utils'


export default function JobCard({ job }: { job: DirJobType }) {
  const location = job.city ? `${job.city}, ${job.country}` : job.country

  return (
    <Link
      href={`/jobs/${job.slug}`}
      className="group block rounded-2xl border border-border/40 bg-card p-6 shadow-sm transition hover:border-border/60 hover:shadow-md"
    >
      <div className="mb-4 flex items-start gap-4">
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
          <h3 className="font-semibold text-lg leading-tight mb-1 group-hover:text-primary transition line-clamp-1">
            {job.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-1">
            {job.company.name}
          </p>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 shrink-0" />
          <span className="line-clamp-1">{location}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Briefcase className="h-4 w-4 shrink-0" />
          <span className="line-clamp-1">
            {getLabel(workModes, job.workMode)} • {getLabel(employmentTypes, job.employmentType)}
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <DollarSign className="h-4 w-4 shrink-0" />
          <span>{formatSalary(job.salaryMin, job.salaryMax)}</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <span className="inline-flex items-center rounded-full border border-border/40 bg-muted/50 px-2.5 py-0.5 text-xs font-medium">
          {getLabel(experienceLevels, job.experienceLevel)}
        </span>
        <span className="inline-flex items-center rounded-full border border-border/40 bg-muted/50 px-2.5 py-0.5 text-xs font-medium">
          {getLabel(jobCategories, job.category)}
        </span>
      </div>
      <div className="flex items-center justify-between border-t border-border/40 pt-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <Hourglass className="h-3.5 w-3.5" />
          <span>
            {formatDate(job.applicationDeadline)}
          </span>
        </div>
        {Number(job.numberOfOpenings) > 1 && (
          <span className="font-medium">
            {job.numberOfOpenings} openings
          </span>
        )}
      </div>
    </Link>
  )
}