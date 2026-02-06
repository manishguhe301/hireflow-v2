import { FieldErrors, UseFormRegister } from "react-hook-form"
import { FileUpload } from "../../ui/FileUpload"
import { ProfileFormInputs } from "./ProfileSetup"
import { useCompany } from "@/src/store/hooks/useCompany"
import StepHeader from "../../ui/StepHeader"

const Step3Documents = ({
  register,
  errors,
}: {
  register: UseFormRegister<ProfileFormInputs>
  errors: FieldErrors<ProfileFormInputs>
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
          existingFileUrl={existingCompany?.logo}
          isImage
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
        />
      </div>
    </div>
  )
}

export default Step3Documents
