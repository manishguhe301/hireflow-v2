'use client'

import { useProfile } from '@/src/store/hooks/useProfile'
import DocumentCard from '@/src/components/shared/DocumentCard'
import PublicProfileSkeleton from '../../skeletons/PublicProfileSkeleton'
import ContactSection from './ContactSection'
import { Certifications, Educations, PrefferedJobCategories, PrefferedJobLocations, ProfessionalPreferences, ProfileBio, ProfileSection, Skills, WorkExperiences } from '../../elements/ProfileElements'
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
        <ProfileBio bio={profile.bio} />
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
      <Skills skills={profile.skills} />
      <ProfessionalPreferences
        currentEmployment={profile.currentEmployment}
        expectedSalaryMin={profile.expectedSalaryMin}
        noticePeriod={profile.noticePeriod}
        preferredWorkMode={profile.preferredWorkMode}
        willingToRelocate={profile.willingToRelocate}
      />
      <PrefferedJobCategories prefferedJobCategories={profile.jobCategories} />
      <PrefferedJobLocations preferredLocations={profile.preferredLocations} />
      <WorkExperiences workExperience={profile.workExperience} />
      <Educations education={profile.education} />
      <Certifications certifications={profile.certifications} />
    </div >
  )
}

export default Profile
