import { Button } from '@/src/components/ui/Button'
import FormDatePicker from '@/src/components/ui/FormDatePicker'
import { FormInput } from '@/src/components/ui/FormInput'
import { FormSelect } from '@/src/components/ui/FormSelect'
import { FormTextarea } from '@/src/components/ui/FormTextarea'
import Modal from '@/src/components/ui/Modal'
import { WorkExperienceForm } from '@/src/types'
import { workModes } from '@/src/utils/constants'
import { FieldErrors, UseFormHandleSubmit, UseFormRegister, UseFormSetValue, UseFormWatch } from 'react-hook-form'


const ExperienceModal = ({
  isModalOpen,
  handleCloseModal,
  editingIndex,
  handleExpSubmit,
  onSubmit,
  expRegister,
  expErrors,
  disabled,
  expWatch,
  setExpValue,
  isSaving
}: {
  editingIndex: number | null
  isModalOpen: boolean
  handleCloseModal: () => void
  disabled: boolean
  isSaving: boolean
  expRegister: UseFormRegister<WorkExperienceForm>
  expErrors: FieldErrors<WorkExperienceForm>
  expWatch: UseFormWatch<WorkExperienceForm>
  setExpValue: UseFormSetValue<WorkExperienceForm>
  handleExpSubmit: UseFormHandleSubmit<WorkExperienceForm, WorkExperienceForm>
  onSubmit: (data: WorkExperienceForm) => Promise<void>
}) => {
  const isCurrent = expWatch('isCurrent')

  return (
    <Modal
      open={isModalOpen}
      onClose={handleCloseModal}
      className="max-sm:max-h-[70%] overflow-y-scroll max-w-2xl max-h-[90%]"
    >
      <h2 className="text-xl font-semibold mb-6">
        {editingIndex !== null ? 'Edit Work Experience' : 'Add Work Experience'}
      </h2>
      <form
        onSubmit={handleExpSubmit(onSubmit)}
        className="space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            label="Job Title"
            placeholder="e.g., Senior Frontend Developer"
            register={expRegister('title', {
              required: 'Job title is required',
              minLength: { value: 2, message: 'Title must be at least 2 characters' },
            })}
            error={expErrors.title}
            disabled={disabled}
          />

          <FormInput
            label="Company"
            placeholder="e.g., Google"
            register={expRegister('company', {
              required: 'Company name is required',
              minLength: { value: 2, message: 'Company name must be at least 2 characters' },
            })}
            error={expErrors.company}
            disabled={disabled}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            label="Location (Optional)"
            placeholder="e.g., San Francisco, CA"
            disabled={disabled}
            register={expRegister('location')}
            error={expErrors.location}
          />
          <FormSelect
            disabled={disabled}
            label="Work Mode"
            options={[{ value: '', label: 'Select work mode' }, ...workModes]}
            register={expRegister('workMode', { required: 'Work mode is required' })}
            error={expErrors.workMode}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormDatePicker
            disabled={disabled}
            label="Start Date"
            value={expWatch('startDate')}
            maxDate={new Date()}
            onChange={(date) =>
              setExpValue('startDate', date ?? null, {
                shouldValidate: true,
              })
            }
            error={expErrors.startDate}
          />

          {!isCurrent && (
            <FormDatePicker
              disabled={disabled}
              label="End Date"
              value={expWatch('endDate')}
              minDate={
                expWatch('startDate')
                  ? new Date(expWatch('startDate')!.getTime() + 86400000)
                  : undefined
              }
              maxDate={new Date()}
              onChange={(date) =>
                setExpValue('endDate', date!, {
                  shouldValidate: true,
                })}
              error={expErrors.endDate}
            />
          )}
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="isCurrent"
            {...expRegister('isCurrent')}
            className="h-4 w-4 rounded border-border/40 accent-primary focus:ring-2 focus:ring-primary/30"
            aria-label="I currently work here"
            disabled={disabled}
          />
          <label htmlFor="isCurrent" className="text-sm font-medium">
            I currently work here
          </label>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="isPartTime"
            {...expRegister('isPartTime')}
            className="h-4 w-4 rounded border-border/40 accent-primary focus:ring-2 focus:ring-primary/30"
            aria-label="This is a part-time or freelance role"
            disabled={disabled}
          />
          <label htmlFor="isPartTime" className="text-sm font-medium">
            Part-time / Freelance{' '}
            <span className="text-xs text-muted-foreground font-normal">
              (allows overlapping dates)
            </span>
          </label>
        </div>
        <FormTextarea
          disabled={disabled}
          label="Description (Optional)"
          placeholder="Describe your role, responsibilities, and achievements..."
          rows={5}
          register={expRegister('description', {
            maxLength: { value: 500, message: 'Description must be less than 500 characters' },
          })}
          error={expErrors.description}
          maxLength={500}
        />

        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleCloseModal}
            disabled={disabled}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={disabled}
          >
            {
              isSaving ?
                'Saving...' : editingIndex !== null
                  ? 'Update Experience'
                  : 'Add Experience'
            }
          </Button>
        </div>
      </form>
    </Modal >
  )
}

export default ExperienceModal