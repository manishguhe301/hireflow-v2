import { FieldErrors, UseFormRegister } from "react-hook-form"
import { FileUpload } from "../../ui/FileUpload"
import { ProfileFormInputs } from "./ProfileSetup"

const Step3Documents = ({
  register,
  errors,
}: {
  register: UseFormRegister<ProfileFormInputs>
  errors: FieldErrors<ProfileFormInputs>
}) => {
  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold tracking-tight">
          Documents & Verification
        </h2>
        <p className="text-sm text-muted-foreground">
          Upload required documents to verify your company.
        </p>
      </div>

      <div className="rounded-2xl border border-border/40 bg-card p-6 space-y-6 max-sm:p-4">
        <FileUpload<ProfileFormInputs>
          label="Company Logo"
          description="PNG, JPG or SVG (max 2MB)"
          name="logo"
          register={register}
          error={errors.logo}
          required
          accept="image/png,image/jpeg,image/jpg,image/svg+xml"
          maxSizeMB={2}
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
        />
      </div>
    </div>
  )
}

export default Step3Documents
