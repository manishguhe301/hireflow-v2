import { DirJobType } from '@/src/types'
import { employmentTypes, jobCategories } from '@/src/utils/constants'
import { formatRelativeTime, getLabel, isNewJob } from '@/src/utils/helper'
import { ArrowRight, Building2, MapPin } from 'lucide-react'
import Link from 'next/link'

const LatestJobs = ({ jobs }: {
  jobs: DirJobType[]
}) => {
  return (
    <section id="jobs" className="border-t border-border/60 bg-muted/30">
      <div className="mx-auto max-w-7xl px-6 py-24">
        <div className="flex items-end justify-between mb-14">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight">Latest Jobs</h2>
            <p className="mt-2 text-sm text-muted-foreground ">
              Browse active opportunities from verified companies
            </p>
          </div>
          <Link href="/explore/jobs" className="text-sm text-primary hover:opacity-70 max-sm:hidden">
            View all jobs
          </Link>
        </div>

        <div className="grid gap-4">
          {
            jobs.length === 0 ?
              <div>
                <div className="flex justify-center py-24" >
                  <span className="text-sm text-muted-foreground">No jobs found</span>
                </div>

              </div> : jobs.map((job: DirJobType) => (
                <Link
                  key={job.id}
                  href={`/explore/jobs/${job.slug}`}
                  className="group rounded-2xl border border-border/60 bg-card p-6 transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-start gap-5">
                      <div className="relative">
                        <div className="absolute inset-0 rounded-full border border-primary/30 blur-[0.5px]" />
                        <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border/40 bg-muted overflow-hidden sm:h-12 sm:w-12">
                          {job.company?.logo ? (
                            <>
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={job.company?.logo}
                                alt={job.company.name}
                                className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
                              />
                            </>
                          ) : (
                            <Building2 className="h-6 w-6 text-muted-foreground" />
                          )}
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold flex items-center gap-2">
                          {job.title}
                          {isNewJob(job.createdAt) && (
                            <span className="rounded-md bg-primary/15 px-2 py-[2px] text-[10px] font-semibold text-primary">
                              NEW
                            </span>
                          )}
                        </h3>
                        <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                          <span className="font-medium text-foreground/80">
                            {job.company.name}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {job.city ? `${job.city}, ${job.country}` : job.country}
                          </span>
                          <span className="rounded bg-muted px-2 py-0.5 uppercase tracking-wide max-sm:hidden">
                            {getLabel(jobCategories, job.category)}
                          </span>
                          <span className="flex items-center gap-1">
                            {formatRelativeTime(job.createdAt)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="hidden md:inline-block text-[11px] font-semibold uppercase tracking-widest text-primary/70">
                        {getLabel(employmentTypes, job.employmentType)}
                      </span>
                      <ArrowRight className="w-4 h-4 text-muted-foreground transition-all group-hover:text-primary group-hover:translate-x-1" />
                    </div>
                  </div>
                </Link>
              ))}
        </div>
      </div>
    </section>
  )
}

export default LatestJobs