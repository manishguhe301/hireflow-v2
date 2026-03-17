import { currentEmploymentStatuses, jobCategories, jobSkills, noticePeriods, workModes } from "@/src/utils/constants"
import { formatSalary, getLabel } from "@/src/utils/helper"
import { Certification, CurrentEmployment, Education, WorkExperience, WorkMode } from "@prisma/client"
import clsx from "clsx"
import Experience from "../shared/Experience"
import EduCard from "../job-seeker/profile/EduCard"
import CertificateCard from "../job-seeker/profile/CertificateCard"

const ProfileSection = ({ title, children, className }: { title: string, children: React.ReactNode, className?: string }) => (
  <div className={clsx("rounded-2xl border border-border/40 bg-card p-6", className!)}>
    <h2 className="text-lg font-semibold mb-6">{title}</h2>
    {children}
  </div>
)

const Pill = ({ text }: { text: string }) => {
  return <span
    className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
  >
    {text}
  </span>
}

const SubHeader = ({ text }: { text: string }) => <p className="font-medium text-foreground mb-1">{text}</p>

const ProfileBio = ({ bio }: {
  bio: string
}) =>
  <ProfileSection title="About" >
    <p className="mt-3 text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">
      {bio}
    </p>
  </ProfileSection>

const PrefferedJobCategories = ({ prefferedJobCategories }: {
  prefferedJobCategories: string[]
}) => {
  return (
    <ProfileSection title='Preferred Job Categories'>
      {prefferedJobCategories.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {prefferedJobCategories.map((category) => (
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
  )
}

const PrefferedJobLocations = ({ preferredLocations }: {
  preferredLocations: string[]
}) => {
  return (
    <ProfileSection title='Preferred Locations'>
      {preferredLocations.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {preferredLocations.map((location) => (
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
  )
}

const Skills = ({
  skills
}: { skills: string[] }) => {
  return (
    skills.length > 0 ? (
      <ProfileSection title='Skills'>
        <div className="mt-4 flex flex-wrap gap-2">
          {skills.map((skill) => (
            <Pill
              text={getLabel(jobSkills, skill) as string}
              key={skill}
            />
          ))}
        </div>
      </ProfileSection>
    ) : (
      <p className="text-sm text-muted-foreground">—</p>
    )
  )
}

const ProfessionalPreferences = ({
  preferredWorkMode,
  willingToRelocate,
  currentEmployment,
  noticePeriod,
  expectedSalaryMin,
  isPublic
}: {
  preferredWorkMode: WorkMode[]
  willingToRelocate: boolean
  currentEmployment: CurrentEmployment | null
  noticePeriod: string | null
  expectedSalaryMin: number | null
  isPublic?: boolean
}) => {
  return (
    <ProfileSection title='Professional Preferences'>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-muted-foreground">
        <div>
          <p className="font-medium text-foreground mb-1">Preferred Work Mode</p>
          {preferredWorkMode.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {preferredWorkMode.map((mode) => (
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
          {willingToRelocate ? 'Yes' : 'No'}
        </div>

        <div>
          <SubHeader text="Current Employment" />
          {currentEmployment
            ? getLabel(currentEmploymentStatuses, currentEmployment)
            : '—'}
        </div>

        <div>
          <SubHeader text="Notice Period" />
          {noticePeriod
            ? getLabel(noticePeriods, noticePeriod)
            : '—'}
        </div>

        <div>
          <SubHeader text="Expected CTC" />
          {expectedSalaryMin
            // || expectedSalaryMax
            ? formatSalary(expectedSalaryMin,
              // expectedSalaryMax
            )
            : '—'}
        </div>

        {!isPublic && <div>
          <SubHeader text="Profile Visibility" />
          &apos;Public&apos; (Not Changeable)
        </div>
        }
      </div>
    </ProfileSection>
  )
}

const WorkExperiences = ({ workExperience }: {
  workExperience: WorkExperience[]
}
) => {
  return (
    <ProfileSection title='Work Experience'>
      <div className="space-y-6">
        {workExperience.length > 0 ?
          workExperience.map((exp) => (
            <Experience key={exp.id} exp={exp} />
          )) : (
            <p className="text-sm text-muted-foreground">—</p>
          )}
      </div>
    </ProfileSection>
  )
}

const Educations = ({
  education
}: { education: Education[] }) => {
  return <ProfileSection title='Education'>
    <div className="space-y-4">
      {education.length > 0 ? education.map((edu) => (
        <EduCard key={edu.id} edu={edu} />
      )) : (
        <p className="text-sm text-muted-foreground">—</p>
      )}
    </div>
  </ProfileSection>
}


const Certifications = ({
  certifications
}: {
  certifications: Certification[]
}) => {
  return <ProfileSection title='Certifications'>
    <div className="space-y-4">
      {certifications.length > 0 ? certifications.map((cert) => (
        <CertificateCard key={cert.id} cert={cert} />
      )) : (
        <p className="text-sm text-muted-foreground">—</p>
      )}
    </div>
  </ProfileSection>
}


export {
  ProfileSection,
  Pill,
  SubHeader,
  ProfileBio,
  PrefferedJobCategories,
  PrefferedJobLocations,
  Skills,
  ProfessionalPreferences,
  WorkExperiences,
  Educations,
  Certifications
}
