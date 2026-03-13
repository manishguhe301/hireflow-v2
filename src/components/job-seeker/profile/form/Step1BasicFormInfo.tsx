'use client'
import React, { useEffect } from 'react'
import { FieldErrors, UseFormRegister, UseFormSetValue, UseFormWatch } from 'react-hook-form'
import { JobSeekerFormInputs } from './ProfileWizard'
import StepHeader from '@/src/components/ui/StepHeader'
import { useCountries } from '@/src/store/hooks/useCountries'
import { FormInput } from '@/src/components/ui/FormInput'
import { Spinner } from '@/src/components/elements/Loader'
import { FormSelect } from '@/src/components/ui/FormSelect'
import CountryCodeSelect from '@/src/components/ui/CountryCodeSelect'
import { useProfile } from '@/src/store/hooks/useProfile'
import { FileUpload } from '@/src/components/ui/FileUpload'

const Step1BasicFormInfo = ({
  register,
  errors,
  watch,
  setValue,
  selectedCountry,
  disabled
}: {
  register: UseFormRegister<JobSeekerFormInputs>
  errors: FieldErrors<JobSeekerFormInputs>
  watch: UseFormWatch<JobSeekerFormInputs>
  setValue: UseFormSetValue<JobSeekerFormInputs>
  selectedCountry: string
  disabled?: boolean
}) => {
  const { countries, loading, countryPhoneCodes } = useCountries()
  const { jobSeekerProfile } = useProfile()

  useEffect(() => {
    register('countryPhoneCode', {
      required: 'Country phone code is required',
    })
  }, [register])


  useEffect(() => {
    if (!selectedCountry || !countryPhoneCodes.length) return

    const match = countryPhoneCodes.find(
      (c) => c.country === selectedCountry
    )

    if (match) {
      setValue('countryPhoneCode', match.value, {
        shouldValidate: true,
        shouldDirty: true,
      })
    }
  }, [selectedCountry, countryPhoneCodes, setValue])

  useEffect(() => {
    const selectedCode = watch('countryPhoneCode')
    if (!selectedCode) return

    const match = countryPhoneCodes.find(
      (c) => c.value === selectedCode
    )

    if (match) {
      setValue('country', match.country, {
        shouldValidate: true,
        shouldDirty: true,
      })
    }
  }, [watch('countryPhoneCode'), countryPhoneCodes, setValue])


  return (
    <div className="space-y-8">
      <StepHeader
        heading="Your Basic Information"
        description="Provide your basic information to help us get to know you better."
      />

      <div className="rounded-2xl border border-border/40 bg-card p-6 space-y-6 max-sm:p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            label="Name"
            register={register('name', { required: 'Name is required' })}
            placeholder="for example, John Doe"
            error={errors.name}
            toolTipContent=''
            disabled={disabled}
            focused
          />
          <FormInput
            label="Contact Email"
            register={register('contactEmail', { required: 'Email is required' })}
            placeholder="for example, 0a8wF@example.com"
            error={errors.contactEmail}
            // disabled
            disabled={disabled}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            label="City (optional)"
            register={register('city')}
            placeholder="for example, Bangalore"
            error={errors.city}
            // disabled={workMode === 'REMOTE'}
            disabled={disabled}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CountryCodeSelect
            label="Country Phone Code"
            value={watch('countryPhoneCode')}
            options={countryPhoneCodes}
            onChange={(value) => setValue('countryPhoneCode', value, { shouldDirty: true, shouldValidate: true })}
            error={errors.countryPhoneCode}
            disabled={disabled}
          />
          <FormInput
            label="Contact Phone"
            placeholder="555 123 4567"
            register={register('phone', {
              required: 'Contact no is required',
              pattern: {
                value: /^[\d\s\-()]+$/,
                message: 'Enter only numbers, spaces, or hyphens',
              },
            })
            }
            type='tel'
            error={errors.phone}
            disabled={disabled}
          />
        </div>

        {watch('deleteAvatar') && (
          <div className="flex items-center gap-3 rounded-2xl border border-border/40 bg-muted/20 p-4">
            <p className="text-sm text-muted-foreground flex-1">Click on &apos;Save changes&apos; to delete your avatar</p>
            <button
              type="button"
              disabled={disabled}
              onClick={() => setValue('deleteAvatar', false, { shouldDirty: true })}
              className="text-xs text-primary border border-primary/40 rounded-lg px-3 py-1.5 hover:bg-primary/10 transition disabled:opacity-50"
            >
              Undo
            </button>
          </div>
        )}
        <FileUpload<JobSeekerFormInputs>
          label="Avatar (Optional)"
          description="PNG, JPG or SVG (max 2MB)"
          name="avatar"
          register={register}
          error={errors.avatar}
          // required
          accept="image/png,image/jpeg,image/jpg,image/svg+xml"
          maxSizeMB={2}
          existingFileUrl={watch('deleteAvatar') ? null : jobSeekerProfile?.avatar}
          isImage
          disabled={disabled}
          onDeleteExisting={
            jobSeekerProfile?.avatar
              ? () => setValue('deleteAvatar', true, { shouldDirty: true })
              : undefined
          }
        />

      </div>
    </div>
  )
}

export default Step1BasicFormInfo