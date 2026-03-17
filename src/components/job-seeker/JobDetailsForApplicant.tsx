'use client'
import { AppSdk } from '@/src/utils/AppSdk'
import { useParams, } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import {
  Briefcase,
} from 'lucide-react'
import { formatDate, formatSalary, getLabel, } from '@/src/utils/helper'
import { experienceLevels, jobSkills } from '@/src/utils/constants'
import { useSession } from 'next-auth/react'
import clsx from 'clsx'
import ApplyModal from './applications/ApplyModal'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import JobDetailsSkeleton from '../skeletons/JobDetailsSkeleton'
import SimilarJobs from './similarJobs/SimilarJobs'
import BackButton from '../shared/BackButton'
import { ExistingHistory, JobDetailsType, SimilarJob } from '@/src/types'
import JobTopSection from './JobTopSection'
import { Pill } from '../elements/ProfileElements'
import JobInfo from './JobInfo'
import CompanyInfo from './CompanyInfo'
import ApplySection from './ApplySection'

const JobDetailsForApplicant = () => {
  const params = useParams()
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

  const job: JobDetailsType | null = data?.job ?? null
  const similarJobs: SimilarJob[] = data?.similarJobs ?? []
  const hasApplied: boolean = data?.hasApplied ?? false
  const existingApplication: ExistingHistory | null = data?.application ?? null
  const isSaved: boolean = data?.isSaved ?? false

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
      <BackButton />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          <JobTopSection job={job}
            isSaved={isSaved}
            onSaveToggle={onSaveToggle}
            isPending={saveJobMutation.isPending}
          />

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
                  <Pill
                    key={skill}
                    text={getLabel(jobSkills, skill) as string}
                    className='border border-border/40! bg-muted/50! text-foreground/80! '
                  />
                ))}
              </div>
            </div>
          )}

          <JobInfo
            description={job.description}
            requirements={job.requirements}
            responsibilities={job.responsibilities}
          />
        </div>


        <div className="space-y-6 w-full!">
          <div className="sticky top-12 space-y-6">
            <div className="rounded-2xl border border-border/40 bg-card p-6 space-y-4 w-full">
              {session?.user.id &&
                <ApplySection
                  hasApplied={hasApplied}
                  isDeadlinePassed={isDeadlinePassed}
                  setIsApplyModalOpen={setIsApplyModalOpen}
                  existingApplication={existingApplication}
                />
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

            <CompanyInfo company={job.company} />
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