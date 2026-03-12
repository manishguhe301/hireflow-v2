'use client'

import React, { useEffect, useState } from 'react'
import { FieldErrors, UseFormRegister, UseFormSetValue, UseFormWatch } from 'react-hook-form'
import { JobSeekerFormInputs, WorkExperienceInput } from './ProfileWizard'
import StepHeader from '@/src/components/ui/StepHeader'
import { Button } from '@/src/components/ui/Button'
import Modal from '@/src/components/ui/Modal'
import FormDatePicker from '@/src/components/ui/FormDatePicker'
import { Briefcase, Edit, Loader2, Plus, Trash2 } from 'lucide-react'
import { WorkMode } from '@prisma/client'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { formatDate, getLabel } from '@/src/utils/helper'
import { FormSelect } from '@/src/components/ui/FormSelect'
import { FormInput } from '@/src/components/ui/FormInput'
import { FormTextarea } from '@/src/components/ui/FormTextarea'
import { workModes } from '@/src/utils/constants'
import { AppSdk } from '@/src/utils/AppSdk'

type WorkExperienceForm = {
  company: string
  title: string
  location: string | null
  workMode: WorkMode | null
  startDate: Date | null
  endDate: Date | null
  description: string | null
  isCurrent: boolean
}

const Step3Experience = ({
  watch,
  setValue,
  disabled,
  isEditMode,
  refetchProfile
}: {
  register: UseFormRegister<JobSeekerFormInputs>
  errors: FieldErrors<JobSeekerFormInputs>
  watch: UseFormWatch<JobSeekerFormInputs>
  disabled?: boolean
  setValue: UseFormSetValue<JobSeekerFormInputs>
  isEditMode?: boolean
  refetchProfile?: () => void
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [deletingItemId, setDeletingItemId] = useState<string | null>(null)

  const workExperiences = watch('workExperience') || []

  const {
    register: expRegister,
    handleSubmit: handleExpSubmit,
    formState: { errors: expErrors },
    reset: resetExpForm,
    watch: expWatch,
    setValue: setExpValue,
  } = useForm<WorkExperienceForm>({
    defaultValues: {
      company: '',
      title: '',
      location: null,
      workMode: null,
      startDate: null,
      endDate: null,
      description: null,
      isCurrent: false,
    },
  })

  const isCurrent = expWatch('isCurrent')

  const handleOpenModal = (index?: number) => {
    if (index !== undefined && index !== null) {
      const experience = workExperiences[index]
      setEditingIndex(index)
      resetExpForm({
        company: experience.company,
        title: experience.title,
        location: experience.location ?? null,
        workMode: experience.workMode,
        startDate: new Date(experience.startDate),
        endDate: experience.endDate ? new Date(experience.endDate) : null,
        description: experience.description ?? null,
        isCurrent: experience.isCurrent,
      })
    } else {
      setEditingIndex(null)
      resetExpForm({
        company: '',
        title: '',
        location: null,
        workMode: null,
        startDate: null,
        endDate: null,
        description: null,
        isCurrent: false,
      })
    }
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingIndex(null)
    resetExpForm()
  }

  const onSubmit = async (data: WorkExperienceForm) => {
    if (!data.startDate) {
      toast.error('Start date is required')
      return
    }

    if (!data.workMode) {
      toast.error('Work mode is required')
      return
    }

    if (!data.isCurrent && !data.endDate) {
      toast.error('Please provide an end date or mark the job as currently working')
      return
    }

    if (data.isCurrent && data.endDate) {
      toast.error('End date should be empty if you are currently working here')
      return
    }

    if (!data.isCurrent && data.endDate && data.endDate <= data.startDate) {
      toast.error('End date must be after start date')
      return
    }

    const payload: WorkExperienceInput = {
      company: data.company,
      title: data.title,
      location: data.location || null,
      workMode: data.workMode as WorkMode,
      startDate: data.startDate as Date,
      endDate: data.isCurrent ? null : data.endDate || null,
      description: data.description || null,
      isCurrent: data.isCurrent,
    }

    if (isEditMode) {
      setIsSaving(true)
      try {
        const editingItem = editingIndex !== null ? workExperiences[editingIndex] : null
        let res

        if (editingItem?.id) {
          res = await AppSdk.patchData(`/api/profile/experience/${editingItem.id}`, payload)
        } else {
          res = await AppSdk.postData('/api/profile/experience', payload)
        }

        if (res.error) {
          toast.error(res.error)
          return
        }

        const saved: WorkExperienceInput = res.experience

        if (editingIndex !== null) {
          const updated = [...workExperiences]
          updated[editingIndex] = saved
          setValue('workExperience', updated, { shouldValidate: true })
        } else {
          setValue('workExperience', [...workExperiences, saved], { shouldValidate: true })
        }

        toast.success(editingIndex !== null ? 'Experience updated' : 'Experience added')
        await refetchProfile?.()
        handleCloseModal()
      } catch {
        toast.error('Something went wrong')
      } finally {
        setIsSaving(false)
      }
      return
    }

    if (editingIndex !== null) {
      const updated = [...workExperiences]
      updated[editingIndex] = payload
      setValue('workExperience', updated, { shouldValidate: true })
    } else {
      setValue('workExperience', [...workExperiences, payload], { shouldValidate: true })
    }

    handleCloseModal()
  }

  const handleDelete = async (index: number) => {
    const item = workExperiences[index]

    if (isEditMode && item.id) {
      setDeletingItemId(item.id as string)
      try {
        const res = await AppSdk.deleteData(`/api/profile/experience/${item.id}`, null)
        if (res.error) {
          toast.error(res.error)
          return
        }
        await refetchProfile?.()
        toast.success('Experience deleted')
      } catch (error) {
        toast.error('Something went wrong')
        console.error(error)
      } finally {
        setDeletingItemId(null)
      }
    }

    const updated = workExperiences.filter((_, i) => i !== index)
    setValue('workExperience', updated, { shouldValidate: true })

  }

  useEffect(() => {
    if (isCurrent) {
      setExpValue('endDate', null)
    }
  }, [isCurrent, setExpValue])

  return (
    <div className="space-y-8">
      <StepHeader
        heading="Your Work Experience (Optional)"
        description="Add your professional work experience to help employers understand your background."
      />
      <div className="flex justify-between items-start gap-4 flex-col sm:flex-row sm:items-center">
        <Button
          type="button"
          onClick={() => handleOpenModal()}
          className="inline-flex items-center gap-2"
          disabled={disabled}
        >
          <Plus className="h-4 w-4" />
          Add Experience
        </Button>
      </div>
      {workExperiences.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border/60 bg-muted/20 py-16 text-center">
          <Briefcase className="h-12 w-12 text-muted-foreground" />
          <p className="mt-4 text-sm font-medium text-muted-foreground">
            No work experience added yet
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Click &quot;Add Work Experience&quot; to get started
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {workExperiences.map((exp, index) => (
            <div
              key={exp.id || index}
              className="rounded-2xl border border-border/40 bg-card p-6 transition hover:border-border/60 max-sm:w-full"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold break-words">{exp.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground break-words">
                    {exp.company}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1 rounded-full border border-border/40 bg-muted/30 px-2 py-1 break-all">
                      {getLabel(workModes, exp.workMode)}
                    </span>
                    {exp.location && (
                      <span className="inline-flex items-center gap-1 rounded-full border border-border/40 bg-muted/30 px-2 py-1 break-all">
                        {exp.location}
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1 break-all">
                      {formatDate(exp.startDate)} — {exp.isCurrent ? 'Present' : exp.endDate ? formatDate(exp.endDate) : 'N/A'}
                    </span>
                  </div>
                  {exp.description && (
                    <p className="mt-3 text-sm text-muted-foreground line-clamp-3 break-words">
                      {exp.description}
                    </p>
                  )}
                </div>
                <div className="flex gap-2 self-start sm:self-auto">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => handleOpenModal(index)}
                    disabled={disabled}
                    aria-label="Edit work experience"
                    className="p-2!"
                  >
                    <Edit className="h-4 w-4 text-primary" />
                  </Button>
                  <Button
                    type="button"
                    disabled={disabled || deletingItemId === exp.id}
                    variant="ghost"
                    onClick={() => handleDelete(index)}
                    aria-label="Delete work experience"
                    className="p-2!"
                  >
                    {deletingItemId === exp.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4 text-destructive" />}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <Modal
        open={isModalOpen}
        onClose={handleCloseModal}
        className="max-w-3xl max-sm:max-h-[70%] max-sm:overflow-y-scroll "
      >
        <h2 className="text-xl font-semibold mb-6">
          {editingIndex !== null ? 'Edit Work Experience' : 'Add Work Experience'}
        </h2>
        <form
          onSubmit={handleExpSubmit(onSubmit)}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="Job Title"
              placeholder="e.g., Senior Frontend Developer"
              register={expRegister('title', {
                required: 'Job title is required',
                minLength: { value: 2, message: 'Title must be at least 2 characters' },
              })}
              error={expErrors.title}
              disabled={disabled || isSaving}
            />

            <FormInput
              label="Company"
              placeholder="e.g., Google"
              register={expRegister('company', {
                required: 'Company name is required',
                minLength: { value: 2, message: 'Company name must be at least 2 characters' },
              })}
              error={expErrors.company}
              disabled={disabled || isSaving}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="Location (Optional)"
              placeholder="e.g., San Francisco, CA"
              disabled={disabled || isSaving}
              register={expRegister('location')}
              error={expErrors.location}
            />
            <FormSelect
              disabled={disabled || isSaving}
              label="Work Mode"
              options={[{ value: '', label: 'Select work mode' }, ...workModes]}
              register={expRegister('workMode', { required: 'Work mode is required' })}
              error={expErrors.workMode}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormDatePicker
              disabled={disabled || isSaving}
              label="Start Date"
              value={expWatch('startDate')}
              maxDate={new Date()}
              onChange={(date) =>
                setExpValue('startDate', date ?? null, {
                  shouldValidate: true,
                })
              }
              error={expErrors.startDate}
            />

            {!isCurrent && (
              <FormDatePicker
                disabled={disabled || isSaving}
                label="End Date"
                value={expWatch('endDate')}
                minDate={
                  expWatch('startDate')
                    ? new Date(expWatch('startDate')!.getTime() + 86400000)
                    : undefined
                }
                maxDate={new Date()}
                onChange={(date) =>
                  setExpValue('endDate', date!, {
                    shouldValidate: true,
                  })}
                error={expErrors.endDate}
              />
            )}
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isCurrent"
              {...expRegister('isCurrent')}
              className="h-4 w-4 rounded border-border/40 accent-primary focus:ring-2 focus:ring-primary/30"
              aria-label="I currently work here"
              disabled={disabled || isSaving}
            />
            <label htmlFor="isCurrent" className="text-sm font-medium">
              I currently work here
            </label>
          </div>
          <FormTextarea
            disabled={disabled || isSaving}
            label="Description (Optional)"
            placeholder="Describe your role, responsibilities, and achievements..."
            rows={5}
            register={expRegister('description', {
              maxLength: { value: 500, message: 'Description must be less than 500 characters' },
            })}
            error={expErrors.description}
            maxLength={500}
          />

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleCloseModal}
              disabled={disabled || isSaving}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={disabled || isSaving}
            >
              {
                isSaving ?
                  'Saving...' : editingIndex !== null
                    ? 'Update Experience'
                    : 'Add Experience'
              }
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default Step3Experience