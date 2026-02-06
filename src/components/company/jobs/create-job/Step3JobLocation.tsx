'use client'
import React from 'react'
import { FieldErrors, UseFormRegister } from 'react-hook-form'
import { JobFormInputs } from './CreateJobForm'
import { FormSelect } from '@/src/components/ui/FormSelect'
import { workModes } from '@/src/utils/utils'
import { useCountries } from '@/src/store/hooks/useCountries'
import { Spinner } from '@/src/components/elements/Loader'
import { FormInput } from '@/src/components/ui/FormInput'

const Step3JobLocation = ({
  register,
  errors,
}: {
  register: UseFormRegister<JobFormInputs>
  errors: FieldErrors<JobFormInputs>
}) => {
  const { countries, loading } = useCountries()
  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold tracking-tight">
          Location & Work Mode
        </h2>
        <p className="text-sm text-muted-foreground">
          Specify where the job is based and how candidates are expected to work.
        </p>
      </div>

      <div className="rounded-2xl border border-border/40 bg-card p-6 space-y-6 max-sm:p-4">
        <FormSelect
          label='Work Mode (by default Remote)'
          register={register('workMode', { required: 'Work mode is required' })}
          options={
            workModes
          }
          error={errors.workMode}
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
            />
          )}

          <FormInput
            label="City"
            register={register('city')}
            placeholder="for example, Bangalore"
            error={errors.city}
          />
        </div>
      </div>
    </div>
  )
}

export default Step3JobLocation