'use client'

import React, { useState } from 'react'
import { FieldErrors, UseFormRegister, UseFormSetValue, UseFormWatch } from 'react-hook-form'
import StepHeader from '@/src/components/ui/StepHeader'
import { Button } from '@/src/components/ui/Button'
import Modal from '@/src/components/ui/Modal'
import { GraduationCap, Edit, Plus, Trash2, Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { FormInput } from '@/src/components/ui/FormInput'
import { FormSelect } from '@/src/components/ui/FormSelect'
import { degrees, fieldOfStudies } from '@/src/utils/constants'
import { getLabel } from '@/src/utils/helper'
import { AppSdk } from '@/src/utils/AppSdk'
import { EducationInput, JobSeekerFormInputs } from '@/src/types'

const currentYear = new Date().getFullYear()

const Step4Education = ({
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
  const [isSaving, setIsSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const educations = watch('education') || []

  const {
    register: eduRegister,
    handleSubmit: handleEduSubmit,
    formState: { errors: eduErrors },
    reset: resetEduForm,
    watch: eduWatch,
  } = useForm<EducationInput>({
    defaultValues: {
      institution: '',
      degree: '',
      fieldOfStudy: null,
      startYear: null,
      endYear: null,
      grade: null,
      isCurrent: false,
    },
  })

  const isCurrent = eduWatch('isCurrent')

  const handleOpenModal = (index?: number) => {
    if (index !== undefined) {
      const edu = educations[index]
      setEditingIndex(index)
      resetEduForm(edu)
    } else {
      setEditingIndex(null)
      resetEduForm({
        institution: '',
        degree: '',
        fieldOfStudy: null, //optional
        startYear: undefined,
        endYear: null, //optional
        grade: null, //optional
        isCurrent: false,
      })
    }

    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingIndex(null)
    resetEduForm()
  }

  const onSubmit = async (data: EducationInput) => {
    if (!data.startYear) {
      toast.error('Start date is required')
      return
    }

    if (!data.isCurrent && data.endYear && data.endYear < data.startYear) {
      toast.error('End year must be after start year')
      return
    }

    if (!data.isCurrent && data.endYear && data.endYear === data.startYear) {
      toast.error('Start year and end year cannot be the same')
      return
    }

    if (!data.endYear && !data.isCurrent) {
      toast.error('Any one of End year or is current must be selected')
      return
    }

    const payload = {
      ...data,
      fieldOfStudy: data.fieldOfStudy || null,
      grade: data.grade || null,
      endYear: data.isCurrent ? null : data.endYear || null,
    }

    if (isEditMode) {
      setIsSaving(true)
      try {
        const editingItem = editingIndex !== null ? educations[editingIndex] : null
        let res

        if (editingItem?.id) {
          res = await AppSdk.patchData(`/api/profile/education/${editingItem.id}`, payload)
        } else {
          res = await AppSdk.postData('/api/profile/education', payload)
        }

        if (res.error) { toast.error(res.error); return }

        const saved: EducationInput = res.education

        if (editingIndex !== null) {
          const updated = [...educations]
          updated[editingIndex] = saved
          setValue('education', updated, { shouldValidate: true, shouldDirty: true })
        } else {
          setValue('education', [...educations, saved], { shouldValidate: true, shouldDirty: true })
        }

        await refetchProfile?.()
        toast.success(editingIndex !== null ? 'Education updated' : 'Education added')
        handleCloseModal()
      } catch {
        toast.error('Something went wrong')
      } finally {
        setIsSaving(false)
      }
      return
    }

    if (editingIndex !== null) {
      const updated = [...educations]
      updated[editingIndex] = payload
      setValue('education', updated, { shouldValidate: true, shouldDirty: true })
    } else {
      setValue('education', [...educations, payload], { shouldValidate: true, shouldDirty: true })
    }
    handleCloseModal()
  }

  const handleDelete = async (index: number) => {
    const item = educations[index]
    if (isEditMode && item.id) {
      setDeletingId(item.id)
      try {
        const res = await AppSdk.deleteData(`/api/profile/education/${item.id}`, null)
        if (res.error) { toast.error(res.error); return }
        await refetchProfile?.()
        toast.success('Education deleted')
      } catch (error) {
        console.log(error);
        toast.error('Something went wrong')
      } finally {
        setDeletingId(null)
      }
    }
    const updated = educations.filter((_, i) => i !== index)
    setValue('education', updated, { shouldValidate: true })
  }

  return (
    <div className="space-y-8">
      <StepHeader
        heading="Your Education (Optional)"
        description="Add your academic qualifications to strengthen your profile."
      />

      <Button
        type="button"
        onClick={() => handleOpenModal()}
        className="inline-flex items-center gap-2"
        disabled={disabled || isSaving}


      >
        <Plus className="h-4 w-4" />
        Add Education
      </Button>

      {educations.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border/60 bg-muted/20 py-16 text-center">
          <GraduationCap className="h-12 w-12 text-muted-foreground" />
          <p className="mt-4 text-sm font-medium text-muted-foreground">
            No education added yet
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Click &quot;Add Education&quot; to get started
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {educations.map((edu, index) => (
            <div
              key={edu.id || index}
              className="rounded-2xl border border-border/40 bg-card p-6 transition hover:border-border/60"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold break-words">
                    {getLabel(degrees, edu.degree)}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground break-words">
                    {edu.institution}
                  </p>

                  <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
                    {edu.fieldOfStudy && (
                      <span className="rounded-full border border-border/40 bg-muted/30 px-2 py-1">
                        {getLabel(fieldOfStudies, edu.fieldOfStudy)}
                      </span>
                    )}
                    <span className="rounded-full border border-border/40 bg-muted/30 px-2 py-1">
                      {edu.startYear} - {edu.isCurrent ? 'Present' : edu.endYear || 'N/A'}
                    </span>
                    {edu.grade && (
                      <span className="rounded-full border border-border/40 bg-muted/30 px-2 py-1">
                        Grade: {edu.grade}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 self-start sm:self-auto">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => handleOpenModal(index)}
                    className="p-2!"
                    disabled={disabled || isSaving}
                    aria-label="Edit"
                  >
                    <Edit className="h-4 w-4 text-primary" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => handleDelete(index)}
                    className="p-2!"
                    disabled={disabled || isSaving || deletingId === educations[index].id}
                    aria-label="Delete"
                  >
                    {deletingId === educations[index].id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4 text-destructive" />}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={isModalOpen} onClose={handleCloseModal} className="max-w-2xl max-sm:h-[70%] max-sm:overflow-y-scroll">
        <h2 className="text-xl font-semibold mb-6">
          {editingIndex !== null ? 'Edit Education' : 'Add Education'}
        </h2>

        <form onSubmit={handleEduSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormSelect
              label="Type of Degree"
              options={degrees}
              register={eduRegister('degree', {
                required: 'Degree is required',
              })}
              error={eduErrors.degree}
              disabled={disabled || isSaving}

            />
            <FormInput
              label="Institution"
              register={eduRegister('institution', { required: 'Institution is required' })}
              error={eduErrors.institution}
              disabled={disabled || isSaving}
            />
          </div>

          <FormSelect
            label="Field of Study "
            options={fieldOfStudies}
            register={eduRegister('fieldOfStudy', {
              required: 'Field of study is required',
            })}
            disabled={disabled || isSaving}
            error={eduErrors.fieldOfStudy}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              type="number"
              label="Start Year"
              disabled={disabled || isSaving}
              register={eduRegister('startYear', { required: true })}
              error={eduErrors.startYear}
              minLength={2000}
              maxLength={currentYear}
            />

            {!isCurrent && (
              <FormInput
                type="number"
                disabled={disabled || isSaving}
                label="End Year"
                register={eduRegister('endYear')}
                error={eduErrors.endYear}
                maxLength={currentYear}
                minLength={2000}
              />
            )}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isCurrentEdu"
              disabled={disabled || isSaving}
              {...eduRegister('isCurrent')}
              className="h-4 w-4 rounded border-border/40 accent-primary focus:ring-2 focus:ring-primary/30"
            />
            <label htmlFor="isCurrentEdu" className="text-sm font-medium">
              I am currently studying here
            </label>
          </div>

          <FormInput
            label="Grade (Optional)"
            register={eduRegister('grade')}
            error={eduErrors.grade}
            disabled={disabled || isSaving}
          />

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleCloseModal}
              disabled={disabled || isSaving}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={disabled || isSaving}
            >
              {
                isSaving ?
                  'Saving...' : editingIndex !== null
                    ? 'Update Education'
                    : 'Add Education'
              }
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default Step4Education
