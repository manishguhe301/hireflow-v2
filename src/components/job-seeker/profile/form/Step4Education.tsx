'use client'

import { useState } from 'react'
import { FieldErrors, UseFormRegister, UseFormSetValue, UseFormWatch } from 'react-hook-form'
import StepHeader from '@/src/components/ui/StepHeader'
import { Button } from '@/src/components/ui/Button'
import { GraduationCap, Plus, } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { AppSdk } from '@/src/utils/AppSdk'
import { EducationInput, JobSeekerFormInputs } from '@/src/types'
import EducationModal from './EducationModal'
import EducationCard from './EducationCard'

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
            <EducationCard
              key={edu.id || index}
              disabled={disabled || isSaving}
              edu={edu}
              handleOpenModal={handleOpenModal}
              index={index}
              handleDelete={handleDelete}
              deletingId={deletingId}
              educations={educations}
            />
          ))}
        </div>
      )}

      <EducationModal
        isModalOpen={isModalOpen}
        handleCloseModal={handleCloseModal}
        disabled={disabled || isSaving}
        isSaving={isSaving}
        editingIndex={editingIndex}
        eduErrors={eduErrors}
        eduRegister={eduRegister}
        eduWatch={eduWatch}
        handleEduSubmit={handleEduSubmit}
        onSubmit={onSubmit}
      />
    </div>
  )
}

export default Step4Education
