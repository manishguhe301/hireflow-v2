'use client'

import { useProfile } from '@/src/store/hooks/useProfile'
import DocumentCard from '@/src/components/shared/DocumentCard'
import { formatSalary, getLabel } from '@/src/utils/helper'
import PublicProfileSkeleton from '../../skeletons/PublicProfileSkeleton'
import { currentEmploymentStatuses, jobCategories, jobSkills, noticePeriods, workModes } from '@/src/utils/constants'
import Experience from '../../shared/Experience'
import EduCard from './EduCard'
import CertificateCard from './CertificateCard'
import ContactSection from './ContactSection'
import { Pill, ProfileSection, SubHeader } from '../../elements/ProfileElements'
import ProfileTopSection from '../../shared/ProfileTopSection'

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
      <ProfileTopSection profile={profile} />

      {profile.bio && (
        <ProfileSection title="About" >
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">
            {profile.bio}
          </p>
        </ProfileSection>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

        <ProfileSection title='Contact Information' className="space-y-4">
          <ContactSection profile={profile} />
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
    </div >
  )
}

export default Profile
