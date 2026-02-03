'use client'

import React, { useEffect, useState } from 'react'
import { FieldErrors, UseFormRegister, UseFormSetValue, UseFormWatch } from 'react-hook-form'
import { ProfileFormInputs } from './ProfileSetup'
import { FormInput } from '../../ui/FormInput'
import { FormSelect } from '../../ui/FormSelect'
import { FormTextarea } from '../../ui/FormTextarea'
import { useSession } from 'next-auth/react'
import { AppSdk } from '@/src/utils/AppSdk'
import { toast } from 'sonner'
import { Spinner } from '../../elements/Loader'
import CountryCodeSelect from '../../ui/CountryCodeSelect'

type CountryApiResponse = {
  name: {
    common: string
  }
  idd?: {
    root?: string
    suffixes?: string[]
  }
  flags?: {
    png?: string
    svg?: string
  }
}

type CountryOption = {
  label: string
  value: string
  disabled?: boolean
}

type PhoneCodeOption = {
  label: string
  value: string
  disabled?: boolean
  country: string
  flag: string
}

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

  const [countries, setCountries] = useState<
    CountryOption[]
  >([])
  const [countryPhoneCodes, setCountryPhoneCodes] = useState<PhoneCodeOption[]>([])
  const [loading, setLoading] = useState(true)

  const fetchCountries = async () => {
    try {
      const res = await AppSdk.getData(
        // 'https://restcountries.com/v3.1/all?fields=name',
        'https://restcountries.com/v3.1/all?fields=name,idd,flags',
        null
      )

      const countryOptions: CountryOption[] = []
      const phoneOptions: PhoneCodeOption[] = []

      res.forEach((country: CountryApiResponse) => {
        const name = country.name.common

        countryOptions.push({
          label: name,
          value: name,
        })

        if (country.idd?.root && country.idd?.suffixes?.length) {
          phoneOptions.push({
            label: `${country.idd.root}${country.idd.suffixes[0]} (${name})`,
            value: `${country.idd.root}${country.idd.suffixes[0]}`,
            country: name,
            flag: country.flags?.png || '',
          })
        }
      })

      countryOptions.sort((a, b) => a.label.localeCompare(b.label))
      phoneOptions.sort((a, b) => a.country.localeCompare(b.country))

      setCountries(countryOptions)
      setCountryPhoneCodes(phoneOptions)

    } catch (error) {
      console.error(error)
      toast.error('Failed to load countries')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCountries()
  }, [])


  useEffect(() => {
    if (!selectedCountry) return

    const match = countryPhoneCodes.find(
      (c) => c.country === selectedCountry
    )

    if (match) {
      setValue('countryPhoneCode', match.value)
    }
  }, [selectedCountry, countryPhoneCodes, setValue])

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
                const phoneRegex = /^\+?[1-9]\d{1,14}$/
                return phoneRegex.test(value) || 'Invalid phone number format'
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
