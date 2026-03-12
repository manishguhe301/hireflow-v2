'use client'

import React from 'react'
import clsx from 'clsx'
import { Pencil } from 'lucide-react'
import { UseFormWatch } from 'react-hook-form'
import { JobSeekerFormInputs } from './ProfileWizard'
import StepHeader from '@/src/components/ui/StepHeader'
import { formatDate, formatSalary, getFileNameFromPath, getLabel } from '@/src/utils/helper'
import { useProfile } from '@/src/store/hooks/useProfile'
import { currentEmploymentStatuses, degrees, jobCategories, jobSkills, noticePeriods, workModes, yearsOfExperiences } from '@/src/utils/constants'

type Props = {
  watch: UseFormWatch<JobSeekerFormInputs>
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>
  disabled?: boolean
}

const Section = ({
  title,
  onEdit,
  children,
  disabled
}: {
  title: string
  onEdit: () => void
  children: React.ReactNode
  disabled?: boolean
}) => {
  return (
    <div className="rounded-2xl border border-border/40 bg-card p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold">{title}</h3>
        <button
          type="button"
          onClick={onEdit}
          disabled={disabled}
          className="flex items-center gap-1 text-sm text-primary hover:underline"
        >
          <Pencil className="h-4 w-4" />
          Edit
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
        {children}
      </div>
    </div>
  )
}

const Item = ({
  label,
  value,
  required = true,
}: {
  label: string
  value?: string
  required?: boolean
}) => (
  <div>
    <p className="text-xs text-muted-foreground">
      {label}
      {required && !value && <span className="text-red-500 ml-1">*</span>}
    </p>
    <p
      className={clsx(
        'font-medium whitespace-pre-wrap break-words',
        !value && required && 'text-red-500',
        !value && !required && 'text-muted-foreground'
      )}
    >
      {value || (required ? 'Required' : '—')}
    </p>
  </div>
)

const FileItem = ({
  label,
  file,
  existingFileUrl,
  required = true
}: {
  label: string
  file?: FileList
  existingFileUrl?: string | null
  required?: boolean
}) => {
  const newFileName = file?.[0]?.name

  const existingFileName = existingFileUrl ? getFileNameFromPath(existingFileUrl) : null

  const displayName = newFileName || existingFileName
  const hasFile = !!(newFileName || existingFileName)

  return (
    <div>
      <p className="text-xs text-muted-foreground">
        {label}
        {required && !hasFile && <span className="text-red-500 ml-1">*</span>}
      </p>
      <div className="flex items-center gap-2">
        <p className={clsx(
          'font-medium truncate',
          !hasFile && required && 'text-red-500',
          !hasFile && !required && 'text-muted-foreground'
        )}>
          {displayName || (required ? 'Required' : 'Not uploaded')}
        </p>
        {!newFileName && existingFileName && (
          <span className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-full shrink-0">
            Existing
          </span>
        )}
      </div>
    </div>
  )
}

