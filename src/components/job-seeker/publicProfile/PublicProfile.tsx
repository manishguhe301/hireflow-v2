'use client'
import { FullProfile } from '@/src/store/slices/job-seeker/userProfileSlice'
import { AppSdk } from '@/src/utils/AppSdk'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Spinner } from '../../elements/Loader'
import { Button } from '../../ui/Button'
import { Ban, CircleUser, ShieldUser } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { getLabel } from '@/src/utils/helper'
import { degrees, jobSkills } from '@/src/utils/utils'
import DocumentCard from '../../admin/DocumentCard'

const PublicProfile = () => {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [profile, setProfile] = useState<FullProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const { data: session } = useSession()



  const fetchProfile = async () => {
    try {
      const res = await AppSdk.getData(`/api/profile/${id}`, null)
      setProfile(res.profile)
    } catch (error) {
      toast.error('Failed to load company')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [id])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <Spinner className="h-8 w-8" />
      </div>
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

      <div className="rounded-3xl border border-border/40 bg-card p-6 shadow-sm">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-5">
            <div className="h-20 w-20 overflow-hidden rounded-2xl border border-border/40 bg-muted">
              {profile.avatar ? (
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xl font-semibold text-muted-foreground">
                  {profile.name.charAt(0)}
                </div>
              )}
            </div>

            <div>
              <h1 className="text-2xl font-bold">{profile.name}</h1>
              <p className="text-sm text-muted-foreground">
                {profile.professionalTitle || '—'}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {profile.city}, {profile.country}
              </p>
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
        </div>
      </div>

      {profile.bio && (
        <div className="rounded-2xl border border-border/40 bg-card p-6">
          <h2 className="text-lg font-semibold mb-3">About</h2>
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">
            {profile.bio}
          </p>
        </div>
      )}

      {profile.skills.length > 0 && (
        <div className="rounded-2xl border border-border/40 bg-card p-6">
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

      {profile.workExperience.length > 0 && (
        <div className="rounded-2xl border border-border/40 bg-card p-6">
          <h2 className="text-lg font-semibold mb-6">Work Experience</h2>

          <div className="space-y-6">
            {profile.workExperience.map((exp) => (
              <div key={exp.id} className="border-l-2 border-primary/40 pl-4">
                <h3 className="font-semibold">{exp.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {exp.company} • {exp.location}
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
        <div className="rounded-2xl border border-border/40 bg-card p-6">
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
        <div className="rounded-2xl border border-border/40 bg-card p-6">
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
        <div className="rounded-2xl border border-border/40 bg-card p-6">
          <h2 className="text-lg font-semibold mb-4">Resume</h2>

          <DocumentCard
            label="Resume"
            hasDocument={!!profile.resumePath}
            apiUrl={`/api/profile/resume`}
            desc='You have to click on the &quot;Reveal&quot; button to access the document'
          />
        </div>
      )}

      {isAdmin && (
        <div className="rounded-2xl border border-border/40 bg-card p-6">
          <h2 className="text-lg font-semibold mb-4">Admin Metadata</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
            <p><span className="font-medium text-foreground">User ID:</span> {profile.userId}</p>
            <p><span className="font-medium text-foreground">Profile Completion:</span> {profile.profileCompleted}%</p>
            <p><span className="font-medium text-foreground">Visibility:</span> {profile.isPublic ? 'Public' : 'Private'}</p>
            <p><span className="font-medium text-foreground">Created:</span> {new Date(profile.createdAt).toLocaleDateString()}</p>
            <p><span className="font-medium text-foreground">Updated:</span> {new Date(profile.updatedAt).toLocaleDateString()}</p>
          </div>
        </div>
      )}

    </div>
  )
}

export default PublicProfile