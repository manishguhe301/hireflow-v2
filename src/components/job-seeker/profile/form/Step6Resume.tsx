import React from 'react'
import { FieldErrors, UseFormRegister, UseFormSetValue, UseFormWatch } from 'react-hook-form'
import { JobSeekerFormInputs } from './ProfileWizard'
import StepHeader from '@/src/components/ui/StepHeader'
import { FileUpload } from '@/src/components/ui/FileUpload'
import { useProfile } from '@/src/store/hooks/useProfile'

const Step6Resume = ({
  register,
  errors,
  disabled
}: {
  register: UseFormRegister<JobSeekerFormInputs>
  errors: FieldErrors<JobSeekerFormInputs>
  watch: UseFormWatch<JobSeekerFormInputs>
  setValue: UseFormSetValue<JobSeekerFormInputs>
  disabled?: boolean
}) => {
  const { jobSeekerProfile } = useProfile()

  const existingResumeUrl = jobSeekerProfile?.resumeUrl ? true : false
  return (
    <div className="space-y-8">
      <StepHeader
        heading="Resume"
        description={existingResumeUrl ? 'Update your resume if needed' : 'Upload your resume,'}
      />
      {!existingResumeUrl && (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 text-sm text-amber-600">
          <p className="font-medium">Important</p>
          <p className="mt-1">
            If you navigate to another step and return here, your selected file may
            appear cleared due to browser security behavior. Please re-check your
            resume before publishing your profile.
          </p>
        </div>
      )}

      <FileUpload<JobSeekerFormInputs>
        disabled={disabled}
        label="Resume"
        description="PDF (max 5MB)"
        name="resume"
        register={register}
        error={errors.resume}
        required
        accept=".pdf,application/pdf"
        maxSizeMB={5}
        existingFileUrl={jobSeekerProfile?.resumeUrl}
      />
    </div>
  )
}

export default Step6Resume