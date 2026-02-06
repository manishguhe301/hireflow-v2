'use client'

import React, { useEffect } from 'react'
import { FieldErrors, UseFormRegister, UseFormSetValue, UseFormWatch } from 'react-hook-form'
import { ProfileFormInputs } from './ProfileSetup'
import { FormInput } from '../../ui/FormInput'
import { FormSelect } from '../../ui/FormSelect'
import { FormTextarea } from '../../ui/FormTextarea'
import { useSession } from 'next-auth/react'
import { Spinner } from '../../elements/Loader'
import CountryCodeSelect from '../../ui/CountryCodeSelect'
import { useCountries } from '@/src/store/hooks/useCountries'

const Step2Contact = ({
  register,
  errors,
  setValue,
  watch,
  selectedCountry
}: {
  register: UseFormRegister<ProfileFormInputs>
  errors: FieldErrors<ProfileFormInputs>
  setValue: UseFormSetValue<ProfileFormInputs>
  watch: UseFormWatch<ProfileFormInputs>
  selectedCountry: string
}) => {
  const { data: session } = useSession()
  const { countries, loading, countryPhoneCodes } = useCountries()

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
      <div className="space-y-1">
        <h2 className="text-xl font-semibold tracking-tight">
          Contact Information
        </h2>
        <p className="text-sm text-muted-foreground">
          How candidates and our team can reach your company.
        </p>
      </div>

      <div className="rounded-2xl border border-border/40 bg-card p-6 space-y-6 max-sm:p-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormInput
            label="Contact Email"
            placeholder="company@example.com"
            register={register('contactEmail', {
              required: 'Contact email is required',
              value: session?.user?.email || '',
            })}
            error={errors.contactEmail}
            disabled
          />
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
              label="Country"
              placeholder="Select country"
              options={countries}
              register={register('country', {
                required: 'Company location is required',
              })}
              error={errors.country}
            />
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <CountryCodeSelect
            label="Country Phone Code"
            value={watch('countryPhoneCode')}
            options={countryPhoneCodes}
            onChange={(value) => setValue('countryPhoneCode', value)}
            error={errors.countryPhoneCode}
          />

          <FormInput
            label="Contact Phone (Optional)"
            placeholder="555 123 4567"
            register={register('contactPhone', {
              validate: (value) => {
                if (!value) return true
                const phoneRegex = /^[\d\s\-()]+$/
                return phoneRegex.test(value) || 'Enter only numbers, spaces, or hyphens'
              },
            })}
            type='tel'
            error={errors.contactPhone}
          />
        </div>

        <FormTextarea
          label="Address (Optional)"
          placeholder="Street, city, state, postal code"
          register={register('address')}
          error={errors.address}
          maxLength={200}
        />
      </div>
    </div>
  )
}

export default Step2Contact
