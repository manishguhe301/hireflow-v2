import React from 'react'
import { FieldErrors, UseFormRegister, UseFormSetValue, UseFormWatch } from 'react-hook-form'
import StepHeader from '@/src/components/ui/StepHeader'
import MultiSelect from '@/src/components/ui/MultiSelect'
import { jobSkills } from '@/src/utils/constants'
import { JobSeekerFormInputs } from '@/src/types'

const Step5Skills = ({
  errors,
  watch,
  setValue,
  disabled
}: {
  register: UseFormRegister<JobSeekerFormInputs>
  errors: FieldErrors<JobSeekerFormInputs>
  watch: UseFormWatch<JobSeekerFormInputs>
  setValue: UseFormSetValue<JobSeekerFormInputs>
  disabled?: boolean
}) => {
  return (
    <div className="space-y-8">
      <StepHeader
        heading='AddSkills'
        description='List the skills, tools, and technologies you are proficient in. This can include programming languages, frameworks, databases, and tools.'
      />

      <MultiSelect
        disabled={disabled}
        label="Skills"
        options={jobSkills}
        value={watch('skills')}
        onChange={(val) =>
          setValue('skills', val, {
            shouldDirty: true,
            shouldValidate: true,
          })
        }
        placeholder="Search skills..."
        error={errors.skills?.message}
      />
    </div>
  )
}

export default Step5Skills