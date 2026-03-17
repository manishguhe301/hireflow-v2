'use client'

import React, { useState } from 'react'
import { FieldErrors, UseFormRegister, UseFormSetValue, UseFormWatch } from 'react-hook-form'
import StepHeader from '@/src/components/ui/StepHeader'
import { Button } from '@/src/components/ui/Button'
import { Award, Edit, Loader2, Plus, Trash2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { formatDate } from '@/src/utils/helper'
import { AppSdk } from '@/src/utils/AppSdk'
import { CertificationForm, CertificationInput, JobSeekerFormInputs } from '@/src/types'
import CertificateModal from './CertificateModal'

const Step7Certifications = ({
  watch,
  setValue,
  disabled,
  isEditMode,
  refetchProfile
}: {
  register: UseFormRegister<JobSeekerFormInputs>
  errors: FieldErrors<JobSeekerFormInputs>
  watch: UseFormWatch<JobSeekerFormInputs>
  setValue: UseFormSetValue<JobSeekerFormInputs>
  disabled?: boolean
  isEditMode?: boolean
  refetchProfile?: () => void
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const certifications = watch('certifications') || []
  const [isSaving, setIsSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

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
      issueDate: null,
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
        issueDate: null,
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

  const onSubmit = async (data: CertificationForm) => {
    if (!data.issueDate) {
      toast.error('Issue date is required')
      return
    }


    if (data.expiryDate && data.expiryDate <= data.issueDate) {
      toast.error('Expiry date must be after issue date')
      return
    }

    const payload: CertificationInput = {
      name: data.name,
      organization: data.organization,
      issueDate: data.issueDate as Date,
      expiryDate: data.expiryDate || null,
      credentialUrl: data.credentialUrl || null,
      credentialId: data.credentialId || null,
    }

    if (isEditMode) {
      setIsSaving(true)
      try {
        const editingItem = editingIndex !== null ? certifications[editingIndex] : null
        let res

        if (editingItem?.id) {
          res = await AppSdk.patchData(`/api/profile/certification/${editingItem.id}`, payload)
        } else {
          res = await AppSdk.postData('/api/profile/certification', payload)
        }

        if (res.error) { toast.error(res.error); return }

        const saved: CertificationInput = res.certification

        if (editingIndex !== null) {
          const updated = [...certifications]
          updated[editingIndex] = saved
          setValue('certifications', updated, { shouldValidate: true, shouldDirty: true })
        } else {
          setValue('certifications', [...certifications, saved], { shouldValidate: true, shouldDirty: true })
        }

        await refetchProfile?.()
        toast.success(editingIndex !== null ? 'Certification updated' : 'Certification added')
        handleCloseModal()
      } catch {
        toast.error('Something went wrong')
      } finally {
        setIsSaving(false)
      }
      return
    }

    if (editingIndex !== null) {
      const updated = [...certifications]
      updated[editingIndex] = payload
      setValue('certifications', updated, { shouldValidate: true, shouldDirty: true })
    } else {
      setValue('certifications', [...certifications, payload], { shouldValidate: true, shouldDirty: true })
    }
    handleCloseModal()
  }

  const handleDelete = async (index: number) => {
    const item = certifications[index]
    if (isEditMode && item.id) {
      setDeletingId(item.id)
      try {
        const res = await AppSdk.deleteData(`/api/profile/certification/${item.id}`, null)
        if (res.error) { toast.error(res.error); return }
        await refetchProfile?.()
        toast.success('Certification deleted')
      } catch (error) {
        console.log(error);
        toast.error('Something went wrong')
      } finally {
        setDeletingId(null)
      }
    }
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
        disabled={disabled || isSaving}
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
              key={cert.id || index}
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
                    disabled={disabled || isSaving}
                    className="p-2!"
                    aria-label="Edit certification"
                  >
                    <Edit className="h-4 w-4 text-primary" />
                  </Button>
                  <Button
                    type="button"
                    disabled={disabled || isSaving || deletingId === cert.id}
                    variant="ghost"
                    onClick={() => handleDelete(index)}
                    aria-label="Delete certification"
                    className="p-2!"
                  >
                    {deletingId === cert.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4 text-destructive" />}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <CertificateModal
        certErrors={certErrors}
        certRegister={certRegister}
        certWatch={certWatch}
        disabled={disabled || isSaving}
        isSaving={isSaving}
        editingIndex={editingIndex}
        handleCertSubmit={handleCertSubmit}
        handleCloseModal={handleCloseModal}
        isModalOpen={isModalOpen}
        onSubmit={onSubmit}
        setCertValue={setCertValue}
      />
    </div>
  )
}

export default Step7Certifications
