'use client'

import { Job } from "@prisma/client"
import { Briefcase, Clock, MapPin } from "lucide-react"

type JobCardProps = {
  job: Job
  companyName?: string
}

export default function JobCard({ job, companyName }: JobCardProps) {
  return (
    <div className="rounded-2xl border border-border/40 bg-card p-5 space-y-3 hover:shadow-sm transition">
      <div className="space-y-1">
        <h3 className="text-base font-semibold leading-tight break-words">
          {job.title}
        </h3>

        {companyName && (
          <p className="text-sm text-muted-foreground">{companyName}</p>
        )}
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          <MapPin className="h-4 w-4" />
          <span className="break-words">{job.country} • {job.city}</span>
        </div>

        <div className="flex items-center gap-1">
          <Briefcase className="h-4 w-4" />
          <span>
            {job.workMode} • {job.employmentType}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <Clock className="h-4 w-4" />
          <span>{job.experienceLevel}</span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2">
        <p className="text-sm font-medium">
          {job.hideSalary
            ? 'Salary not disclosed'
            : job.salaryMin && job.salaryMax
              ? `₹${job.salaryMin} – ₹${job.salaryMax}`
              : '—'}
        </p>

        <span className="text-xs text-muted-foreground">
          {new Date(job.createdAt).toLocaleDateString()}
        </span>
      </div>
    </div>
  )
}