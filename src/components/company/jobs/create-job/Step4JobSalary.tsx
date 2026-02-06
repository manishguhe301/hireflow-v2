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
            label="Minimum Salary (Optional)"
            register={register('salaryMin')}
            placeholder="for example: 10000"
            error={errors.salaryMin}
            type='number'
            minLength={0}
          />
          <FormInput
            label="Maximum Salary (Optional)"
            register={register('salaryMax')}
            placeholder="for example: 20000 should be greater than minimum salary"
            error={errors.salaryMax}
            type='number'
            minLength={0}
          />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormSelect
            label='Currency (Optional)'
            register={register('currency')}
            options={
              currencyOptions
            }
            error={errors.currency}
          />
          <div className="flex flex-col gap-2">
            <label className="text-sm text-muted-foreground">
              Salary Visibility
            </label>

            <div className="grid grid-cols-2 gap-3">
              <label className="cursor-pointer">
                <input
                  type="radio"
                  value="false"
                  {...register('hideSalary')}
                  className="peer hidden"
                  defaultChecked
                />
                <div className="rounded-xl border border-border/60 px-4 py-3 text-center text-sm transition peer-checked:border-primary peer-checked:bg-primary/10 peer-checked:text-primary">
                  Show Salary
                </div>
              </label>

              <label className="cursor-pointer">
                <input
                  type="radio"
                  value="true"
                  {...register('hideSalary')}
                  className="peer hidden"
                />
                <div className="rounded-xl border border-border/60 px-4 py-3 text-center text-sm transition peer-checked:border-primary peer-checked:bg-primary/10 peer-checked:text-primary">
                  Hide Salary
                </div>
              </label>
            </div>

            <p className="text-xs text-muted-foreground">
              Hiding salary may reduce applications but can help avoid early pay bias.
            </p>
          </div>
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