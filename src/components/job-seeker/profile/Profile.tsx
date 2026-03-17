'use client'

import { useProfile } from '@/src/store/hooks/useProfile'
import { Button } from '@/src/components/ui/Button'
import DocumentCard from '@/src/components/shared/DocumentCard'
import Link from 'next/link'
import {
  MapPin,
  Briefcase,
} from 'lucide-react'
import { formatSalary, getLabel } from '@/src/utils/helper'
import clsx from 'clsx'
import PublicProfileSkeleton from '../../skeletons/PublicProfileSkeleton'
import { currentEmploymentStatuses, jobCategories, jobSkills, noticePeriods, workModes, yearsOfExperiences } from '@/src/utils/constants'
import Experience from '../../shared/Experience'
import EduCard from './EduCard'
import CertificateCard from './CertificateCard'
import ContactSection from './ContactSection'
import { Pill, ProfileSection, SubHeader } from '../../elements/ProfileElements'

const Profile = () => {
  const { jobSeekerProfile, isLoading, error } = useProfile()

  if (isLoading) {
    return (
      <PublicProfileSkeleton />
    )
  }

  if (error || !jobSeekerProfile) {
    return (
      <div className="mx-auto max-w-lg rounded-2xl border border-border/40 bg-card p-6 text-center">
        <p className="text-sm text-muted-foreground">
          Unable to load profile.
        </p>
      </div>
    )
  }

  const profile = jobSeekerProfile

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-6">
      <div className="rounded-3xl border border-border/40 bg-card p-6 shadow-sm">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

          <div className="flex items-center gap-5 max-sm:flex-col">
            <div className="relative  h-20 w-20 overflow-hidden rounded-2xl border border-border/40 bg-muted">
              {profile?.avatar ? (
                <>
                  {/*  eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={profile?.avatar}
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

            <div className='max-sm:flex max-sm:flex-col max-sm:items-center'>
              <h1 className="text-2xl font-bold">{profile.name}</h1>
              <p className="text-sm text-muted-foreground">
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

          <div className="flex gap-3 max-sm:w-full">
            <Link href="/dashboard/profile/form" className='max-sm:w-full'>
              <Button className='max-sm:w-full' variant="outline">Edit Profile</Button>
            </Link>

            <Link href={`/user-profile/${profile.userId}`} target="_blank" className='max-sm:w-full'>
              <Button className='max-sm:w-full'>View Public Profile</Button>
            </Link>
          </div>
        </div>
      </div>

      {profile.bio && (
        <ProfileSection title="About" >
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">
            {profile.bio}
          </p>
        </ProfileSection>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

        <ProfileSection title='Contact Information' className="space-y-4">
          <ContactSection />
        </ProfileSection>

        <ProfileSection title='Resume'>

          <DocumentCard
            label="My Resume"
            hasDocument={!!profile.resumePath}
            apiUrl={`/api/profile/resume`}
          />
        </ProfileSection>
      </div>

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

      <ProfileSection title='Professional Preferences'>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-muted-foreground">
          <div>
            <SubHeader text="Preferred Work Mode" />
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

          <div>
            <p className="font-medium text-foreground mb-1">Profile Visibility</p>
            {profile.isPublic ? 'Public' : 'Private'} (Not Changeable)
          </div>
        </div>
      </ProfileSection >

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
          {profile.education.map((edu) => (
            <EduCard key={edu.id} edu={edu} />
          ))}
        </div>
      </ProfileSection>

      {
        profile.certifications.length > 0 && (
          <ProfileSection title='Certifications'>
            <div className="space-y-4">
              {profile.certifications.map((cert) => (
                <CertificateCard key={cert.id} cert={cert} />
              ))}
            </div>
          </ProfileSection>
        )
      }
    </div >
  )
}

export default Profile
