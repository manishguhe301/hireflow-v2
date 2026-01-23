'use client'

import React from 'react'
import { UseFormWatch } from 'react-hook-form'
import { ProfileFormInputs } from './ProfileSetup'
import { Pencil } from 'lucide-react'
import clsx from 'clsx'

type Props = {
  watch: UseFormWatch<ProfileFormInputs>
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>
}

const Section = ({
  title,
  onEdit,
  children,
}: {
  title: string
  onEdit: () => void
  children: React.ReactNode
}) => {
  return (
    <div className="rounded-2xl border border-border/40 bg-card p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold">{title}</h3>
        <button
          type="button"
          onClick={onEdit}
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
      'font-medium',
      !value && required && 'text-red-500',
      !value && !required && 'text-muted-foreground'
    )}>
      {value || (required ? 'Required' : '—')}
    </p>
  </div>
)

const FileItem = ({ label, file }: { label: string; file?: File | null }) => (
  <div>
    <p className="text-xs text-muted-foreground">{label}</p>
    <p className="font-medium truncate">
      {file?.name || 'Not uploaded'}
    </p>
  </div>
)

const Step4Review = ({ watch, setCurrentStep }: Props) => {
  const data = watch()

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold tracking-tight">
          Review & Submit
        </h2>
        <p className="text-sm text-muted-foreground">
          Review your information before submitting. You can edit any section.
        </p>
      </div>

      <Section title="Company Basics" onEdit={() => setCurrentStep(0)}>
        <Item label="Company Name" value={data.name} />
        <Item label="Founded Year" value={data.foundedYear} />
        <Item label="Industry" value={data.industry} />
        <Item label="Company Size" value={data.companySize} />
        <Item label="Website" value={data.website} />
        <Item label="LinkedIn" value={data.linkedinProfile}
          required={false} />
        <div className="sm:col-span-2">
          <Item label="Description" value={data.description} />
        </div>
      </Section>

      <Section title="Contact Information" onEdit={() => setCurrentStep(1)}>
        <Item label="Contact Email" value={data.contactEmail} />
        <Item label="Contact Phone" value={data.contactPhone} required={false} />
        <Item label="Country" value={data.location} />
        <div className="sm:col-span-2">
          <Item label="Address" value={data.address} required={false} />
        </div>
      </Section>

      <Section title="Documents" onEdit={() => setCurrentStep(2)}>
        <FileItem label="Company Logo" file={data.logo} />
        <FileItem label="Business Document" file={data.businessDocument} />
        <FileItem label="Tax Document" file={data.taxDocument} />
      </Section>
    </div>
  )
}

export default Step4Review
