'use client'
import React from 'react'
import { FieldErrors, UseFormRegister, UseFormSetValue, UseFormWatch } from 'react-hook-form'
import { JobFormInputs } from './CreateJobForm'
import { FormInput } from '@/src/components/ui/FormInput'
import RichTextEditor from '@/src/components/ui/RichTextEditor'
import { FormSelect } from '@/src/components/ui/FormSelect'
import { jobCategories } from '@/src/utils/utils'

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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            label="Title"
            register={register('title', { required: true })}
            placeholder="Software Engineer"
            error={errors.title}
          />
          <FormSelect
            label='Category'
            register={register('category', { required: 'Category is required' })}
            options={
              jobCategories
            }
            error={errors.category}
          />
        </div>
        <RichTextEditor
          label="Description"
          value={watch('description')}
          onChange={(val) => {
            setValue('description', val, {
              shouldDirty: true,
              shouldValidate: true,
            })
          }}
          error={errors.description?.message}
        />
        <RichTextEditor
          label="Responsibilities (Optional)"
          value={watch('responsibilities') || ''}
          onChange={(val) =>
            setValue('responsibilities', val, {
              shouldDirty: true,
            })
          }
          placeholder="List day-to-day responsibilities…"
          error={errors.responsibilities?.message}
        />
      </div>
    </div>
  )
}

export default Step1BasicJobDetails