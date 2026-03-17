'use client'

import React from 'react'
import { UseFormWatch } from 'react-hook-form'
import { useCompany } from '@/src/store/hooks/useCompany'
import StepHeader from '../../ui/StepHeader'
import { ProfileFormInputs } from '@/src/types'
import Section from '../../shared/Section'
import Item from '../../shared/Item'
import FileItem from './FileItem'

type Props = {
  watch: UseFormWatch<ProfileFormInputs>
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>
  isLoading: boolean
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
        <Item
          label="Company Name"
          value={data.name}
        />
        <Item
          label="Founded Year"
          value={data.foundedYear}
        />
        <Item
          label="Industry"
          value={data.industry}
        />
        <Item
          label="Company Size"
          value={data.companySize}
        />
        <Item
          label="Website"
          value={data.website}
        />
        <Item
          label="LinkedIn"
          value={data.linkedinProfile}
          required={false} />
        <div className="sm:col-span-2">
          <Item
            label="Description"
            value={data.description ||
              '-'}
          />
        </div>
      </Section>

      <Section title="Contact Information" onEdit={() => setCurrentStep(1)}
        disabled={isLoading}
      >
        <Item
          label="Contact Email"
          value={data.contactEmail}
        />
        <Item
          label="Contact Phone"
          value={data.contactPhone &&
            `${data.countryPhoneCode} ${data.contactPhone}`}
          required={false}
        />
        <Item
          label="Country"
          value={data.country}
        />
        <Item
          label="City"
          value={data.city}
          required={false}
        />
        <div className="sm:col-span-2">
          <Item
            label="Address"
            value={data.address}
            required={false} />
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