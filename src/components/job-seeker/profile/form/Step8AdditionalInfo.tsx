import { FieldErrors, UseFormRegister, UseFormSetValue, UseFormWatch } from 'react-hook-form'
import StepHeader from '@/src/components/ui/StepHeader'
import { FormInput } from '@/src/components/ui/FormInput'
import { FormSelect } from '@/src/components/ui/FormSelect'
import MultiSelect from '@/src/components/ui/MultiSelect'
import { useCountries } from '@/src/store/hooks/useCountries'
import { useState } from 'react'
import { toast } from 'sonner'
import { X } from 'lucide-react'
import { jobCategories, noticePeriods } from '@/src/utils/constants'
import { JobSeekerFormInputs } from '@/src/types'

const regex =
  /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{2,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/

const Step8AdditionalInfo = ({
  register,
  errors,
  watch,
  disabled,
  setValue,
}: {
  register: UseFormRegister<JobSeekerFormInputs>
  errors: FieldErrors<JobSeekerFormInputs>
  watch: UseFormWatch<JobSeekerFormInputs>
  setValue: UseFormSetValue<JobSeekerFormInputs>
  disabled?: boolean
}) => {
  const [otherLinkInput, setOtherLinkInput] = useState('')
  const { countries } = useCountries()
  const otherLinks = watch('otherLinks') || []

  const handleAddOtherLink = () => {
    if (!otherLinkInput) return
    console.log(otherLinkInput);

    if (!regex.test(otherLinkInput)) {
      toast.error('Please enter a valid URL')
      return
    }

    if (otherLinks.includes(otherLinkInput)) {
      toast.error('Link already added')
      return
    }

    setValue('otherLinks', [...otherLinks, otherLinkInput], {
      shouldDirty: true,
      shouldValidate: true,
    })

    setOtherLinkInput('')
  }

  const handleRemoveOtherLink = (index: number) => {
    const updated = otherLinks.filter((_, i) => i !== index)
    setValue('otherLinks', updated, {
      shouldDirty: true,
      shouldValidate: true,
    })
  }
  return (
    <div className="space-y-8">
      <StepHeader
        heading="Your Additional Information"
        description="Additional information to help recruiters find you."
      />
      <div className="rounded-2xl border border-border/40 bg-card p-6 space-y-6 max-sm:p-4">


        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            label="Portfolio URL (Optional)"
            disabled={disabled}
            register={register('portfolioWebsite',
              {
                validate: (value) => {
                  return regex.test(value) || 'Please enter a valid URL'
                }
              })}
            placeholder="for example, https://example.com/"
            error={errors.portfolioWebsite}
            toolTipContent=''
          />
          <FormInput
            disabled={disabled}
            label="Github URL (Optional)"
            register={register('githubUrl', {
              validate: (value) => {
                return regex.test(value) || 'Please enter a valid URL'
              }
            })}
            placeholder="for example, https://github.com/johndoe"
            error={errors.githubUrl}
          // disabled
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            disabled={disabled}
            label="Linkedin URL (Optional)"
            register={register('linkedinUrl',
              {
                validate: (value) => {
                  return regex.test(value) || 'Please enter a valid URL'
                }
              })}
            placeholder="for example, https://www.linkedin.com/in/johndoe"
            error={errors.linkedinUrl}
            toolTipContent=''
          />
          <FormInput
            disabled={disabled}
            label="X Formarily Twitter URL (Optional)"
            register={register('twitterUrl', {
              validate: (value) => {
                return regex.test(value) || 'Please enter a valid URL'
              }
            })}
            placeholder="for example, https://x.com/johndoe"
            error={errors.twitterUrl}
          // disabled
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
          <div className="space-y-3">
            <label className="text-sm text-muted-foreground font-medium">
              Other Links (Optional)
            </label>

            <div className="flex gap-2">
              <input
                disabled={disabled}
                type="text"
                value={otherLinkInput}
                onChange={(e) => setOtherLinkInput(e.target.value)}
                placeholder="https://example.com"
                aria-label="Add link"
                className="flex-1 rounded-lg border border-border/40 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              <button
                type="button"
                onClick={handleAddOtherLink}
                disabled={disabled}
                className="rounded-lg bg-primary px-4 py-2 text-sm text-white hover:opacity-90"
              >
                Add
              </button>
            </div>

            {otherLinks.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {otherLinks.map((link, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 rounded-full border border-border/40 bg-muted/30 px-3 py-1 text-xs"
                  >
                    <span className="truncate max-w-[200px]">{link}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveOtherLink(index)}
                      className="text-destructive"
                      disabled={disabled}
                      aria-label="Remove link"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormSelect
            label="Notice Period(Optional)"
            options={noticePeriods}
            register={register('noticePeriod')}
            error={errors.noticePeriod}
            disabled={disabled}
          />
          <FormInput
            disabled={disabled}
            label="Expected CTC in LPA(Optional)"
            register={
              register('expectedSalaryMin', {
                valueAsNumber: true,
                min: { value: 0, message: 'Expected CTC cannot be negative' },
                // validate: (value, formValues) => {
                //   if (!value && !formValues.expectedSalaryMax) return true

                //   if (value && !formValues.expectedSalaryMax) return true

                //   if (value && formValues.expectedSalaryMax &&
                //     value > formValues.expectedSalaryMax) {
                //     return 'Minimum salary cannot exceed maximum salary'
                //   }

                //   return true
                // }
              })
            }
            placeholder="for example: 10"
            error={errors.expectedSalaryMin}
            type='number'
            minLength={0}
          />
          {/* <FormInput
            disabled={disabled}
            label="Maximum Expected Salary in LPA (Optional)"
            register={register(
              'expectedSalaryMax', {
              valueAsNumber: true,
              min: { value: 0, message: 'Maximum salary cannot be negative' },
              validate: (value, formValues) => {
                if (!value && !formValues.expectedSalaryMin) return true

                if (value && !formValues.expectedSalaryMin) return true

                if (value && formValues.expectedSalaryMin && value < formValues.expectedSalaryMin) {
                  return 'Maximum salary must be greater than minimum salary'
                }
                return true
              }
            })
            }
            placeholder="for example: 20 should be greater than minimum salary"
            error={errors.expectedSalaryMax}
            type='number'
            minLength={0}
          /> */}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <MultiSelect
            label="Job Categories"
            options={jobCategories}
            value={watch('jobCategories')}
            onChange={(val) =>
              setValue('jobCategories', val, {
                shouldDirty: true,
                shouldValidate: true,
              })
            }
            placeholder="Search categories..."
            disabled={disabled}
            error={errors.jobCategories?.message}
          />
          <MultiSelect
            label="Preferred Locations (Countries)"
            options={countries}
            value={watch('preferredLocations')}
            onChange={(val) =>
              setValue('preferredLocations', val, {
                shouldDirty: true,
                shouldValidate: true,
              })
            }
            disabled={disabled}
            placeholder="Select preferred countries..."
            error={errors.preferredLocations?.message}
          />
        </div>
      </div>
    </div>
  )
}

export default Step8AdditionalInfo