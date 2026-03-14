'use client'

import React from 'react'
import { UseFormWatch } from 'react-hook-form'
import { ProfileFormInputs } from './ProfileSetup'
import { Pencil } from 'lucide-react'
import clsx from 'clsx'
import { useCompany } from '@/src/store/hooks/useCompany'
import { getFileNameFromPath } from '@/src/utils/helper'
import StepHeader from '../../ui/StepHeader'

type Props = {
  watch: UseFormWatch<ProfileFormInputs>
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>
  isLoading: boolean
}

const Section = ({
  title,
  onEdit,
  children,
  disabled
}: {
  title: string
  onEdit: () => void
  children: React.ReactNode
  disabled?: boolean
}) => {
  return (
    <div className="rounded-2xl border border-border/40 bg-card p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold">{title}</h3>
        <button
          type="button"
          onClick={onEdit}
          disabled={disabled}
          className="flex items-center gap-1 text-sm text-primary hover:underline"
        >
          <Pencil className="h-4 w-4" />
          Edit
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
        {children}
      </div>
    </div>
  )
}

const Item = ({
  label,
  value,
  required = true
}: {
  label: string
  value?: string
  required?: boolean
}) => (
  <div>
    <p className="text-xs text-muted-foreground">
      {label}
      {required && !value && <span className="text-red-500 ml-1">*</span>}
    </p>
    <p className={clsx(
      'font-medium whitespace-pre-wrap wrap-break-word',
      !value && required && 'text-red-500',
      !value && !required && 'text-muted-foreground'
    )}>
      {value || (required ? 'Required' : '—')}
    </p>
  </div>
)

const FileItem = ({
  label,
  file,
  existingFileUrl,
  required = true
}: {
  label: string
  file?: FileList
  existingFileUrl?: string | null
  required?: boolean
}) => {
  const newFileName = file?.[0]?.name

  const existingFileName = existingFileUrl ? getFileNameFromPath(existingFileUrl) : null

  const displayName = newFileName || existingFileName
  const hasFile = !!(newFileName || existingFileName)

  return (
    <div>
      <p className="text-xs text-muted-foreground">
        {label}
        {required && !hasFile && <span className="text-red-500 ml-1">*</span>}
      </p>
      <div className="flex items-center gap-2">
        <p className={clsx(
          'font-medium truncate',
          !hasFile && required && 'text-red-500',
          !hasFile && !required && 'text-muted-foreground'
        )}>
          {displayName || (required ? 'Required' : 'Not uploaded')}
        </p>
        {!newFileName && existingFileName && (
          <span className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-full shrink-0">
            Existing
          </span>
        )}
      </div>
    </div>
  )
}

const Step4Review = ({ watch, setCurrentStep, isLoading }: Props) => {
  const data = watch()
  const { company } = useCompany()

  const existingCompany = company?.status === 'REJECTED' || company?.status === 'APPROVED' ? company : null

  return (
    <div className="space-y-8">
      <StepHeader
        heading='Review & Submit'
        description='Review your information before submitting. You can edit any section.'
      />
      <Section title="Company Basics" onEdit={() => setCurrentStep(0)} disabled={isLoading}>
        <Item label="Company Name" value={data.name} />
        <Item label="Founded Year" value={data.foundedYear} />
        <Item label="Industry" value={data.industry} />
        <Item label="Company Size" value={data.companySize} />
        <Item label="Website" value={data.website} />
        <Item label="LinkedIn" value={data.linkedinProfile} required={false} />
        <div className="sm:col-span-2">
          <Item label="Description" value={data.description || '-'} />
        </div>
      </Section>

      <Section title="Contact Information" onEdit={() => setCurrentStep(1)}
        disabled={isLoading}
      >
        <Item label="Contact Email" value={data.contactEmail} />
        <Item label="Contact Phone" value={data.contactPhone && `${data.countryPhoneCode} ${data.contactPhone}`} required={false} />
        <Item label="Country" value={data.country} />
        <Item label="City" value={data.city} required={false} />
        <div className="sm:col-span-2">
          <Item label="Address" value={data.address} required={false} />
        </div>
      </Section>

      <Section title="Documents" onEdit={() => setCurrentStep(2)}
        disabled={isLoading}
      >
        <FileItem
          label="Company Logo"
          file={data?.logo}
          existingFileUrl={watch('deleteLogo') ? null : existingCompany?.logo}
          required={false}
        />
        <FileItem
          label="Business Document"
          file={data.businessDocument}
          existingFileUrl={existingCompany?.businessDocument}
          required
        />
        <FileItem
          label="Tax Document"
          file={data.taxDocument}
          existingFileUrl={existingCompany?.taxDocument}
          required={false}
        />
      </Section>
    </div>
  )
}

export default Step4Review