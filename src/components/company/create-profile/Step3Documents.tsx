import { FieldErrors, UseFormRegister, UseFormSetValue, UseFormWatch } from "react-hook-form"
import { FileUpload } from "../../ui/FileUpload"
import { useCompany } from "@/src/store/hooks/useCompany"
import StepHeader from "../../ui/StepHeader"
import { ProfileFormInputs } from "@/src/types"

const Step3Documents = ({
  register,
  errors,
  isLoading,
  watch,
  setValue
}: {
  register: UseFormRegister<ProfileFormInputs>
  errors: FieldErrors<ProfileFormInputs>
  isLoading: boolean
  watch: UseFormWatch<ProfileFormInputs>
  setValue: UseFormSetValue<ProfileFormInputs>
}) => {
  const { company } = useCompany()

  const existingCompany = company?.status === 'REJECTED' || company?.status === 'APPROVED' ? company : null

  return (
    <div className="space-y-8">
      <StepHeader
        heading="Documents & Verification"
        description={
          existingCompany
            ? "Update your documents if needed, or keep existing ones."
            : "Upload required documents to verify your company."
        }
      />
      {!existingCompany && (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 text-sm text-amber-600">
          <p className="font-medium">Important</p>
          <p className="mt-1">
            If you navigate to another step and return here, your selected file may
            appear cleared due to browser security behavior. Please re-check your
            documents before publishing your profile.
          </p>
        </div>
      )}

      <div className="rounded-2xl border border-border/40 bg-card p-6 space-y-6 max-sm:p-4">
        {watch('deleteLogo') && (
          <div className="flex items-center gap-3 rounded-2xl border border-border/40 bg-muted/20 p-4">
            <p className="text-sm text-muted-foreground flex-1">Click on &apos;Save changes&apos; to delete your logo</p>
            <button
              type="button"
              onClick={() => setValue('deleteLogo',
                false, { shouldDirty: true })}
              className="text-xs text-primary border border-primary/40 rounded-lg px-3 py-1.5 hover:bg-primary/10 transition disabled:opacity-50"
            >
              Undo
            </button>
          </div>
        )}
        <FileUpload<ProfileFormInputs>
          label="Company Logo (Optional)"
          description="PNG, JPG or SVG (max 2MB)"
          name="logo"
          register={register}
          error={errors.logo}
          // required
          accept="image/png,image/jpeg,image/jpg,image/svg+xml"
          maxSizeMB={2}
          existingFileUrl={watch('deleteLogo') ? null : company?.logo}
          isImage
          onDeleteExisting={
            company?.logo
              ? () => setValue('deleteLogo', true, { shouldDirty: true })
              : undefined
          }
          disabled={isLoading}
        />

        <FileUpload<ProfileFormInputs>
          label="Business Registration Document"
          description="PDF or image file (max 5MB)"
          name="businessDocument"
          register={register}
          error={errors.businessDocument}
          required
          accept="application/pdf,image/*"
          maxSizeMB={5}
          existingFileUrl={existingCompany?.businessDocument}
          disabled={isLoading}
        />

        <FileUpload<ProfileFormInputs>
          label="Tax Document (Optional)"
          description="GST, VAT or equivalent (max 5MB)"
          name="taxDocument"
          register={register}
          error={errors.taxDocument}
          required={false}
          accept="application/pdf,image/*"
          maxSizeMB={5}
          existingFileUrl={existingCompany?.taxDocument}
          disabled={isLoading}
        />
      </div>
    </div>
  )
}

export default Step3Documents
