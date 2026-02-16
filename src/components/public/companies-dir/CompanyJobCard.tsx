'use client'

import { formatRelativeTime, formatSalary, getLabel } from "@/src/utils/helper"
import { employmentTypes, experienceLevels, workModes } from "@/src/utils/utils"
import { Job } from "@prisma/client"
import { Briefcase, Clock, MapPin } from "lucide-react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

type JobCardProps = {
  job: Job
  companyName?: string
}

export default function CompanyJobCard({ job, companyName }: JobCardProps) {
  const router = useRouter()
  const { data: session } = useSession()
  return (
    <div
      onClick={() => router.push(!session?.user.id ?
        `/explore/jobs/${job.slug}`
        : `/jobs/${job.slug}`)}
      className="group cursor-pointer rounded-2xl border border-border/40 bg-card p-5 space-y-3  transition-all duration-200 hover:border-primary/40 hover:shadow-lg">
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
            {getLabel(workModes, job.workMode)} • {getLabel(employmentTypes, job.employmentType)}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <Clock className="h-4 w-4" />
          <span>{getLabel(experienceLevels, job.experienceLevel)}</span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2">
        <p className="text-sm font-medium">
          {job.hideSalary
            ? 'Salary not disclosed'
            : job.salaryMin || job.salaryMax
              ? formatSalary(job.salaryMin, job.salaryMax)
              : '—'}
        </p>

        <span className="text-xs text-muted-foreground">
          {formatRelativeTime(job.createdAt)}
        </span>
      </div>
    </div>
  )
}