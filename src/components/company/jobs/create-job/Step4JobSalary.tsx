'use client'
import React from 'react'
import { FieldErrors, UseFormRegister } from 'react-hook-form'
import { JobFormInputs } from './CreateJobForm'
import { FormInput } from '@/src/components/ui/FormInput'
import { FormSelect } from '@/src/components/ui/FormSelect'
import { currencyOptions } from '@/src/utils/utils'
import { Button } from '@/src/components/ui/Button'

const Step4JobSalary = ({
  register,
  errors,
}: {
  register: UseFormRegister<JobFormInputs>
  errors: FieldErrors<JobFormInputs>
}) => {
  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold tracking-tight">
          Salary & Openings
        </h2>
        <p className="text-sm text-muted-foreground">
          Define compensation details and control salary visibility for candidates.
        </p>
      </div>

      <div className="rounded-2xl border border-border/40 bg-card p-6 space-y-6 max-sm:p-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormInput
            label="Minimum Salary (Optional)"
            register={register('salaryMin')}
            placeholder="for example: 10000"
            error={errors.salaryMin}
            type='number'
          />
          <FormInput
            label="Maximum Salary (Optional)"
            register={register('salaryMax')}
            placeholder="for example: 20000 should be greater than minimum salary"
            error={errors.salaryMax}
            type='number'
          />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormSelect
            label='Currency (Optional)'
            register={register('currency')}
            options={
              currencyOptions
            }
            error={errors.currency}
          />

          <div className="flex flex-col">
            <label className="text-sm text-muted-foreground">Hide Salary (By default No)</label>
            <div className="w-full flex items-center justify-between gap-4">
              <Button className='w-full bg-transparent'>No</Button>
              <Button className='w-full'>Yes</Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormInput
            label="Number of Openings"
            register={register('numberOfOpenings', { required: "Number of openings is required" })}
            placeholder="for example: 10"
            error={errors.numberOfOpenings}
            type='number'
          />
          {/* //date */}
        </div>
      </div>
    </div>
  )
}

export default Step4JobSalary