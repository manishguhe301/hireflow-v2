'use client'
import React from 'react'
import { FieldErrors, UseFormRegister, UseFormWatch } from 'react-hook-form'
import { JobFormInputs } from './CreateJobForm'
import { FormSelect } from '@/src/components/ui/FormSelect'
import { workModes } from '@/src/utils/constants'
import { useCountries } from '@/src/store/hooks/useCountries'
import { Spinner } from '@/src/components/elements/Loader'
import { FormInput } from '@/src/components/ui/FormInput'
import StepHeader from '@/src/components/ui/StepHeader'

const Step3JobLocation = ({
  register,
  errors,
  watch,
  isEditMode,
  disabled
}: {
  register: UseFormRegister<JobFormInputs>
  errors: FieldErrors<JobFormInputs>
  watch: UseFormWatch<JobFormInputs>
  isEditMode?: boolean
  disabled?: boolean
}) => {
  const { countries, loading } = useCountries()
  const workMode = watch('workMode')
  return (
    <div className="space-y-8">
      <StepHeader
        heading='Location & Work Mode'
        description='Specify where the job is based and how candidates are expected to work.'
      />

      <div className="rounded-2xl border border-border/40 bg-card p-6 space-y-6 max-sm:p-4">
        <FormSelect
          label={isEditMode ? 'Work Mode' : 'Work Mode (by default Remote)'}
          register={register('workMode', { required: 'Work mode is required' })}
          options={
            workModes
          }
          error={errors.workMode}
          disabled={disabled}
        />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {loading ? (
            <div className="flex flex-col gap-2">
              <label className="text-sm text-muted-foreground">
                Location (Country)
              </label>
              <div className="flex h-[46px] items-center justify-center rounded-xl border border-border/60 bg-muted">
                <Spinner className="h-4 w-4" />
              </div>
            </div>
          ) : (
            <FormSelect
              label="Location (Country)"
              placeholder="Select a country"
              options={countries}
              register={register('country', {
                required: 'Job location is required',
              })}
              error={errors.country}
              disabled={disabled}
            />
          )}

          <FormInput
            label="City (Optional)"
            register={register('city', {
              required: false
            })}
            placeholder="for example, Bangalore"
            error={errors.city}
          />
        </div>
      </div>
    </div>
  )
}

export default Step3JobLocation