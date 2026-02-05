'use client'
import React from 'react'
import { FieldErrors, UseFormRegister, UseFormSetValue, UseFormWatch } from 'react-hook-form'
import { JobFormInputs } from './CreateJobForm'
import { FormInput } from '@/src/components/ui/FormInput'

const Step1BasicJobDetails = ({
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
      <div className="space-y-1">
        <h2 className="text-xl font-semibold tracking-tight">
          Job Overview
        </h2>
        <p className="text-sm text-muted-foreground">
          Create a clear and compelling overview of the role to attract the right candidates.
        </p>
      </div>

      <div className="rounded-2xl border border-border/40 bg-card p-6 space-y-6 max-sm:p-4">
        <FormInput
          label="Title"
          register={register('title', { required: true })}
          placeholder="Software Engineer"
          error={errors.title}
        />


      </div>
    </div>
  )
}

export default Step1BasicJobDetails