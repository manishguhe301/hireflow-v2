'use client'
import React from 'react'
import { FieldErrors, UseFormRegister, UseFormSetValue, UseFormWatch } from 'react-hook-form'
import { JobFormInputs } from './CreateJobForm'
import { FormSelect } from '@/src/components/ui/FormSelect'
import { employmentTypes, experienceLevels, jobSkills } from '@/src/utils/utils'
import RichTextEditor from '@/src/components/ui/RichTextEditor'
import MultiSelect from '@/src/components/ui/MultiSelect'
import StepHeader from '@/src/components/ui/StepHeader'

const Step2JobRequirements = ({
  register,
  errors,
  watch,
  setValue,
}: {
  register: UseFormRegister<JobFormInputs>
  errors: FieldErrors<JobFormInputs>
  watch: UseFormWatch<JobFormInputs>
  setValue: UseFormSetValue<JobFormInputs>
}) => {
  return (
    <div className="space-y-8">
      <StepHeader
        heading='Requirements & Skills'
        description='List the skills, experience, and qualifications candidates should have to succeed in this role.'
      />
      <div className="rounded-2xl border border-border/40 bg-card p-6 space-y-6 max-sm:p-4">
        <RichTextEditor
          label="Requirements"
          value={watch('requirements')}
          onChange={(val) => {
            setValue('requirements', val, {
              shouldDirty: true,
              shouldValidate: true,
            })
          }}
          error={errors.requirements?.message}
        />
        <MultiSelect
          label="Required Skills"
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormSelect
            label='Experience Level (by default entry level)'
            register={register('experienceLevel', { required: 'Experience Level is required' })}
            options={
              experienceLevels
            }
            error={errors.experienceLevel}
          />
          <FormSelect
            label='Employment Type (by default full-time)'
            register={register('employmentType', { required: 'Employment Type is required' })}
            options={
              employmentTypes
            }
            error={errors.employmentType}
          />
        </div>
      </div>
    </div>
  )
}

export default Step2JobRequirements