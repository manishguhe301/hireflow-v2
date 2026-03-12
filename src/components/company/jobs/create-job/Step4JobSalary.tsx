'use client'
import { FieldErrors, UseFormRegister, UseFormSetValue, UseFormWatch } from 'react-hook-form'
import { JobFormInputs } from './CreateJobForm'
import { FormInput } from '@/src/components/ui/FormInput'
import { FormSelect } from '@/src/components/ui/FormSelect'
import FormDatePicker from '@/src/components/ui/FormDatePicker'
import StepHeader from '@/src/components/ui/StepHeader'

const Step4JobSalary = ({
  register,
  errors,
  watch,
  setValue,
  isEditMode,
  disabled
}: {
  register: UseFormRegister<JobFormInputs>
  errors: FieldErrors<JobFormInputs>
  watch: UseFormWatch<JobFormInputs>
  setValue: UseFormSetValue<JobFormInputs>
  isEditMode?: boolean
  disabled?: boolean
}) => {
  return (
    <div className="space-y-8">
      <StepHeader
        heading='Salary & Openings'
        description='Define compensation details and control salary visibility for candidates.'
      />

      <div className="rounded-2xl border border-border/40 bg-card p-6 space-y-6 max-sm:p-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormInput
            label="Minimum CTC Offered in LPA(Optional)"
            register={
              register('salaryMin', {
                valueAsNumber: true,
                min: { value: 0, message: 'Minimum CTC cannot be negative' },
                validate: (value, formValues) => {
                  if (!value && !formValues.salaryMax) return true

                  if (value && !formValues.salaryMax) return true

                  if (value && formValues.salaryMax && value > formValues.salaryMax) {
                    return 'Minimum CTC cannot exceed maximum salary'
                  }

                  return true
                }
              })
            }
            disabled={disabled}
            placeholder="for example: 10"
            error={errors.salaryMin}
            type='number'
            minLength={0}
          />
          <FormInput
            label="Maximum CTC Offered in LPA (Optional)"
            register={register(
              'salaryMax', {
              valueAsNumber: true,
              min: { value: 0, message: 'Maximum salary cannot be negative' },
              validate: (value, formValues) => {
                if (!value && !formValues.salaryMin) return true

                if (value && !formValues.salaryMin) return true

                if (value && formValues.salaryMin && value < formValues.salaryMin) {
                  return 'Maximum salary must be greater than minimum salary'
                }
                return true
              }
            })
            }
            disabled={disabled}
            placeholder="for example: 20 should be greater than minimum salary"
            error={errors.salaryMax}
            type='number'
            minLength={0}
          />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-1">
          <FormSelect
            label="Salary Visibility"
            options={[
              { label: 'Show Salary', value: 'false' },
              { label: 'Hide Salary', value: 'true' },
            ]}
            register={register('hideSalary', {
              setValueAs: (v) => v === 'true',
            })}
            error={errors.hideSalary}
            disabled={disabled}
          />

        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormInput
            label={isEditMode ? "Number of Openings" : "Number of Openings (By default 1)"}
            register={register('numberOfOpenings', {
              required: "Number of openings is required",
              valueAsNumber: true,
              min: { value: 1, message: 'At least 1 opening required' },
              max: { value: 100, message: 'Maximum 100 openings allowed' },
            })}
            placeholder="for example: 10"
            error={errors.numberOfOpenings}
            type='number'
            minLength={1}
            disabled={disabled}
            maxLength={100}
          />
          <FormDatePicker
            label="Application Deadline (Optional)"
            value={watch('applicationDeadline')}
            minDate={new Date()}
            onChange={(date) =>
              setValue('applicationDeadline', date, {
                shouldDirty: true,
                shouldValidate: true,
              })
            }
            disabled={disabled}
            error={errors.applicationDeadline}
          />
        </div>
      </div>
    </div>
  )
}

export default Step4JobSalary