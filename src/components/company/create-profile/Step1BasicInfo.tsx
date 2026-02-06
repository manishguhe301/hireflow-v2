'use client'
import React from 'react'
import { FieldErrors, UseFormRegister } from 'react-hook-form'
import { ProfileFormInputs } from './ProfileSetup'
import { FormTextarea } from '../../ui/FormTextarea'
import { FormInput } from '../../ui/FormInput'
import { FormSelect } from '../../ui/FormSelect'
import { companyIndustries, companySizes } from '@/src/utils/utils'

const Step1BasicInfo = ({
  register,
  errors,
}: {
  register: UseFormRegister<ProfileFormInputs>
  errors: FieldErrors<ProfileFormInputs>
}) => {
  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold tracking-tight">
          Company Basics
        </h2>
        <p className="text-sm text-muted-foreground">
          Tell us a bit about your company. This information will be visible to candidates.
        </p>
      </div>

      <div className="rounded-2xl border border-border/40 bg-card p-6 space-y-6 max-sm:p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            label="Company Name"
            register={register('name', { required: true })}
            placeholder="Acme Corp"
            error={errors.name}
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
            type="number"
            error={errors.foundedYear}
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
          />
        </div>
      </div>
    </div>
  )
}

export default Step1BasicInfo
