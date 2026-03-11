'use client'
import { FullProfile } from '@/src/store/slices/job-seeker/userProfileSlice'
import { AppSdk } from '@/src/utils/AppSdk'
import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'
import { Spinner } from '../../elements/Loader'
import { Button } from '../../ui/Button'
import { ArrowLeft, CircleUser, FileText, MessageCircle, ShieldUser } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { formatDate, formatSalary, getLabel } from '@/src/utils/helper'
import { currentEmploymentStatuses, degrees, jobCategories, jobSkills, noticePeriods, workModes, yearsOfExperiences } from '@/src/utils/constants'
import DocumentCard from '../../admin/DocumentCard'
import Link from 'next/link'
import {
  MapPin,
  Mail,
  Phone,
  Globe,
  Github,
  Linkedin,
  Briefcase,
  Link2,
  Twitter,
} from 'lucide-react'
import { Application, ApplicationStatus } from '@prisma/client'
import Modal from '../../ui/Modal'
import clsx from 'clsx'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import PublicProfileSkeleton from '../../skeletons/PublicProfileSkeleton'
import { APPLICATIONS_TABS } from '@/src/utils/constants'

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
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-8">
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="inline-flex items-center gap-2 py-2 mb-6 p-0!"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>
      <div className="rounded-3xl border border-border/40 bg-card p-6 space-y-4 shadow-sm">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between!">
          <div className="flex items-center gap-5">
            <div className="relative h-20 w-20 overflow-hidden rounded-2xl border border-border/40 bg-muted">
              {profile.avatar ? (
                <>

                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={profile.avatar}
                    alt={profile.name}
                    className={clsx(
                      "h-full w-full object-cover transition-opacity duration-300",
                    )}
                  />
                </>
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xl font-semibold text-muted-foreground">
                  {profile.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            <div>
              <h1 className="text-2xl font-bold">{profile.name}</h1>
              <p className="text-sm font-medium text-muted-foreground">
                {profile.professionalTitle || '—'}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {profile.city && `${profile.city}, `} {profile.country}
                </span>
                <span className="flex items-center gap-1">
                  <Briefcase className="h-3 w-3" />
                  {getLabel(yearsOfExperiences, profile.yearsOfExperience as string) || '—'}
                </span>
              </div>
            </div>
          </div>

          {isOwner && (
            <Button
              variant="outline"
              onClick={() => router.push('/dashboard/profile/form')}
            >
              Edit Profile
            </Button>
          )}

          <div className={clsx("flex gap-2 flex-wrap",
            session?.user.role === 'JOB_SEEKER' && 'hidden'
          )}>
            {!isOwner && !isPlatFormAdmin && (
              <Button
                variant="outline"
                className="flex items-center gap-1 border-primary text-primary"
                onClick={handleMessageClick}
                disabled={chatMutation.isPending}
              >
                {chatMutation.isPending ? (
                  <span className="flex items-center gap-1">
                    <Spinner className="w-4 h-4" />
                    Initializing Chat
                  </span>
                ) : (
                  <>
                    <MessageCircle className="h-4 w-4" />
                    Message
                  </>
                )}
              </Button>
            )}

            {isComapnyAdmin && application && (
              <Button
                variant="outline"
                className="flex items-center gap-1"
                onClick={() => router.push(`/company/applications/${slug}`)}
              >
                View Application
              </Button>
            )}
          </div>
        </div>
      </div>

      {profile.bio && (
        <div className="rounded-2xl border border-border/40 bg-card p-6 space-y-4">
          <h2 className="text-lg font-semibold mb-3">About</h2>
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">
            {profile.bio}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6  lg:grid-cols-2 ">

        <div className="rounded-2xl border border-border/40 bg-card p-6 space-y-4">
          <h2 className="text-lg font-semibold">Contact Information</h2>

          <div className="space-y-3 text-sm text-muted-foreground divide-y divide-border/40">
            <div className="flex items-center gap-2 py-2">
              <Mail className="h-4 w-4" />
              {profile.contactEmail}
            </div>

            <div className="flex items-center gap-2 py-2">
              <Phone className="h-4 w-4" />
              {profile.countryPhoneCode} {profile.phone}
            </div>

            {profile.portfolioWebsite && (
              <div className="flex items-center gap-2 py-2">
                <Globe className="h-4 w-4" />
                <Link href={profile.portfolioWebsite} target="_blank" className="underline hover:text-primary transition ease-in-out duration-300">
                  Portfolio
                </Link>
              </div>
            )}

            {profile.githubUrl && (
              <div className="flex items-center gap-2 py-2">
                <Github className="h-4 w-4" />
                <Link
                  href={profile.githubUrl}
                  target="_blank"
                  className="underline hover:text-primary transition break-all"
                >
                  GitHub
                </Link>
              </div>
            )}

            {profile.linkedinUrl && (
              <div className="flex items-center gap-2 py-2">
                <Linkedin className="h-4 w-4" />
                <Link href={profile.linkedinUrl} target="_blank" className="underline hover:text-primary transition ease-in-out duration-300 transition">
                  LinkedIn
                </Link>
              </div>
            )}

            {profile.twitterUrl && (
              <div className="flex items-center gap-2 py-2">
                <Twitter className="h-4 w-4" />
                <Link href={profile.twitterUrl} target="_blank" className="underline hover:text-primary transition ease-in-out duration-300 transition">
                  Twitter
                </Link>
              </div>
            )}

            {(profile.otherLinks && profile.otherLinks.length > 0) &&
              profile.otherLinks.map((link, index) => {
                return <div key={`${link}-${index}`} className="flex items-center gap-2 py-2">
                  <Link2 className="h-4 w-4" />
                  <Link href={link} target="_blank" className="underline hover:text-primary transition ease-in-out duration-300 transition">
                    {link}
                  </Link>
                </div>
              })
            }
          </div>
        </div>
        <div className='flex flex-col gap-6'>
          <div className="rounded-2xl border border-border/40 bg-card p-6 space-y-4">
            <h2 className="text-lg font-semibold mb-6">Preffered Job Categories</h2>

            {profile.jobCategories.length > 0 ? (
              <div className="flex flex-wrap gap-2 max-w-3xl">
                {profile.jobCategories.map((category) => (
                  <span
                    key={category}
                    className="rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-xs font-medium text-primary"
                  >
                    {getLabel(jobCategories, category)}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">—</p>
            )}
          </div>
          <div className="rounded-2xl border border-border/40 bg-card p-6 space-y-4">
            <h2 className="text-lg font-semibold mb-6">Preferred Locations</h2>

            {profile.preferredLocations.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {profile.preferredLocations.map((location) => (
                  <span
                    key={location}
                    className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                  >
                    {location}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">—</p>
            )}
          </div>
        </div>
      </div>

      {profile.skills.length > 0 && (
        <div className="rounded-2xl border border-border/40 bg-card p-6 space-y-4">
          <h2 className="text-lg font-semibold mb-4">Skills</h2>

          <div className="flex flex-wrap gap-2">
            {profile.skills.map((skill) => (
              <span
                key={skill}
                className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
              >
                {getLabel(jobSkills, skill)}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-border/40 bg-card p-6 space-y-4">
        <h2 className="text-lg font-semibold mb-6">Professional Preferences</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-muted-foreground">
          <div>
            <p className="font-medium text-foreground mb-1">Preferred Work Mode</p>
            {profile.preferredWorkMode.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {profile.preferredWorkMode.map((mode) => (
                  <span
                    key={mode}
                    className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                  >
                    {getLabel(workModes, mode)}
                  </span>
                ))}
              </div>
            ) : (
              '—'
            )}
          </div>

          <div>
            <p className="font-medium text-foreground mb-1">Willing to Relocate</p>
            {profile.willingToRelocate ? 'Yes' : 'No'}
          </div>

          <div>
            <p className="font-medium text-foreground mb-1">Current Employment</p>
            {profile.currentEmployment
              ? getLabel(currentEmploymentStatuses, profile.currentEmployment)
              : '—'}
          </div>

          <div>
            <p className="font-medium text-foreground mb-1">Notice Period</p>
            {profile.noticePeriod
              ? getLabel(noticePeriods, profile.noticePeriod)
              : '—'}
          </div>

          <div>
            <p className="font-medium text-foreground mb-1">Expected Salary</p>
            {profile.expectedSalaryMin || profile.expectedSalaryMax
              ? formatSalary(profile.expectedSalaryMin, profile.expectedSalaryMax)
              : '—'}
          </div>
        </div>
      </div>
      {profile.workExperience.length > 0 && (
        <div className="rounded-2xl border border-border/40 bg-card p-6 space-y-4">
          <h2 className="text-lg font-semibold mb-6">Work Experience</h2>

          <div className="space-y-6">
            {profile.workExperience.map((exp) => (
              <div key={exp.id} className="border-l-2 border-primary/40 pl-4">
                <h3 className="font-semibold">{exp.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {exp.company} {exp.location && `• ${exp.location}`}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {new Date(exp.startDate).getFullYear()} —{' '}
                  {exp.endDate
                    ? new Date(exp.endDate).getFullYear()
                    : 'Present'}
                </p>
                {exp.description && (
                  <p className="mt-2 text-sm text-muted-foreground">
                    {exp.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {profile.education.length > 0 && (
        <div className="rounded-2xl border border-border/40 bg-card p-6 space-y-4">
          <h2 className="text-lg font-semibold mb-6">Education</h2>

          <div className="space-y-4">
            {profile.education.map((edu) => (
              <div key={edu.id}>
                <h3 className="font-semibold">{getLabel(degrees, edu.degree)}</h3>
                <p className="text-sm text-muted-foreground">
                  {edu.institution}
                </p>
                <p className="text-xs text-muted-foreground">
                  {edu.startYear} — {edu.endYear || 'Present'}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {profile.certifications.length > 0 && (
        <div className="rounded-2xl border border-border/40 bg-card p-6 space-y-4">
          <h2 className="text-lg font-semibold mb-6">Certifications</h2>

          <div className="space-y-4">
            {profile.certifications.map((cert) => (
              <div key={cert.id}>
                <h3 className="font-semibold">{cert.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {cert.organization}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {(isOwner || isAdmin) && profile.resumeUrl && (
        <div className="rounded-2xl border border-border/40 bg-card p-6 space-y-4">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Resume
          </h2>

          <DocumentCard
            label="Resume"
            hasDocument={!!profile.resumePath}
            apiUrl={`/api/profile/resume?id=${application?.userId || profile.userId}`}
            desc='You have to click on the &quot;Reveal&quot; button to access the document'
          />
        </div>
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
                <option key={status} value={status}>
                  {APPLICATIONS_TABS.find((tab) => tab.value === status)?.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}


      {isAdmin && (
        <div className="rounded-2xl border border-border/40 bg-card p-6 space-y-4">
          <h2 className="text-lg font-semibold mb-4">Admin Metadata</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
            {session.user.role === 'PLATFORM_ADMIN' && <>
              <p><span className="font-medium text-foreground">User ID:</span> {profile.userId}</p>
              <p><span className="font-medium text-foreground">Profile Completion:</span> {profile.profileCompleted}%</p>
              <p><span className="font-medium text-foreground">Visibility:</span> {profile.isPublic ? 'Public' : 'Private'}</p>
            </>}
            <p><span className="font-medium text-foreground">Created:</span> {formatDate(profile.createdAt)}</p>
            <p><span className="font-medium text-foreground">Updated:</span> {formatDate(profile.updatedAt)}</p>
          </div>
        </div>
      )}

      <Modal
        open={isComapnyAdmin && isRejectModalOpen}
        onClose={() => {
          if (!statusMutation.isPending) {
            setIsRejectModalOpen(false)
            setInternalNotes('')
          }
        }}
      >
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Reject Application</h3>

          <textarea
            value={internalNotes}
            onChange={(e) => setInternalNotes(e.target.value)}
            placeholder="Add internal notes (optional)..."
            rows={4}
            className="w-full rounded-xl border border-border/60 bg-background px-4 py-3 text-sm outline-none focus:border-primary/40" />

          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setIsRejectModalOpen(false)}
              disabled={statusMutation.isPending}
            >
              Cancel
            </Button>

            <Button
              variant="danger"
              disabled={statusMutation.isPending}
              onClick={() =>
                handleStatusChange(newStatus as ApplicationStatus, internalNotes)
              }
            >
              {statusMutation.isPending ? <Spinner className="h-4 w-4" /> : 'Reject'}
            </Button>
          </div>
        </div>
      </Modal>

    </div>
  )
}

export default PublicProfile