const Step9Review = ({ watch, setCurrentStep, disabled }: Props) => {
  const data = watch()

  const { jobSeekerProfile } = useProfile()

  return (
    <div className="space-y-8">
      <StepHeader
        heading="Review & Publish"
        description="Review your profile carefully before publishing. You can edit any section."
      />
      <Section
        disabled={disabled}
        title="Profile Photo" onEdit={() => setCurrentStep(0)}>
        <FileItem
          label="Profile Photo"
          file={data.avatar}
          existingFileUrl={jobSeekerProfile?.avatar}
          required
        />
      </Section>


      <Section
        disabled={disabled}
        title="Basic Information" onEdit={() => setCurrentStep(0)}>
        <Item label="Full Name" value={data.name} />
        <Item label="Email" value={data.contactEmail} />
        <Item label="Phone Code" value={data.countryPhoneCode} />
        <Item label="Phone" value={data.phone} />
        <Item label="Country" value={data.country} />
        <Item label="City" value={data.city} required={false} />
      </Section>

      <Section
        disabled={disabled}
        title="Professional Information"
        onEdit={() => setCurrentStep(1)}>
        <Item
          label="Preferred Work Mode"
          value={data.preferredWorkMode
            ?.map((pw) => getLabel(workModes, pw))
            .join(', ')} />
        <Item
          label="Willing to Relocate"
          value={data.willingToRelocate ? 'Yes' : 'No'}
        />
        <Item
          label="Professional Title"
          value={data.professionalTitle}
          required={false}
        />
        <Item label="Bio" value={data.bio} required={false} />
        <Item label="Years of Experience" value={getLabel(yearsOfExperiences, data.yearsOfExperience as string)}
          required={false} />
        <Item label="Current Employment Status"
          value={getLabel(currentEmploymentStatuses, data.currentEmployment as string)}
          required={false} />
      </Section>

      <Section
        disabled={disabled}
        title="Work Experience" onEdit={() => setCurrentStep(2)}>
        <div className="sm:col-span-2 space-y-3">
          {data.workExperience?.length ? (
            data.workExperience.map((exp, i) => (
              <div key={i} className="border border-border/40 rounded-lg p-3">
                <p className="font-medium">{exp.title} — {exp.company}</p>
                <p className="text-xs text-muted-foreground">
                  {formatDate(exp.startDate)} -{' '}
                  {exp.isCurrent
                    ? 'Present'
                    : exp.endDate
                      ? formatDate(exp.endDate)
                      : 'N/A'}
                </p>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground text-sm">No experience added</p>
          )}
        </div>
      </Section>

      <Section
        disabled={disabled}
        title="Education" onEdit={() => setCurrentStep(3)}>
        <div className="sm:col-span-2 space-y-3">
          {data.education?.length ? (
            data.education.map((edu, i) => (
              <div key={i} className="border border-border/40 rounded-lg p-3">
                <p className="font-medium">{getLabel(degrees, edu.degree)}</p>
                <p className="text-xs text-muted-foreground">
                  {edu.institution} ({edu.startYear} -{' '}
                  {edu.isCurrent ? 'Present' : edu.endYear || 'N/A'})
                </p>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground text-sm">No education added</p>
          )}
        </div>
      </Section>

      <Section
        disabled={disabled}
        title="Skills" onEdit={() => setCurrentStep(4)}>
        <Item
          label="Skills"
          value={data.skills
            ?.map((s) => getLabel(jobSkills, s))
            .join(', ')} />
      </Section>

      <Section
        disabled={disabled}
        title="Resume" onEdit={() => setCurrentStep(5)}>
        <FileItem
          label="Resume"
          file={data.resume}
          existingFileUrl={jobSeekerProfile?.resumeUrl}
          required
        />

      </Section>

      <Section
        disabled={disabled}
        title="Certifications" onEdit={() => setCurrentStep(6)}>
        <div className="sm:col-span-2 space-y-3">
          {data.certifications?.length ? (
            data.certifications.map((cert, i) => (
              <div key={i} className="border border-border/40 rounded-lg p-3">
                <p className="font-medium">{cert.name}</p>
                <p className="text-xs text-muted-foreground">
                  {cert.organization}
                </p>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground text-sm">
              No certifications added
            </p>
          )}
        </div>
      </Section>

      <Section
        disabled={disabled}
        title="Additional Information" onEdit={() => setCurrentStep(7)}>
        <Item
          label="Job Categories"
          value={data.jobCategories
            ?.map((jc) => getLabel(jobCategories, jc))
            .join(', ')}
        />
        <Item
          label="Preferred Locations"
          value={data.preferredLocations?.join(', ')}
        />
        <Item
          label="Salary Expectations"
          value={
            formatSalary(data.expectedSalaryMin,
              // data.expectedSalaryMax
            )
          }
          required={false}
        />
        <Item
          label="Notice Period"
          value={getLabel(noticePeriods, data.noticePeriod)}
          required={false}
        />


        <Item
          label="Portfolio Website"
          value={data.portfolioWebsite}
          required={false}
        />
        <Item
          label="Github URL"
          value={data.githubUrl}
          required={false}
        />
        <Item
          label="Linkedin URL"
          value={data.linkedinUrl}
          required={false}
        />
        <Item
          label="Twitter URL"
          value={data.twitterUrl}
          required={false}
        />
        <Item
          label="Other Links"
          value={data.otherLinks.join(', ')}
          required={false}
        />

      </Section>
    </div>
  )
}

export default Step9Review
