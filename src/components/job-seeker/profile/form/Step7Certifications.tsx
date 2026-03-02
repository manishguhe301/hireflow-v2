'use client'

import React, { useState } from 'react'
import { FieldErrors, UseFormRegister, UseFormSetValue, UseFormWatch } from 'react-hook-form'
import { CertificationInput, JobSeekerFormInputs } from './ProfileWizard'
import StepHeader from '@/src/components/ui/StepHeader'
import { Button } from '@/src/components/ui/Button'
import Modal from '@/src/components/ui/Modal'
import { Award, Edit, Plus, Trash2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { FormInput } from '@/src/components/ui/FormInput'
import FormDatePicker from '@/src/components/ui/FormDatePicker'
import { formatDate } from '@/src/utils/helper'

type CertificationForm = {
  name: string
  organization: string
  issueDate: Date
  expiryDate: Date | null
  credentialUrl: string | null
  credentialId: string | null
}

const Step7Certifications = ({
  watch,
  setValue, disabled
}: {
  register: UseFormRegister<JobSeekerFormInputs>
  errors: FieldErrors<JobSeekerFormInputs>
  watch: UseFormWatch<JobSeekerFormInputs>
  setValue: UseFormSetValue<JobSeekerFormInputs>
  disabled?: boolean
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)

  const certifications = watch('certifications') || []

  const {
    register: certRegister,
    handleSubmit: handleCertSubmit,
    formState: { errors: certErrors },
    reset: resetCertForm,
    watch: certWatch,
    setValue: setCertValue,
  } = useForm<CertificationForm>({
    defaultValues: {
      name: '',
      organization: '',
      issueDate: new Date(),
      expiryDate: null,
      credentialUrl: null,
      credentialId: null,
    },
  })

  const handleOpenModal = (index?: number) => {
    if (index !== undefined) {
      const cert = certifications[index]
      setEditingIndex(index)
      resetCertForm({
        ...cert,
        issueDate: new Date(cert.issueDate),
        expiryDate: cert.expiryDate ? new Date(cert.expiryDate) : null,
      })
    } else {
      setEditingIndex(null)
      resetCertForm({
        name: '',
        organization: '',
        issueDate: new Date(),
        expiryDate: null,
        credentialUrl: null,
        credentialId: null,
      })
    }

    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingIndex(null)
    resetCertForm()
  }

  const onSubmit = (data: CertificationForm) => {
    if (data.expiryDate && data.expiryDate < data.issueDate) {
      toast.error('Expiry date cannot be before issue date')
      return
    }

    const newCertification: CertificationInput = {
      ...data,
      expiryDate: data.expiryDate || null,
      credentialUrl: data.credentialUrl || null,
      credentialId: data.credentialId || null,
    }

    if (editingIndex !== null) {
      const updated = [...certifications]
      updated[editingIndex] = newCertification
      setValue('certifications', updated, { shouldValidate: true, shouldDirty: true })
    } else {
      setValue('certifications', [...certifications, newCertification], {
        shouldValidate: true,
        shouldDirty: true,
      })
    }

    handleCloseModal()
  }

  const handleDelete = (index: number) => {
    const updated = certifications.filter((_, i) => i !== index)
    setValue('certifications', updated, { shouldValidate: true, shouldDirty: true })
  }

  return (
    <div className="space-y-8">
      <StepHeader
        heading="Your Certifications (Optional)"
        description="Add professional certifications to strengthen your credibility."
      />

      <Button
        type="button"
        onClick={() => handleOpenModal()}
        className="inline-flex items-center gap-2"
        disabled={disabled}
      >
        <Plus className="h-4 w-4" />
        Add Certification
      </Button>

      {certifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border/60 bg-muted/20 py-16 text-center">
          <Award className="h-12 w-12 text-muted-foreground" />
          <p className="mt-4 text-sm font-medium text-muted-foreground">
            No certifications added yet
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Click &quot;Add Certification&quot; to get started
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {certifications.map((cert, index) => (
            <div
              key={index}
              className="rounded-2xl border border-border/40 bg-card p-6 transition hover:border-border/60"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold break-words">
                    {cert.name}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground break-words">
                    {cert.organization}
                  </p>

                  <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
                    <span className="rounded-full border border-border/40 bg-muted/30 px-2 py-1">
                      Issued: {formatDate(cert.issueDate)}
                    </span>

                    {cert.expiryDate && (
                      <span className="rounded-full border border-border/40 bg-muted/30 px-2 py-1">
                        Expires: {formatDate(cert.expiryDate)}
                      </span>
                    )}

                    {cert.credentialId && (
                      <span className="rounded-full border border-border/40 bg-muted/30 px-2 py-1">
                        ID: {cert.credentialId}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 self-start sm:self-auto">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => handleOpenModal(index)}
                    disabled={disabled}
                    className="p-2!"
                  >
                    <Edit className="h-4 w-4 text-primary" />
                  </Button>
                  <Button
                    type="button"
                    disabled={disabled}
                    variant="ghost"
                    onClick={() => handleDelete(index)}
                    className="p-2!"
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={isModalOpen} onClose={handleCloseModal} className="max-w-2xl max-sm:h-[70vh] overflow-y-scroll">
        <h2 className="text-xl font-semibold mb-6">
          {editingIndex !== null ? 'Edit Certification' : 'Add Certification'}
        </h2>

        <form onSubmit={handleCertSubmit(onSubmit)} className="space-y-6">
          <FormInput
            disabled={disabled}
            label="Certification Name"
            register={certRegister('name', {
              required: 'Certification name is required',
            })}
            error={certErrors.name}
          />

          <FormInput
            disabled={disabled}
            label="Issuing Organization"
            register={certRegister('organization', {
              required: 'Organization is required',
            })}
            error={certErrors.organization}
          />

          <FormDatePicker
            disabled={disabled}
            label="Issue Date"
            value={certWatch('issueDate')}
            maxDate={new Date()}
            onChange={(date) =>
              setCertValue('issueDate', date!, { shouldValidate: true })
            }
            error={certErrors.issueDate}
          />

          <FormDatePicker
            disabled={disabled}
            label="Expiry Date (Optional)"
            value={certWatch('expiryDate')}
            minDate={certWatch('issueDate')}
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
            disabled={disabled}
            error={certErrors.credentialId}
          />

          <FormInput
            label="Credential URL (Optional)"
            register={certRegister('credentialUrl')}
            disabled={disabled}
            error={certErrors.credentialUrl}
          />

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={handleCloseModal}
              disabled={disabled}
            >
              Cancel
            </Button>
            <Button type="submit"
              disabled={disabled}
            >
              {editingIndex !== null ? 'Update' : 'Add'} Certification
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default Step7Certifications
