import React from 'react'
import { FieldErrors, UseFormRegister, UseFormSetValue, UseFormWatch } from 'react-hook-form'
import StepHeader from '@/src/components/ui/StepHeader'
import { currentEmploymentStatuses, workModes, yearsOfExperiences } from '@/src/utils/constants'
import { FormSelect } from '@/src/components/ui/FormSelect'
import { FormTextarea } from '@/src/components/ui/FormTextarea'
import { FormInput } from '@/src/components/ui/FormInput'
import MultiSelect from '@/src/components/ui/MultiSelect'
import { WorkMode } from '@prisma/client'
import { JobSeekerFormInputs } from '@/src/types'

const Step2Professional = ({
  register,
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
        heading="Your Professional Details"
        description="Tell us about your work preferences and professional background so we can match you with the right opportunities."
      />

      <div className="rounded-2xl border border-border/40 bg-card p-6 space-y-6 max-sm:p-4">
        <FormInput
          label='Professional Title (Optional)'
          register={register('professionalTitle')}
          placeholder='for e.g, Frontend Developer'
          error={errors.professionalTitle}
          disabled={disabled}
        />
        <FormTextarea
          label="Bio (Optional)"
          placeholder="Write a short professional summary (max 300 characters)"
          rows={5}
          register={register('bio', {
            validate: (value) =>
              value.length <= 300 || 'Bio must be less than 300 characters',
          })}
          error={errors.bio}
          maxLength={300}
          disabled={disabled}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <MultiSelect<WorkMode>
            label="Preferred Work Modes"
            options={workModes}
            value={watch('preferredWorkMode') ?? []}
            onChange={(val) =>
              setValue('preferredWorkMode', val, {
                shouldDirty: true,
                shouldValidate: true,
              })
            }
            error={errors.preferredWorkMode?.message}
            disabled={disabled}
          />
          <FormSelect
            label="Willing to Relocate"
            options={[
              { label: 'No, I am not willing to relocate', value: 'false' },
              { label: 'Yes, I am willing to relocate', value: 'true' },
            ]}
            register={register('willingToRelocate', {
              setValueAs: (v) => v === 'true',
            })}

            error={errors.willingToRelocate}
            disabled={disabled}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormSelect
            label="Current Employment Status (Optional)"
            options={currentEmploymentStatuses}
            register={register('currentEmployment')}
            error={errors.currentEmployment}
            disabled={disabled}
          />
          <FormSelect
            label="Years of Experience (Optional)"
            options={yearsOfExperiences}
            register={register('yearsOfExperience')}
            error={errors.yearsOfExperience}
            disabled={disabled}
          />
        </div>
      </div>
    </div>
  )
}

export default Step2Professional