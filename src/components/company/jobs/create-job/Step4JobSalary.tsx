'use client'
import { FieldErrors, UseFormRegister, UseFormSetValue, UseFormWatch } from 'react-hook-form'
import { JobFormInputs } from './CreateJobForm'
import { FormInput } from '@/src/components/ui/FormInput'
import { FormSelect } from '@/src/components/ui/FormSelect'
import { currencyOptions } from '@/src/utils/utils'
import FormDatePicker from '@/src/components/ui/FormDatePicker'

const Step4JobSalary = ({
  register,
  errors,
  watch,
  setValue,
}: {
  register: UseFormRegister<JobFormInputs>
  errors: FieldErrors<JobFormInputs>
  watch: UseFormWatch<JobFormInputs>
  setValue: UseFormSetValue<JobFormInputs>
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
            label="Minimum Salary in Lakhs(Optional)"
            register={register('salaryMin', { valueAsNumber: true })
            }
            placeholder="for example: 10"
            error={errors.salaryMin}
            type='number'
            minLength={0}
          />
          <FormInput
            label="Maximum Salary in Lakhs (Optional)"
            register={register('salaryMax', { valueAsNumber: true })
            }
            placeholder="for example: 20 should be greater than minimum salary"
            error={errors.salaryMax}
            type='number'
            minLength={0}
          />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-1">
          {/* <FormSelect
            label='Currency (Optional)'
            register={register('currency')}
            options={
              currencyOptions
            }
            error={errors.currency}
          /> */}
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
          />

        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormInput
            label="Number of Openings (By default 1)"
            register={register('numberOfOpenings', { required: "Number of openings is required" })}
            placeholder="for example: 10"
            error={errors.numberOfOpenings}
            type='number'
            minLength={1}
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
            error={errors.applicationDeadline}
          />
        </div>
      </div>
    </div>
  )
}

export default Step4JobSalary