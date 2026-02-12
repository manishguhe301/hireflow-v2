import React from 'react'
import { FieldErrors, UseFormRegister, UseFormSetValue, UseFormWatch } from 'react-hook-form'
import { JobSeekerFormInputs } from './ProfileWizard'
import StepHeader from '@/src/components/ui/StepHeader'
import { FileUpload } from '@/src/components/ui/FileUpload'
import { useProfile } from '@/src/store/hooks/useProfile'

const Step6Resume = ({
  register,
  errors,
  watch,
  setValue,
}: {
  register: UseFormRegister<JobSeekerFormInputs>
  errors: FieldErrors<JobSeekerFormInputs>
  watch: UseFormWatch<JobSeekerFormInputs>
  setValue: UseFormSetValue<JobSeekerFormInputs>
}) => {
  const { jobSeekerProfile } = useProfile()

  const existingResumeUrl = jobSeekerProfile?.resumeUrl ? true : false
  return (
    <div className="space-y-8">
      <StepHeader
        heading="Resume"
        description={existingResumeUrl ? 'Update your resume if needed' : 'Upload your resume,'}
      />

      <FileUpload<JobSeekerFormInputs>
        label="Resume"
        description="PDF (max 5MB)"
        name="resume"
        register={register}
        error={errors.resume}
        required
        accept="application/pdf/*"
        maxSizeMB={5}
        existingFileUrl={jobSeekerProfile?.resumeUrl}
      />
    </div>
  )
}

export default Step6Resume