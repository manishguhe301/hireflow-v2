'use client'
import { AppSdk } from '@/src/utils/AppSdk'
import { EmploymentType, ExperienceLevel, WorkMode } from '@prisma/client'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import {
  ArrowLeft, Briefcase,
  BookmarkCheck,
  Bookmark,
  Send,
} from 'lucide-react'
import { formatDate, formatRelativeTime, formatSalary, getLabel, isRichTextEmpty } from '@/src/utils/helper'
import { companyIndustries, employmentTypes, experienceLevels, jobSkills, workModes } from '@/src/utils/constants'
import { Button } from '../ui/Button'
import { useSession } from 'next-auth/react'
import clsx from 'clsx'
import ApplyModal from './applications/ApplyModal'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import JobDetailsSkeleton from '../skeletons/JobDetailsSkeleton'
import ApplicationProgress from './applications/ApplicationProgress'
import SimilarJobs from './similarJobs/SimilarJobs'
import DOMPurify from 'dompurify'

export interface SimilarJob {
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
  hideSalary: boolean,
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

export type ExistingHistory = {
  id: string
  status: string
  createdAt: string
  statusHistory: { status: string; date: string }[]
}


const JobDetailsForApplicant = () => {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string
  const { data: session } = useSession()
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false)
  const [now, setNow] = useState<number | null>(null)

  const queryClient = useQueryClient()

  useEffect(() => {
    //eslint-disable-next-line
    setNow(Date.now())
  }, [])

  const { data, isLoading } = useQuery({
    queryKey: ['job-details', slug],
    queryFn: async () => {
      const res = await AppSdk.getData(`/api/jobs/${slug}`, null)

      if (!res?.job) throw new Error('Failed to fetch job')

      return res
    },
    enabled: !!slug,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false
  })

  const job: JobDetails | null = data?.job ?? null
  const similarJobs: SimilarJob[] = data?.similarJobs ?? []
  const hasApplied = data?.hasApplied ?? false
  const existingApplication: ExistingHistory | null = data?.application ?? null
  const isSaved = data?.isSaved ?? false

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [slug])

  const saveJobMutation = useMutation({
    mutationFn: async ({ jobId, currentlySaved }: { jobId: string; currentlySaved: boolean }) => {
      if (currentlySaved) {
        return AppSdk.deleteData(`/api/jobs/saved?jobId=${jobId}`, null)
      } else {
        return AppSdk.postData(`/api/jobs/saved`, { jobId })
      }
    },
    onSuccess: (_data, variables) => {
      toast.success(
        variables.currentlySaved
          ? 'Job removed from saved'
          : 'Job saved successfully'
      )

      queryClient.invalidateQueries({ queryKey: ['job-details', slug] })
      queryClient.invalidateQueries({ queryKey: ['jobs'] })
      queryClient.invalidateQueries({ queryKey: ['saved-jobs'] })
    },
    onError: () => {
      toast.error('Something went wrong')
    }
  })

  const onSaveToggle = async (jobId: string, currentlySaved: boolean) => {
    saveJobMutation.mutate({ jobId, currentlySaved })
  }

  if (isLoading) {
    return (
      <JobDetailsSkeleton />
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
    job?.applicationDeadline && now
      ? new Date(job.applicationDeadline).getTime() < now
      : false

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
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                {job.title}
              </h1>
              <Button
                onClick={(e) => {
                  e.preventDefault()
                  onSaveToggle(job.id, isSaved)
                }}
                variant='outline'
                className={clsx("p-2! h-full!  bg-background/80 hover:bg-background",
                  !session?.user.id && "hidden"
                )}
                disabled={saveJobMutation.isPending}
                aria-label='Bookmark Job'
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
              <span>•</span>
              <span>{formatRelativeTime(job.createdAt)}</span>
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
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(job.description) }}
              />
            </div>
          )}

          {!isRichTextEmpty(job.requirements) && (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Requirements</h3>
              <div
                className="prose prose-sm max-w-none dark:prose-invert"
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(job.requirements) }}
              />
            </div>
          )}

          {!isRichTextEmpty(job.responsibilities) && (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Responsibilities</h3>
              <div
                className="prose prose-sm max-w-none dark:prose-invert"
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(job.responsibilities) }}
              />
            </div>
          )}
        </div>


        <div className="space-y-6 w-full!">
          <div className="sticky top-12 space-y-6">

            <div className="rounded-2xl border border-border/40 bg-card p-6 space-y-4 w-full">
              {session?.user.id && <div className='flex flex-row items-center gap-4'>
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
                      <ApplicationProgress existingApplication={existingApplication} />
                    )}


                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => router.push('/dashboard/applications')}
                    >
                      View My Applications
                    </Button>
                  </div>
                ) :
                  !isDeadlinePassed ? (
                    <Button
                      onClick={() => {
                        if (!session?.user?.id) {
                          router.push('/login')
                          return
                        }
                        setIsApplyModalOpen(true)
                      }}
                      className="w-full rounded-xl py-3 flex items-center gap-2 justify-center"
                      disabled={!session?.user?.id}
                    >
                      <Send size={20} />  Apply Now
                    </Button>
                  ) :
                    <div className="w-full rounded-xl bg-red-500/10 border border-red-500/30 py-3 px-4 text-center">
                      <p className="text-sm font-medium text-red-600 dark:text-red-400">
                        Application Deadline Passed
                      </p>
                    </div>
                }
              </div>
              }


              {!hasApplied && job.applicationDeadline && !isDeadlinePassed && (
                <p className={clsx("text-xs text-muted-foreground text-center",
                  !session?.user.id && 'text-sm! text-destructive! font-bold!'
                )}>
                  Apply before{' '}
                  {formatDate(job.applicationDeadline)}
                </p>
              )}
            </div>

            <div className="rounded-2xl border border-border/40 bg-card p-6 space-y-4">
              <div className="flex items-center gap-4 ">
                {job.company?.logo ? (
                  <div className='relative'>
                    {/* eslint-disable-next-line */}
                    <img
                      src={job.company?.logo}
                      alt={job.company.name}
                      className={clsx("h-14 w-14 rounded-lg object-cover border border-border",
                        'transition-opacity duration-300',
                      )}
                    />
                  </div>
                ) : (
                  <div className="h-14 w-14 rounded-lg bg-muted flex items-center justify-center" >
                    {job.company.name.charAt(0).toUpperCase()}
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

              <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                {job.company.description || '-'}
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
        <SimilarJobs similarJobs={similarJobs} />
      )}

      {job && <ApplyModal
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
        onSuccess={async () => {
          await queryClient.invalidateQueries({ queryKey: ['job-details', slug] })
          await queryClient.refetchQueries({ queryKey: ['job-details', slug] })
        }}
      />}
    </div>
  )

}

export default JobDetailsForApplicant