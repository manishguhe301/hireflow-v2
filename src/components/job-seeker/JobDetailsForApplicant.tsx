'use client'
import { AppSdk } from '@/src/utils/AppSdk'
import { EmploymentType, ExperienceLevel, WorkMode } from '@prisma/client'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Spinner } from '../elements/Loader'
import {
  ArrowLeft, Briefcase, Clock, MapPin, CheckCircle,
  Circle,
  XCircle,
  BookmarkCheck,
  Bookmark,
} from 'lucide-react'
import { APPLICATIONS_TABS, formatDate, formatRelativeTime, formatSalary, getLabel, isRichTextEmpty } from '@/src/utils/helper'
import { companyIndustries, employmentTypes, experienceLevels, jobSkills, workModes } from '@/src/utils/utils'
import { Button } from '../ui/Button'
import { useSession } from 'next-auth/react'
import clsx from 'clsx'
import ApplyModal from './applications/ApplyModal'

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

const STATUS_FLOW = [
  'APPLIED',
  'REVIEWING',
  'SHORTLISTED',
  'INTERVIEW_SCHEDULED',
  'OFFERED',
  'HIRED',
  'REJECTED',
]


const JobDetailsForApplicant = () => {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string
  const [loading, setLoading] = useState(true)
  const [job, setJob] = useState<JobDetails | null>(null)
  const [similarJobs, setSimilarJobs] = useState<SimilarJob[]>([])
  const { data: session } = useSession()
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false)
  const [hasApplied, setHasApplied] = useState(false)
  const [existingApplication, setExistingApplication] = useState<{
    id: string
    status: string
    createdAt: string
    statusHistory: { status: string; date: string }[]
  } | null>(null)
  const [isSaved, setIsSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)


  const fetchJobDetails = async () => {
    try {
      const res = await AppSdk.getData(
        `/api/jobs/${slug}`,
        null,
      )
      if (res.job) {
        setJob(res.job)
        setSimilarJobs(res.similarJobs)
        setHasApplied(res.hasApplied)
        setExistingApplication(res.application)
        setIsSaved(res.isSaved)
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

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
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

  const isDeadlinePassed =
    job.applicationDeadline &&
    new Date(job.applicationDeadline).getTime() < Date.now()


  const onSaveToggle = async (jobId: string, currentlySaved: boolean) => {
    setSaving(true)
    try {
      if (currentlySaved) {
        const res = await AppSdk.deleteData(`/api/jobs/saved?jobId=${jobId}`, null)
        if (res.error) {
          toast.error(res.error || 'Failed to remove saved job')
          return
        }
        toast.success('Job removed from saved')
      } else {
        const res = await AppSdk.postData(`/api/jobs/saved`, {
          jobId
        })

        if (res.error) {
          toast.error(res.error || 'Failed to save job')
          return
        }

        toast.success('Job saved successfully')
      }
      fetchJobDetails()
    } catch (error) {
      toast.error('Something went wrong')
    }
    finally {
      setSaving(false)
    }
  }

  return (
    <div className={clsx("mx-auto  px-4 py-10 space-y-10", session?.user.id ? 'max-w-6xl' : 'max-w-5xl')}>
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="inline-flex items-center gap-2 mb-6 p-0!"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

        <div className="lg:col-span-2 space-y-8">

          <div className="space-y-4">
            <div className="flex flex-row items-start justify-between gap-4">
              <h1 className="text-3xl font-bold tracking-tight">
                {job.title}
              </h1>
              <Button
                onClick={(e) => {
                  e.preventDefault()
                  onSaveToggle(job.id, isSaved)
                }}
                variant='outline'
                className={clsx("p-2! h-full!  bg-background/80 hover:bg-background",
                  !session && "hidden"
                )}
                disabled={saving}
              >
                {isSaved ? (
                  <BookmarkCheck className="h-5 w-5 text-primary" />
                ) : (
                  <Bookmark className="h-5 w-5 text-muted-foreground" />
                )}
              </Button>

            </div>

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


        <div className="space-y-6 w-full!">
          <div className="sticky top-12 space-y-6">

            <div className="rounded-2xl border border-border/40 bg-card p-6 space-y-4 w-full">
              <div className='flex flex-row items-center gap-4'>
                {hasApplied ? (
                  <div className="space-y-3 w-full">
                    <div className="w-full rounded-xl bg-green-500/10 border border-green-500/30 py-3 px-4 text-center">
                      <p className="text-sm font-medium text-green-600 dark:text-green-400">
                        ✓ Already Applied
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Applied on {formatDate(existingApplication?.createdAt || '')}
                      </p>
                    </div>

                    {existingApplication && existingApplication?.statusHistory?.length > 0 && (
                      <div className="border-t border-border/60 pt-4 space-y-4">
                        <h4 className="text-sm font-semibold">Application Progress</h4>
                        {existingApplication.status === 'REJECTED' && <p className="text-xs text-red-600 mt-2">
                          This application was closed before moving to the next stage.
                        </p>
                        }
                        <div className="relative pl-6">
                          <div className="absolute left-2 top-0 bottom-0 w-px bg-border" />

                          {STATUS_FLOW.map((status) => {
                            const historyItem = existingApplication.statusHistory.find(
                              (s) => s.status === status,
                            )

                            const isCompleted = !!historyItem

                            return (
                              <div
                                key={status}
                                className="relative flex items-start gap-3 pb-6 last:pb-0"
                              >

                                <div className="absolute -left-[9px] top-1">
                                  {isCompleted ? (
                                    status === 'REJECTED' ? (
                                      <XCircle className="h-4 w-4 text-red-600" />
                                    ) : (
                                      <CheckCircle className="h-4 w-4 text-green-600" />
                                    )
                                  ) : (
                                    <Circle className="h-4 w-4 text-muted-foreground" />
                                  )}
                                </div>

                                <div>
                                  <p
                                    className={clsx(
                                      'text-sm font-medium pl-4',
                                      isCompleted
                                        ? status === 'REJECTED' ? 'text-red-600' : 'text-primary'
                                        : 'text-muted-foreground',
                                    )}
                                  >
                                    {getLabel(
                                      APPLICATIONS_TABS,
                                      status,
                                    )}
                                  </p>

                                  {historyItem && (
                                    <p className="text-xs text-muted-foreground mt-1 pl-4">
                                      {formatRelativeTime(historyItem.date)}
                                    </p>
                                  )}
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )}


                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => router.push('/dashboard')}
                    >
                      View My Applications
                    </Button>
                  </div>
                ) :
                  !isDeadlinePassed ? (
                    <Button
                      onClick={() => setIsApplyModalOpen(true)}
                      className="w-full rounded-xl py-3"
                      disabled={!session?.user?.id}
                    >
                      Apply Now
                    </Button>
                  ) :
                    <div className="w-full rounded-xl bg-red-500/10 border border-red-500/30 py-3 px-4 text-center">
                      <p className="text-sm font-medium text-red-600 dark:text-red-400">
                        Application Deadline Passed
                      </p>
                    </div>
                }
              </div>


              {!hasApplied && job.applicationDeadline && !isDeadlinePassed && (
                <p className="text-xs text-muted-foreground text-center">
                  Apply before{' '}
                  {formatDate(job.applicationDeadline)}
                </p>
              )}
            </div>

            <div className="rounded-2xl border border-border/40 bg-card p-6 space-y-4">
              <div className="flex items-center gap-4 ">
                {job.company.logo ? (
                  <div className='relative'>
                    {!imageLoaded && (
                      <div className="absolute inset-0 animate-pulse bg-muted rounded-lg" />
                    )}
                    {/* eslint-disable-next-line */}
                    <img
                      src={job.company.logo}
                      alt={job.company.name}
                      onLoad={() => setImageLoaded(true)}
                      onError={() => setImageLoaded(true)}
                      className="h-14 w-14 rounded-lg object-cover border"
                    />
                  </div>
                ) : (
                  <div className="h-14 w-14 rounded-lg bg-muted" >
                    {job.company.name.charAt(0)}
                  </div>
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
                  router.push(
                    session?.user.id
                      ? `/company-details/${job.company.id}` :
                      `/explore/companies/${job.company.id}`)
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
                onClick={() => router.push(
                  session?.user.id ? `/jobs/${similar.slug}` :
                    `/explore/jobs/${similar.slug}`
                )}
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
            logo: job.company.logo,
          },
          country: job.country,
          city: job.city || null,
        }}
        onSuccess={() => {
          setHasApplied(true)
          setExistingApplication({
            id: '',
            status: 'APPLIED',
            createdAt: new Date().toISOString(),
            statusHistory: []
          })
          fetchJobDetails()
        }}
      />
    </div>
  )

}

export default JobDetailsForApplicant