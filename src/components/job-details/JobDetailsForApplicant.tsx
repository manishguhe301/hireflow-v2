'use client'
import { AppSdk } from '@/src/utils/AppSdk'
import { EmploymentType, ExperienceLevel, WorkMode } from '@prisma/client'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Spinner } from '../elements/Loader'
import { ArrowLeft, Briefcase, Clock, MapPin } from 'lucide-react'
import { formatDate, formatRelativeTime, formatSalary, getLabel, isRichTextEmpty } from '@/src/utils/helper'
import { companyIndustries, employmentTypes, experienceLevels, jobSkills, workModes } from '@/src/utils/utils'
import { Button } from '../ui/Button'
import { useSession } from 'next-auth/react'

interface SimilarJob {
  company: {
    id: string;
    name: string;
    logo: string | null;
  };
  id: string;
  slug: string;
  title: string;
  experienceLevel: ExperienceLevel;
  employmentType: EmploymentType;
  workMode: WorkMode;
  country: string;
  city: string | null;
  salaryMin: number | null;
  salaryMax: number | null;
  numberOfOpenings: number;
  applicationDeadline: Date | null;
  category: string;
  createdAt: Date;
}

interface JobDetails {
  id: string,
  title: string,
  description: string,
  requirements: string,
  responsibilities: string,
  skills: string[],
  experienceLevel: ExperienceLevel,
  employmentType: EmploymentType,
  workMode: WorkMode,
  country: string,
  city?: string,
  salaryMin?: string,
  salaryMax?: string,
  hideSalary: string,
  numberOfOpenings: string,
  applicationDeadline?: string,
  category: string,
  slug: string,
  views: string,
  createdAt: string,
  updatedAt: string,
  company: {
    id: string,
    name: string,
    logo: string,
    description: string,
    industry: string,
    companySize: string,
    foundedYear?: number,
    website?: string,
    linkedinProfile?: true,
    country: string,
    city: string,
    activeJobsCount: 5
  }
}

