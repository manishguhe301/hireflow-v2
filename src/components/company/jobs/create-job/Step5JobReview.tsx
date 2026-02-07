'use client'

import React from 'react'
import clsx from 'clsx'
import { Pencil } from 'lucide-react'
import { UseFormWatch } from 'react-hook-form'
import { JobFormInputs } from './CreateJobForm'
import { formatDate, formatSalary, getLabel } from '@/src/utils/helper'
import RichTextRenderer from '@/src/components/ui/RichTextRenderer'
import { employmentTypes, experienceLevels, jobCategories, jobSkills, workModes } from '@/src/utils/utils'
import StepHeader from '@/src/components/ui/StepHeader'

type Props = {
  watch: UseFormWatch<JobFormInputs>
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
  required = true,
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
    <p
      className={clsx(
        'font-medium whitespace-pre-wrap break-words',
        !value && required && 'text-red-500',
        !value && !required && 'text-muted-foreground'
      )}
    >
      {value || (required ? 'Required' : '—')}
    </p>
  </div>
)

const Step5JobReview = ({ watch, setCurrentStep }: Props) => {
  const data = watch()

  return (
    <div className="space-y-8">
      <StepHeader
        heading='Review & Publish'
        description='Review all job details carefully. You can edit any section before publishing.'
      />

      <Section title="Basic Details" onEdit={() => setCurrentStep(0)}>
        <Item label="Job Title" value={data.title} />
        <Item label="Category" value={getLabel(jobCategories, data.category)} />
        <div className="sm:col-span-2">
          <p className="text-xs text-muted-foreground mb-1">Description</p>
          <RichTextRenderer content={data.description} />
        </div>
        {data.responsibilities && (
          <div className="sm:col-span-2">
            <p className="text-xs text-muted-foreground mb-1">Responsibilities</p>
            <RichTextRenderer content={data.responsibilities} />
          </div>
        )}
      </Section>

      <Section title="Requirements & Skills" onEdit={() => setCurrentStep(1)}>
        <div className="sm:col-span-2">
          <p className="text-xs text-muted-foreground mb-1">Requirements</p>
          <RichTextRenderer content={data.requirements} />
        </div>
        <Item
          label="Experience Level"
          value={getLabel(experienceLevels, data.experienceLevel)}
        />
        <Item
          label="Employment Type"
          value={getLabel(employmentTypes, data.employmentType)}
        />
        <div className="sm:col-span-2">
          <Item
            label="Skills"
            value={data.skills
              ?.map((s) => getLabel(jobSkills, s))
              .join(', ')}
          />
        </div>
      </Section>

      <Section title="Location & Work Mode" onEdit={() => setCurrentStep(2)}>
        <Item
          label="Work Mode"
          value={getLabel(workModes, data.workMode)}
        />
        <Item label="Country" value={data.country} />
        {data.workMode !== 'REMOTE' && (
          <Item label="City" value={data.city} />
        )}
      </Section>

      <Section title="Salary & Openings" onEdit={() => setCurrentStep(3)}>
        <Item
          label="Salary Visibility"
          value={
            data.hideSalary
              ? 'Hidden to candidates' : 'Visible to candidates'
          }
        />
        <Item
          label="Salary Offered"
          value={formatSalary(data.salaryMin, data.salaryMax)}
          required={false}
        />
        <Item
          label="Number of Openings"
          value={String(data.numberOfOpenings)}
        />
        <Item
          label="Application Deadline"
          value={
            data.applicationDeadline
              ? formatDate(data.applicationDeadline)
              : 'No deadline'
          }
          required={false}
        />
      </Section>
    </div>
  )
}

export default Step5JobReview
