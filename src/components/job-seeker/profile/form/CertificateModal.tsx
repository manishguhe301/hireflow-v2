import { Button } from "@/src/components/ui/Button"
import FormDatePicker from "@/src/components/ui/FormDatePicker"
import { FormInput } from "@/src/components/ui/FormInput"
import Modal from "@/src/components/ui/Modal"
import { CertificationForm } from "@/src/types"
import { FieldErrors, UseFormHandleSubmit, UseFormRegister, UseFormSetValue, UseFormWatch } from "react-hook-form"

const CertificateModal = ({
  isModalOpen,
  handleCloseModal,
  editingIndex,
  handleCertSubmit,
  onSubmit,
  disabled,
  isSaving,
  certRegister,
  certErrors,
  certWatch,
  setCertValue
}: {
  isModalOpen: boolean
  handleCloseModal: () => void
  editingIndex: number | null
  handleCertSubmit: UseFormHandleSubmit<CertificationForm, CertificationForm>
  onSubmit: (data: CertificationForm) => Promise<void>
  disabled: boolean
  isSaving: boolean
  certRegister: UseFormRegister<CertificationForm>
  certWatch: UseFormWatch<CertificationForm>
  certErrors: FieldErrors<CertificationForm>
  setCertValue: UseFormSetValue<CertificationForm>
}) => {
  return (
    <Modal
      open={isModalOpen}
      onClose={handleCloseModal}
      className="max-sm:max-h-[70%] overflow-y-scroll max-w-2xl max-h-[90%]"
    >
      <h2 className="text-xl font-semibold mb-6">
        {editingIndex !== null ? 'Edit Certification' : 'Add Certification'}
      </h2>

      <form onSubmit={handleCertSubmit(onSubmit)} className="space-y-6">
        <FormInput
          disabled={disabled || isSaving}
          label="Certification Name"
          register={certRegister('name', {
            required: 'Certification name is required',
          })}
          error={certErrors.name}
        />

        <FormInput
          disabled={disabled || isSaving}
          label="Issuing Organization"
          register={certRegister('organization', {
            required: 'Organization is required',
          })}
          error={certErrors.organization}
        />

        <FormDatePicker
          disabled={disabled || isSaving}
          label="Issue Date"
          value={certWatch('issueDate')}
          maxDate={new Date()}
          onChange={(date) =>
            setCertValue('issueDate', date!, { shouldValidate: true })
          }
          error={certErrors.issueDate}
        />

        <FormDatePicker
          disabled={disabled || isSaving}
          label="Expiry Date (Optional)"
          value={certWatch('expiryDate')}
          minDate={certWatch('issueDate') ?? undefined}
          onChange={(date) =>
            setCertValue('expiryDate', date || null, {
              shouldValidate: true,
            })
          }
          error={certErrors.expiryDate}
        />

        <FormInput
          label="Credential ID (Optional)"
          register={certRegister('credentialId')}
          disabled={disabled || isSaving}
          error={certErrors.credentialId}
        />

        <FormInput
          label="Credential URL (Optional)"
          register={certRegister('credentialUrl')}
          disabled={disabled || isSaving}
          error={certErrors.credentialUrl}
        />

        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleCloseModal}
            disabled={disabled || isSaving}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={disabled || isSaving}
          >
            {
              isSaving ?
                'Saving...' : editingIndex !== null
                  ? 'Update Certification'
                  : 'Add Certification'
            }
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default CertificateModal