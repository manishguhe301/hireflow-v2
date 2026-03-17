'use client'

import React from 'react'
import { UseFormWatch } from 'react-hook-form'
import { formatDate, formatSalary, getLabel, isRichTextEmpty } from '@/src/utils/helper'
import RichTextRenderer from '@/src/components/ui/RichTextRenderer'
import StepHeader from '@/src/components/ui/StepHeader'
import { employmentTypes, experienceLevels, jobCategories, jobSkills, workModes } from '@/src/utils/constants'
import Section from '@/src/components/shared/Section'
import Item from '@/src/components/shared/Item'
import { JobFormInputs } from '@/src/types'

type Props = {
  watch: UseFormWatch<JobFormInputs>
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>
  disabled: boolean
}

const Step5JobReview = ({ watch, setCurrentStep, disabled }: Props) => {
  const data = watch()

  return (
    <div className="space-y-8">
      <StepHeader
        heading='Review & Publish'
        description='Review all job details carefully. You can edit any section before publishing.'
      />

      <Section
        title="Basic Details"
        onEdit={() => setCurrentStep(0)}
        disabled={disabled}
      >
        <Item
          label="Job Title"
          value={data.title}
        />
        <Item
          label="Category"
          value={getLabel(jobCategories, data.category)}
        />
        <div className="sm:col-span-2">
          <p className="text-xs text-muted-foreground mb-1">Description</p>
          <RichTextRenderer content={data.description} />
        </div>
        {data.responsibilities && (
          <div className="sm:col-span-2">
            <p className="text-xs text-muted-foreground mb-1">Responsibilities</p>
            {!isRichTextEmpty(data.responsibilities) ? <RichTextRenderer content={data.responsibilities} /> : <span>
              -
            </span>}
          </div>
        )}
      </Section>

      <Section
        title="Requirements & Skills"
        onEdit={() => setCurrentStep(1)}
        disabled={disabled}
      >
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

      <Section
        title="Location & Work Mode"
        onEdit={() => setCurrentStep(2)}
        disabled={disabled}
      >
        <Item
          label="Work Mode"
          value={getLabel(workModes, data.workMode)}
        />
        <Item
          label="Country"
          value={data.country}
        />
        {data.workMode !== 'REMOTE' && (
          <Item
            label="City"
            value={data.city} required={false}
          />
        )}
      </Section>

      <Section
        title="Salary & Openings"
        onEdit={() => setCurrentStep(3)}
        disabled={disabled}
      >
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
