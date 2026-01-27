'use client'

import React, { useEffect, useState } from 'react'
import { FieldErrors, UseFormRegister } from 'react-hook-form'
import { ProfileFormInputs } from './ProfileSetup'
import { FormInput } from '../../ui/FormInput'
import { FormSelect } from '../../ui/FormSelect'
import { FormTextarea } from '../../ui/FormTextarea'
import { useSession } from 'next-auth/react'
import { AppSdk } from '@/src/utils/AppSdk'
import { toast } from 'sonner'
import { Spinner } from '../../elements/Loader'

type CountryApiResponse = {
  name: {
    common: string
  }
}

type CountryOption = {
  label: string
  value: string
  disabled?: boolean
}

const Step2Contact = ({
  register,
  errors,
}: {
  register: UseFormRegister<ProfileFormInputs>
  errors: FieldErrors<ProfileFormInputs>
}) => {
  const { data: session } = useSession()

  const [countries, setCountries] = useState<
    CountryOption[]
  >([])
  const [loading, setLoading] = useState(true)

  const fetchCountries = async () => {
    try {
      const res = await AppSdk.getData(
        'https://restcountries.com/v3.1/all?fields=name',
        null
      )

      const formatted = res
        .map((country: CountryApiResponse) => ({
          label: country.name.common,
          value: country.name.common,
        }))
        .sort((a: { label: string, value: string }, b: { label: string, value: string }) => a.label.localeCompare(b.label))

      const popularCountries = ['United States', 'India', 'United Kingdom', 'Canada']
      const popular = formatted.filter((c: CountryOption) => popularCountries.includes(c.value))
      const others = formatted.filter((c: CountryOption) => !popularCountries.includes(c.value))

      setCountries([
        ...popular,
        { label: '---', value: '', disabled: true },
        ...others
      ])
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

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormInput
            label="Contact Phone (Optional)"
            placeholder="+1 555 123 4567"
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
              placeholder="Select country"
              options={countries}
              register={register('location', {
                required: 'Company location is required',
              })}
              error={errors.location}
            />
          )}
        </div>

        <FormTextarea
          label="Address (Optional)"
          placeholder="Street, city, state, postal code"
          register={register('address')}
          error={errors.address}
        />
      </div>
    </div>
  )
}

export default Step2Contact
