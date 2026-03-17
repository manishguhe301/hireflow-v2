import { Button } from '@/src/components/ui/Button'
import { FormInput } from '@/src/components/ui/FormInput'
import { FormSelect } from '@/src/components/ui/FormSelect'
import Modal from '@/src/components/ui/Modal'
import { EducationInput } from '@/src/types'
import { degrees, fieldOfStudies } from '@/src/utils/constants'
import { FieldErrors, UseFormHandleSubmit, UseFormRegister, UseFormWatch } from 'react-hook-form'

const currentYear = new Date().getFullYear()

const EducationModal = ({
  isModalOpen,
  handleCloseModal,
  editingIndex,
  handleEduSubmit,
  onSubmit,
  eduRegister,
  disabled,
  isSaving,
  eduWatch,
  eduErrors
}: {
  isSaving: boolean
  editingIndex: number | null
  isModalOpen: boolean
  handleCloseModal: () => void
  handleEduSubmit: UseFormHandleSubmit<EducationInput, EducationInput>
  eduRegister: UseFormRegister<EducationInput>
  eduWatch: UseFormWatch<EducationInput>
  onSubmit: (data: EducationInput) => Promise<void>
  disabled: boolean
  eduErrors: FieldErrors<EducationInput>
}) => {
  const isCurrent = eduWatch('isCurrent')
  return (
    <Modal
      open={isModalOpen}
      onClose={handleCloseModal}
      className="max-sm:max-h-[70%] overflow-y-scroll max-w-2xl max-h-[90%]"
    >
      <h2 className="text-xl font-semibold mb-6">
        {editingIndex !== null ? 'Edit Education' : 'Add Education'}
      </h2>

      <form onSubmit={handleEduSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormSelect
            label="Type of Degree"
            options={degrees}
            register={eduRegister('degree', {
              required: 'Degree is required',
            })}
            error={eduErrors.degree}
            disabled={disabled}

          />
          <FormInput
            label="Institution"
            register={eduRegister('institution', { required: 'Institution is required' })}
            error={eduErrors.institution}
            disabled={disabled}
          />
        </div>

        <FormSelect
          label="Field of Study "
          options={fieldOfStudies}
          register={eduRegister('fieldOfStudy', {
            required: 'Field of study is required',
          })}
          disabled={disabled}
          error={eduErrors.fieldOfStudy}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            type="number"
            label="Start Year"
            disabled={disabled}
            register={eduRegister('startYear', { required: true })}
            error={eduErrors.startYear}
            minLength={2000}
            maxLength={currentYear}
          />

          {!isCurrent && (
            <FormInput
              type="number"
              disabled={disabled}
              label="End Year"
              register={eduRegister('endYear')}
              error={eduErrors.endYear}
              maxLength={currentYear}
              minLength={2000}
            />
          )}
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="isCurrentEdu"
            disabled={disabled}
            {...eduRegister('isCurrent')}
            className="h-4 w-4 rounded border-border/40 accent-primary focus:ring-2 focus:ring-primary/30"
          />
          <label htmlFor="isCurrentEdu" className="text-sm font-medium">
            I am currently studying here
          </label>
        </div>

        <FormInput
          label="Grade (Optional)"
          register={eduRegister('grade')}
          error={eduErrors.grade}
          disabled={disabled}
        />

        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleCloseModal}
            disabled={disabled}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={disabled}
          >
            {
              isSaving ?
                'Saving...' : editingIndex !== null
                  ? 'Update Education'
                  : 'Add Education'
            }
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default EducationModal