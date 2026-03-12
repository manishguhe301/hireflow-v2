'use client'

import { useProfile } from '@/src/store/hooks/useProfile'
import { Button } from '@/src/components/ui/Button'
import DocumentCard from '@/src/components/admin/DocumentCard'
import Link from 'next/link'
import {
  MapPin,
  Mail,
  Phone,
  Globe,
  Github,
  Linkedin,
  Briefcase,
  Award,
  Link2,
  Twitter,
  ExternalLink,
} from 'lucide-react'
import { formatDateRange, formatSalary, getLabel } from '@/src/utils/helper'
import clsx from 'clsx'
import PublicProfileSkeleton from '../../skeletons/PublicProfileSkeleton'
import { currentEmploymentStatuses, degrees, jobCategories, jobSkills, noticePeriods, workModes, yearsOfExperiences } from '@/src/utils/constants'

const ProfileSection = ({ title, children, className }: { title: string, children: React.ReactNode, className?: string }) => (
  <div className={clsx("rounded-2xl border border-border/40 bg-card p-6", className!)}>
    <h2 className="text-lg font-semibold mb-6">{title}</h2>
    {children}
  </div>
)

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
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-6">

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

          <div className="space-y-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              {profile.contactEmail}
            </div>

            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              {profile.countryPhoneCode} {profile.phone}
            </div>

            {profile.portfolioWebsite && (
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                <Link href={profile.portfolioWebsite} target="_blank" className="underline hover:text-primary transition ease-in-out duration-300">
                  Portfolio
                </Link>
              </div>
            )}

            {profile.githubUrl && (
              <div className="flex items-center gap-2">
                <Github className="h-4 w-4" />
                <Link href={profile.githubUrl} target="_blank" className="underline hover:text-primary transition ease-in-out duration-300 ">
                  GitHub
                </Link>
              </div>
            )}

            {profile.linkedinUrl && (
              <div className="flex items-center gap-2">
                <Linkedin className="h-4 w-4" />
                <Link href={profile.linkedinUrl} target="_blank" className="underline hover:text-primary transition ease-in-out duration-300 transition">
                  LinkedIn
                </Link>
              </div>
            )}

            {profile.twitterUrl && (
              <div className="flex items-center gap-2">
                <Twitter className="h-4 w-4" />
                <Link href={profile.twitterUrl} target="_blank" className="underline hover:text-primary transition ease-in-out duration-300 transition">
                  Twitter
                </Link>
              </div>
            )}

            {(profile.otherLinks && profile.otherLinks.length > 0) &&
              profile.otherLinks.map((link, index) => {
                return <div key={`${link}-${index}`} className="flex items-center gap-2">
                  <Link2 className="h-4 w-4" />
                  <Link href={link} target="_blank" className="underline hover:text-primary transition ease-in-out duration-300 transition">
                    {link}
                  </Link>
                </div>
              })
            }
          </div>
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
            <span
              key={skill}
              className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
            >
              {getLabel(jobSkills, skill)}
            </span>
          ))}
        </div>
      </ProfileSection>

      <ProfileSection title='Professional Preferences'>

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
            {profile.expectedSalaryMin
              // || profile.expectedSalaryMax
              ? formatSalary(profile.expectedSalaryMin,
                // profile.expectedSalaryMax
              )
              : '—'}
          </div>

          <div>
            <p className="font-medium text-foreground mb-1">Profile Visibility</p>
            {profile.isPublic ? 'Public' : 'Private'} (You can&apos;t change this)
          </div>
        </div>
      </ProfileSection>

      <ProfileSection title='Preferred Job Categories'>
        {profile.jobCategories.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {profile.jobCategories.map((category) => (
              <span
                key={category}
                className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
              >
                {getLabel(jobCategories, category)}
              </span>
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
      </ProfileSection>


      <ProfileSection title='Work Experience'>
        <div className="space-y-6">
          {profile.workExperience.length > 0 ?
            profile.workExperience.map((exp) => (
              <div key={exp.id} className="border-l-2 border-primary/40 pl-4">
                <h3 className="font-semibold">{exp.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {exp.company} {exp.location && `• ${exp.location}`}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatDateRange(exp.startDate, exp.endDate, exp.isCurrent)}
                </p>
                {exp.description && (
                  <p className="mt-2 text-sm text-muted-foreground">
                    {exp.description}
                  </p>
                )}
              </div>
            )) : (
              <p className="text-sm text-muted-foreground">—</p>
            )}
        </div>
      </ProfileSection>

      <ProfileSection title='Education'>
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
      </ProfileSection>

      {profile.certifications.length > 0 && (
        <ProfileSection title='Certifications'>

          <div className="space-y-4">
            {profile.certifications.map((cert) => (
              <div key={cert.id} className="flex items-start gap-3">
                <Award className="h-5 w-5 text-primary" />
                <div>
                  <h3 className="font-semibold">{cert.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {cert.organization}
                  </p>
                  {cert?.credentialUrl && (
                    <Link href={cert.credentialUrl}
                      target='_blank' className='text-sm text-muted-foreground hover:underline flex items-center gap-1 transition ease-in-out duration-300 hover:text-primary'>
                      Link <ExternalLink className='h-3 w-3' />
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ProfileSection>
      )}
    </div>
  )
}

export default Profile
