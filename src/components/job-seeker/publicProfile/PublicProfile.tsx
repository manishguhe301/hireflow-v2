'use client'
import { FullProfile } from '@/src/store/slices/job-seeker/userProfileSlice'
import { AppSdk } from '@/src/utils/AppSdk'
import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '../../ui/Button'
import { CircleUser, ShieldUser } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { formatSalary, getLabel } from '@/src/utils/helper'
import { currentEmploymentStatuses, jobCategories, jobSkills, noticePeriods, workModes } from '@/src/utils/constants'
import DocumentCard from '../../shared/DocumentCard'
import { Application, ApplicationStatus } from '@prisma/client'
import clsx from 'clsx'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import PublicProfileSkeleton from '../../skeletons/PublicProfileSkeleton'
import { APPLICATIONS_TABS } from '@/src/utils/constants'
import ProfileTopSection from '../../shared/ProfileTopSection'
import { Pill, ProfileSection, SubHeader } from '../../elements/ProfileElements'
import ContactSection from '../profile/ContactSection'
import Experience from '../../shared/Experience'
import EduCard from '../profile/EduCard'
import CertificateCard from '../profile/CertificateCard'
import RejectApplicantModal from './RejectApplicantModal'
import AdminMetadata from './AdminMetadata'

const PublicProfile = () => {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { data: session } = useSession()
  const isComapnyAdmin = session?.user.role === 'COMPANY_ADMIN'
  const { slug, applicationId } = useParams()
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false)
  const [newStatus, setNewStatus] = useState<ApplicationStatus | null>(null)
  const [internalNotes, setInternalNotes] = useState('')
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['public-profile', id, slug, applicationId],
    queryFn: async () => {
      const api = isComapnyAdmin
        ? `/api/company/applications/${slug}/${applicationId}`
        : `/api/profile/${id}`
      const res = await AppSdk.getData(api, null)
      if (res.error) throw new Error(res.error)
      return res
    },
  })
  const profile: FullProfile = data?.profile ?? null
  const application: Application = data?.application ?? null

  const statusMutation = useMutation({
    mutationFn: async ({ status, notes }: { status: ApplicationStatus; notes?: string }) => {
      if (!application) throw new Error('No application')
      const res = await AppSdk.patchData(`/api/applications/${application.id}/update`, {
        status,
        internalNotes: status === 'REJECTED' ? notes : '',
      })
      if (res.error) throw new Error(res.error)
      return res
    },
    onSuccess: (res) => {
      toast.dismiss()
      toast.success('Application status updated')
      queryClient.setQueryData(['public-profile', id, slug, applicationId],
        //eslint-disable-next-line
        (old: any) => ({
          ...old,
          application: res.application,
        }))
      queryClient.invalidateQueries({ queryKey: ['job-applications'] })
      queryClient.invalidateQueries({
        queryKey: ['company-dashboard']
      })
      setIsRejectModalOpen(false)
      setInternalNotes('')
    },
    onError: () => {
      toast.dismiss()
      toast.error('Something went wrong')
    },
    onMutate: () => {
      toast.loading('Updating status...')
    },
  })


  const handleStatusChange = async (
    status: ApplicationStatus,
    notes?: string,
  ) => {
    if (!application) return

    statusMutation.mutate({ status, notes })
  }

  const chatMutation = useMutation({
    mutationFn: async () => {
      const res = await AppSdk.postData('/api/chat/conversations/create', {
        jobSeekerId: application?.userId,
        jobId: application?.jobId,
      })
      if (res.error) throw new Error(res.error)
      return res
    },
    onSuccess: (res) => {
      router.push(`/company/chat?conversation=${res.conversationId}`)
    },
    onError: () => {
      toast.error('Failed to start conversation')
    },
  })

  const handleMessageClick = async () => {
    chatMutation.mutate()
  };

  if (isLoading) {
    return (
      <PublicProfileSkeleton />
    )
  }

  if (!profile) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-6">
        <div className="w-full max-w-md rounded-2xl border border-border/40 bg-card p-8 text-center space-y-4 shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-muted">
            <CircleUser className="h-7 w-7 text-muted-foreground" />
          </div>

          <h2 className="text-xl font-semibold">Profile Not Found</h2>
          <p className="text-sm text-muted-foreground">
            The profile you’re looking for does not exist or may not be public.
          </p>

          <Button
            onClick={() => router.push('/dashboard')}
            className="mt-2"
          >
            Back to Dashboard
          </Button>
        </div>
      </div>
    )
  }


  const isOwner = session?.user?.id === profile.userId
  const isAdmin =
    session?.user?.role === 'PLATFORM_ADMIN'
    || session?.user?.role === 'COMPANY_ADMIN'
  const isPlatFormAdmin = session?.user?.role === 'PLATFORM_ADMIN'

  const canView =
    profile.isPublic || isOwner || isAdmin

  if (!canView) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-6">
        <div className="w-full max-w-md rounded-2xl border border-border/40 bg-card p-8 text-center space-y-4 shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
            <ShieldUser className="h-7 w-7 text-destructive" />
          </div>
          <h2 className="text-xl font-semibold">Private Profile</h2>
          <p className="text-sm text-muted-foreground">
            This profile is private and not available for public viewing.
          </p>
        </div>
      </div>
    )
  }


  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-8">
      <ProfileTopSection
        profile={profile}
        isPublicBtnShow={false}
        handleMessageClick={
          handleMessageClick
        }
        isPending={chatMutation.isPending}
        slug={slug}
        isApplicationAvailable={!!application}
      />

      {profile.bio && (
        <ProfileSection title="About" >
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">
            {profile.bio}
          </p>
        </ProfileSection>
      )}

      <div className="grid grid-cols-1 gap-6  lg:grid-cols-2 ">
        <ProfileSection title='Contact Information'
          className="space-y-4">
          <ContactSection
            profile={profile}
            className="space-y-3 text-sm text-muted-foreground divide-y divide-border/40"
          />
        </ProfileSection>

        <div className='flex flex-col gap-6'>
          <ProfileSection title='Preferred Job Categories'>
            {profile.jobCategories.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {profile.jobCategories.map((category) => (
                  <Pill
                    key={category}
                    text={getLabel(jobCategories, category) as string}
                  >
                  </Pill>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">—</p>
            )}
          </ProfileSection>

          <ProfileSection title='Preferred Locations'>
            {profile.preferredLocations.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {profile.preferredLocations.map((location) => (
                  <Pill
                    key={location}
                    text={location}
                  />
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">—</p>
            )}
          </ProfileSection>
        </div>
      </div>

      {profile.skills.length > 0 && (
        <ProfileSection title='Skills'>
          <div className="mt-4 flex flex-wrap gap-2">
            {profile.skills.map((skill) => (
              <Pill
                text={getLabel(jobSkills, skill) as string}
                key={skill}
              />
            ))}
          </div>
        </ProfileSection>
      )}

      <ProfileSection title='Professional Preferences'>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-muted-foreground">
          <div>
            <p className="font-medium text-foreground mb-1">Preferred Work Mode</p>
            {profile.preferredWorkMode.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {profile.preferredWorkMode.map((mode) => (
                  <Pill
                    key={mode}
                    text={getLabel(workModes, mode) as string}
                  />
                ))}
              </div>
            ) : (
              '—'
            )}
          </div>

          <div>
            <SubHeader text="Willing to Relocate" />
            {profile.willingToRelocate ? 'Yes' : 'No'}
          </div>

          <div>
            <SubHeader text="Current Employment" />
            {profile.currentEmployment
              ? getLabel(currentEmploymentStatuses, profile.currentEmployment)
              : '—'}
          </div>

          <div>
            <SubHeader text="Notice Period" />
            {profile.noticePeriod
              ? getLabel(noticePeriods, profile.noticePeriod)
              : '—'}
          </div>

          <div>
            <SubHeader text="Expected CTC" />
            {profile.expectedSalaryMin
              // || profile.expectedSalaryMax
              ? formatSalary(profile.expectedSalaryMin,
                // profile.expectedSalaryMax
              )
              : '—'}
          </div>
        </div>
      </ProfileSection>

      <ProfileSection title='Work Experience'>
        <div className="space-y-6">
          {profile.workExperience.length > 0 ?
            profile.workExperience.map((exp) => (
              <Experience key={exp.id} exp={exp} />
            )) : (
              <p className="text-sm text-muted-foreground">—</p>
            )}
        </div>
      </ProfileSection>

      <ProfileSection title='Education'>
        <div className="space-y-4">
          {profile.education.length > 0 ? profile.education.map((edu) => (
            <EduCard key={edu.id} edu={edu} />
          )) : (
            <p className="text-sm text-muted-foreground">—</p>
          )}
        </div>
      </ProfileSection>

      <ProfileSection title='Certifications'>
        <div className="space-y-4">
          {profile.certifications.length > 0 ? profile.certifications.map((cert) => (
            <CertificateCard key={cert.id} cert={cert} />
          )) : (
            <p className="text-sm text-muted-foreground">—</p>
          )}
        </div>
      </ProfileSection>

      {(isOwner || isAdmin) && profile.resumeUrl && (
        <ProfileSection title='Resume'>
          <DocumentCard
            label="My Resume"
            hasDocument={!!profile.resumePath}
            apiUrl={`/api/profile/resume?id=${application?.userId || profile.userId}`}
            desc='You have to click on the &quot;Reveal&quot; button to access the document'
          />
        </ProfileSection>
      )}

      {isComapnyAdmin && application && (
        <div className="rounded-2xl border border-border/40 bg-card p-6 space-y-4 space-y-6">
          <h2 className="text-lg font-semibold">Application Details</h2>

          {application.coverLetter && (
            <div className='w-full overflow-hidden'>
              <h4 className="font-medium mb-1">Cover Letter</h4>
              <p className="text-sm text-muted-foreground whitespace-pre-line break-all">
                {application.coverLetter}
              </p>
            </div>
          )}

          {application.internalNotes && (
            <div>
              <h4 className="font-medium mb-1">Internal Notes</h4>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {application.internalNotes}
              </p>
            </div>
          )}

          <div>
            <h4 className="font-medium mb-2">
              Application Status
            </h4>
            <p className="text-xs text-muted-foreground mb-3">
              Update the candidate&apos;s application stage
            </p>

            <select
              value={application.status}
              disabled={statusMutation.isPending}
              onChange={(e) => {
                const selected = e.target.value as ApplicationStatus

                if (selected === 'REJECTED') {
                  setNewStatus(selected)
                  setIsRejectModalOpen(true)
                } else {
                  handleStatusChange(selected)
                }
              }}
              className={clsx('w-full md:w-80 rounded-xl border px-4 py-3 text-sm outline-none transition',
                'bg-background text-foreground border-border/60',
                'focus:border-primary/40 focus:ring-1 focus:ring-primary/30',
                'appearance-none',
              )}
            >
              {Object.values(ApplicationStatus).map((status) => (
                <option
                  key={status}
                  value={status}
                  disabled={status === ApplicationStatus.APPLIED}
                >
                  {APPLICATIONS_TABS.find((tab) => tab.value === status)?.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}


      {isAdmin && (
        <AdminMetadata profile={profile} />
      )}

      <RejectApplicantModal
        open={isComapnyAdmin && isRejectModalOpen}
        isPending={statusMutation.isPending}
        internalNotes={internalNotes}
        setIsRejectModalOpen={setIsRejectModalOpen}
        setInternalNotes={setInternalNotes}
        handleStatusChange={handleStatusChange}
        newStatus={newStatus}
      />
    </div>
  )
}

export default PublicProfile