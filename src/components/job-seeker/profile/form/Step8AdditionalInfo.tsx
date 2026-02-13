import { FieldErrors, UseFormRegister, UseFormSetValue, UseFormWatch } from 'react-hook-form'
import { JobSeekerFormInputs } from './ProfileWizard'
import StepHeader from '@/src/components/ui/StepHeader'
import { FormInput } from '@/src/components/ui/FormInput'
import { FormSelect } from '@/src/components/ui/FormSelect'
import MultiSelect from '@/src/components/ui/MultiSelect'
import { jobCategories, noticePeriods } from '@/src/utils/utils'
import { useCountries } from '@/src/store/hooks/useCountries'

const Step8AdditionalInfo = ({
  register,
  errors,
  watch,
  setValue,
}: {
  register: UseFormRegister<JobSeekerFormInputs>
  errors: FieldErrors<JobSeekerFormInputs>
  watch: UseFormWatch<JobSeekerFormInputs>
  setValue: UseFormSetValue<JobSeekerFormInputs>
}) => {
  const { countries } = useCountries()
  return (
    <div className="space-y-8">
      <StepHeader
        heading="Your Additional Information"
        description=""
      />
      <div className="rounded-2xl border border-border/40 bg-card p-6 space-y-6 max-sm:p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            label="Portfolio URL (Optional)"
            register={register('portfolioWebsite',
              {
                validate: (value) => {
                  const regex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g
                  return regex.test(value) || 'Please enter a valid URL'
                }
              })}
            placeholder="for example, https://example.com/"
            error={errors.portfolioWebsite}
            toolTipContent=''
          />
          <FormInput
            label="Github URL (Optional)"
            register={register('githubUrl', {
              validate: (value) => {
                const regex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g
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
            label="Linkedin URL (Optional)"
            register={register('linkedinUrl',
              {
                validate: (value) => {
                  const regex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g
                  return regex.test(value) || 'Please enter a valid URL'
                }
              })}
            placeholder="for example, https://www.linkedin.com/in/johndoe"
            error={errors.linkedinUrl}
            toolTipContent=''
          />
          <FormInput
            label="X Formarily Twitter URL (Optional)"
            register={register('twitterUrl', {
              validate: (value) => {
                const regex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g
                return regex.test(value) || 'Please enter a valid URL'
              }
            })}
            placeholder="for example, https://x.com/johndoe"
            error={errors.twitterUrl}
          // disabled
          />
        </div>
        {/* //Other links remaining */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormSelect
            label="Notice Period(Optional)"
            options={noticePeriods}
            register={register('noticePeriod')}
            error={errors.noticePeriod}
          />
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
            error={errors.jobCategories?.message}
          />
        </div>
        {/* Preffered locations remaining */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            label="Minimum Expected Salary in Lakhs(Optional)"
            register={
              register('expectedSalaryMin', {
                valueAsNumber: true,
                min: { value: 0, message: 'Minimum salary cannot be negative' },
                validate: (value, formValues) => {
                  if (!value && !formValues.expectedSalaryMax) return true

                  if (value && !formValues.expectedSalaryMax) return true

                  if (value && formValues.expectedSalaryMax &&
                    value > formValues.expectedSalaryMax) {
                    return 'Minimum salary cannot exceed maximum salary'
                  }

                  return true
                }
              })
            }
            placeholder="for example: 10"
            error={errors.expectedSalaryMin}
            type='number'
            minLength={0}
          />
          <FormInput
            label="Maximum Expected Salary in Lakhs (Optional)"
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
          />
        </div>
      </div>
    </div>
  )
}

export default Step8AdditionalInfo