const JobDetailsForApplicant = () => {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string
  const [loading, setLoading] = useState(true)
  const [job, setJob] = useState<JobDetails | null>(null)
  const [similarJobs, setSimilarJobs] = useState<SimilarJob[]>([])
  const { data: session } = useSession()

  const fetchJobDetails = async () => {
    try {
      const res = await AppSdk.getData(
        `/api/jobs/${slug}`,
        null,
      )
      if (res.job) {
        setJob(res.job)
        setSimilarJobs(res.similarJobs)
      }
    } catch (error) {
      console.error(error)
      toast.error('Failed to fetch job details')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!slug) return
    fetchJobDetails()
  }, [slug])


  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 h-screen text-sm">
        <Spinner className="h-6 w-6" />
      </div>
    )
  }

  if (!job) {
    return (
      <div className="flex flex-col items-center justify-center h-screen py-24 text-center w-full">
        <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
          <Briefcase className="h-10 w-10 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold mb-1">Job Not Found</h3>
        <p className="text-sm text-muted-foreground mb-6 max-w-sm">
          The job you are looking for does not exist, or has been removed.
        </p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 space-y-10">
      <Button
        variant="ghost"
        onClick={() => router.push('/explore/jobs')}
        className="inline-flex items-center gap-2 mb-6 p-0!"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to jobs
      </Button>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

        <div className="lg:col-span-2 space-y-8">

          <div className="space-y-4">
            <h1 className="text-3xl font-bold tracking-tight">
              {job.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span>{job.company.name}</span>
              <span>•</span>
              <span>
                {job.city ? `${job.city}, ${job.country}` : job.country}
              </span>
              <span>•</span>
              <span>{getLabel(workModes, job.workMode)}</span>
              <span>•</span>
              <span>{getLabel(employmentTypes, job.employmentType)}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-6 text-sm border-t border-border/40 pt-4">
            {!job.hideSalary && (
              <div>
                <span className="font-medium text-foreground">
                  {formatSalary(Number(job.salaryMin), Number(job.salaryMax))}
                </span>
              </div>
            )}
            <div>{getLabel(experienceLevels, job.experienceLevel)}</div>
            <div>{job.numberOfOpenings} opening(s)</div>
            <div>{job.views} views</div>
          </div>

          {job.skills?.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">Skills Required</h3>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 rounded-full text-xs border border-border/40 bg-muted/50"
                  >
                    {getLabel(jobSkills, skill)}
                  </span>
                ))}
              </div>
            </div>
          )}

          {!isRichTextEmpty(job.description) && (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Job Description</h3>
              <div
                className="prose prose-sm max-w-none dark:prose-invert"
                dangerouslySetInnerHTML={{ __html: job.description }}
              />
            </div>
          )}

          {!isRichTextEmpty(job.requirements) && (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Requirements</h3>
              <div
                className="prose prose-sm max-w-none dark:prose-invert"
                dangerouslySetInnerHTML={{ __html: job.requirements }}
              />
            </div>
          )}

          {!isRichTextEmpty(job.responsibilities) && (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Responsibilities</h3>
              <div
                className="prose prose-sm max-w-none dark:prose-invert"
                dangerouslySetInnerHTML={{ __html: job.responsibilities }}
              />
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="sticky top-6 space-y-6">

            <div className="rounded-2xl border border-border/40 bg-card p-6 space-y-4">
              <button
                onClick={() => router.push(`/jobs/${job.slug}/apply`)}
                className="w-full rounded-xl bg-primary text-white py-3 text-sm font-medium hover:opacity-90 transition disabled:opacity-70 disabled:cursor-not-allowed"
                disabled={!job.applicationDeadline || !session?.user.id}
              >
                Apply Now
              </button>

              {job.applicationDeadline && (
                <p className="text-xs text-muted-foreground text-center">
                  Apply before{' '}
                  {formatDate(job.applicationDeadline)}
                </p>
              )}
            </div>

            <div className="rounded-2xl border border-border/40 bg-card p-6 space-y-4">
              <div className="flex items-center gap-4">
                {job.company.logo ? (
                  //eslint-disable-next-line
                  <img
                    src={job.company.logo}
                    alt={job.company.name}
                    className="h-14 w-14 rounded-lg object-cover border"
                  />
                ) : (
                  <div className="h-14 w-14 rounded-lg bg-muted" />
                )}
                <div>
                  <h4 className="font-semibold">
                    {job.company.name}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {getLabel(companyIndustries, job.company.industry)}
                  </p>
                </div>
              </div>

              <p className="text-sm text-muted-foreground line-clamp-4">
                {job.company.description}
              </p>

              <Button
                variant='ghost'
                onClick={() =>
                  router.push(`/explore/companies/${job.company.id}`)
                }
                className="text-sm font-medium text-primary hover:underline"
              >
                View Company
              </Button>
            </div>

          </div>
        </div>
      </div>

      {similarJobs?.length > 0 && (
        <div className="space-y-6 border-t border-border/40 pt-10">
          <h3 className="text-xl font-semibold">Similar Jobs</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {similarJobs.map((similar) => (
              <div
                key={similar.id}
                className="group rounded-2xl border border-border/40 bg-card p-5 space-y-3   cursor-pointer transition-all duration-200 hover:border-primary/40 hover:shadow-lg"
                onClick={() => router.push(`/explore/jobs/${similar.slug}`)}
              >
                <div className="space-y-1">
                  <h3 className="text-base font-semibold leading-tight break-words group-hover:text-primary">
                    {similar.title}
                  </h3>

                  <p className="text-sm text-muted-foreground">{similar.company.name}</p>
                </div>

                <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span className="break-words"> {similar.city ? `${similar.city}, ${similar.country}` : job.country}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <Briefcase className="h-4 w-4" />
                    <span>
                      {getLabel(workModes, similar.workMode)} • {getLabel(employmentTypes, similar.employmentType)}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{getLabel(experienceLevels, similar.experienceLevel)}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs text-muted-foreground">
                    {formatRelativeTime(similar.createdAt)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )

}

export default JobDetailsForApplicant