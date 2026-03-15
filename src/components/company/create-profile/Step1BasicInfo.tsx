'use client'
import React from 'react'
import { FieldErrors, UseFormRegister } from 'react-hook-form'
import { FormTextarea } from '../../ui/FormTextarea'
import { FormInput } from '../../ui/FormInput'
import { FormSelect } from '../../ui/FormSelect'
import { companyIndustries, companySizes } from '@/src/utils/constants'
import StepHeader from '../../ui/StepHeader'
import { ProfileFormInputs } from '@/src/types'

const currentYear = new Date().getFullYear()

const Step1BasicInfo = ({
  register,
  errors,
  isLoading
}: {
  register: UseFormRegister<ProfileFormInputs>
  errors: FieldErrors<ProfileFormInputs>
  isLoading: boolean
}) => {
  return (
    <div className="space-y-8">
      <StepHeader
        heading='Company Basics'
        description='Tell us a bit about your company. This information will be visible to candidates.'
      />

      <div className="rounded-2xl border border-border/40 bg-card p-6 space-y-6 max-sm:p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            label="Company Name"
            register={register('name', { required: true })}
            placeholder="Acme Corp"
            error={errors.name}
            disabled={isLoading}
            focused
          />

          <FormInput
            label="Founded Year"
            register={register('foundedYear', {
              required: true,
              validate: (value) => {
                const year = parseInt(value)
                const currentYear = new Date().getFullYear()
                return (year >= 1800 && year <= currentYear) || 'Enter a valid year'
              }
            })}
            placeholder="2010"
            disabled={isLoading}
            type="number"
            error={errors.foundedYear}
            minLength={2000}
            maxLength={currentYear}
          />
        </div>

        <FormTextarea
          label="Company Description"
          placeholder="Describe what your company does, its mission, and culture..."
          rows={5}
          register={register('description', {
            required: 'Description is required',
            // maxLength: {
            //   value: 500,
            //   message: 'Description cannot exceed 500 characters',
            // },
          })}
          disabled={isLoading}
          error={errors.description}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormSelect
            label="Company Industry"
            placeholder="Select industry"
            options={companyIndustries}
            register={register('industry', {
              required: 'Company industry is required',
            })}
            disabled={isLoading}
            error={errors.industry}
          />

          <FormSelect
            label="Company Size"
            placeholder="Select size"
            options={companySizes}
            register={register('companySize', {
              required: 'Company size is required',
            })}
            error={errors.companySize}
            disabled={isLoading}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            label="Website"
            placeholder="https://example.com"
            type="url"
            register={register('website', {
              required: 'Website is required',
              validate: (value) => {
                const pattern =
                  /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)(\/[\w-./?%&=]*)?$/
                return pattern.test(value) || 'Enter a valid URL'
              },
            })}
            error={errors.website}
            disabled={isLoading}
          />

          <FormInput
            label="LinkedIn Profile (Optional)"
            placeholder="https://linkedin.com/company/your-company"
            type="url"
            register={register('linkedinProfile', {
              // required: 'LinkedIn profile is required',
              validate: (value) => {
                const pattern =
                  /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)(\/[\w-./?%&=]*)?$/
                return pattern.test(value) || 'Enter a valid URL'
              },
            })}
            error={errors.linkedinProfile}
            disabled={isLoading}
          />
        </div>
      </div>
    </div>
  )
}

export default Step1BasicInfo
