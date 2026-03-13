'use client'

import { formatDate, formatSalary, getLabel } from '@/src/utils/helper'
import {
  Building2,
  MapPin,
  Briefcase,
  Hourglass,
  Banknote,
  BookmarkCheck,
  Bookmark,
  Zap,
} from 'lucide-react'
import Link from 'next/link'
import { DirJobType } from './JobsDirectory'
import {
  employmentTypes,
  experienceLevels,
  jobCategories,
  workModes,
} from '@/src/utils/constants'
import { useSession } from 'next-auth/react'
import { Button } from '../../ui/Button'
import clsx from 'clsx'
import { useState } from 'react'
import ApplyModal from '../../job-seeker/applications/ApplyModal'
import { useQueryClient } from '@tanstack/react-query'

type JobCardProps = {
  job: DirJobType,
  isSaved?: boolean
  onSaveToggle?: () => void
  disabled?: boolean
  isApplied?: boolean
}

export default function JobCard({
  job,
  isSaved = false,
  onSaveToggle,
  disabled,
  isApplied
}: JobCardProps) {
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false)
  const location = job.city
    ? `${job.city}, ${job.country}`
    : job.country

  const { data: session } = useSession()
  const queryClient = useQueryClient()

  return (
    <>
      <div
        className="group block rounded-2xl border border-border/40 bg-card p-6 max-sm:p-4 transition-all duration-200 hover:border-primary/40 hover:shadow-md hover:-translate-y-[2px]">
        <Link
          href={session?.user?.id ? `/jobs/${job.slug}` : `/explore/jobs/${job.slug}`}
          className='flex flex-col justify-between h-full'
        >
          <div>
            <div className="flex items-start gap-4 relative">
              <div className=" relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-border/40 bg-muted overflow-hidden sm:h-12 sm:w-12">
                {job.company?.logo ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={job.company?.logo}
                      alt={`${job.company.name} logo`}
                      className={clsx(
                        "h-full w-full object-cover transition-opacity duration-300",
                      )}
                      loading='lazy'
                    />
                  </>
                ) : (
                  <Building2 className="h-6 w-6 text-muted-foreground" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className={clsx("text-base font-semibold leading-snug group-hover:text-primary transition line-clamp-2", session?.user.id && "max-w-[calc(100%-3.5rem)]")}>
                  {job.title}
                </h3>
                <p className="text-sm font-medium text-muted-foreground line-clamp-1">              {job.company.name}
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

              <Button
                onClick={(e) => {
                  e.preventDefault()
                  onSaveToggle?.()
                }}
                variant='outline'
                disabled={disabled}
                aria-label="Save"
                className={clsx("absolute top-1 right-1 p-2! rounded-full! bg-background/80 hover:bg-background",
                  !session?.user.id && "hidden"
                )}
              >
                {isSaved ? (
                  <BookmarkCheck className="h-5 w-5 text-primary" />
                ) : (
                  <Bookmark className="h-5 w-5 text-muted-foreground" />
                )}
              </Button>

            </div>

            <div className="mt-4 flex flex-wrap items-center gap-6 text-sm">
              {!job?.hideSalary &&
                <div className="flex items-center gap-1 font-medium text-foreground">
                  <Banknote className="h-4 w-4 text-primary" />
                  {formatSalary(job.salaryMin ?? null, job.salaryMax ?? null)}
                </div>
              }

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
          </div>

          <div className="mt-5 flex items-center justify-between border-t border-border/40 pt-4 text-xs text-muted-foreground">
            <div className={clsx("flex items-center gap-3", !session?.user.id && "w-full justify-between")}>
              <div className="flex items-center gap-1">
                <Hourglass className="h-3.5 w-3.5" />
                <span>Apply by {formatDate(job.applicationDeadline)}</span>
              </div>

              {Number(job.numberOfOpenings) > 1 && (
                <span className="font-medium text-foreground max-sm:hidden">
                  {job.numberOfOpenings} openings
                </span>
              )}
            </div>

            {session && !isApplied && (
              <Button
                size="sm"
                className="flex items-center gap-1 px-3 py-1.5 text-xs"
                onClick={(e) => {
                  e.preventDefault()
                  setIsApplyModalOpen(true)
                }}
                disabled={disabled}
              >
                <Zap className="h-3.5 w-3.5" />
                Quick Apply
              </Button>
            )}
          </div>
        </Link>

      </div>
      <ApplyModal
        open={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        job={{
          id: job.id,
          title: job.title,
          slug: job.slug,
          workMode: job.workMode,
          employmentType: job.employmentType,
          company: {
            name: job.company.name,
            logo: job.company?.logo,
          },
          country: job.country,
          city: job.city || null,
        }}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ['jobs'] })
          queryClient.invalidateQueries({ queryKey: ['saved-jobs'] })
          queryClient.invalidateQueries({ queryKey: ['job-details', job.slug] })
          queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
          queryClient.invalidateQueries({ queryKey: ['dashboard-activity'] })
          queryClient.invalidateQueries({ queryKey: ['dashboard-recommended'] })
        }}
      />
    </>
  )
}
