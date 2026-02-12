'use client'

import React, { useState } from 'react'
import { FieldErrors, UseFormRegister, UseFormSetValue, UseFormWatch } from 'react-hook-form'
import { EducationInput, JobSeekerFormInputs } from './ProfileWizard'
import StepHeader from '@/src/components/ui/StepHeader'
import { Button } from '@/src/components/ui/Button'
import Modal from '@/src/components/ui/Modal'
import { GraduationCap, Edit, Plus, Trash2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { FormInput } from '@/src/components/ui/FormInput'
import { FormSelect } from '@/src/components/ui/FormSelect'
import { degrees, fieldOfStudies } from '@/src/utils/utils'
import { useSession } from 'next-auth/react'
import { getLabel } from '@/src/utils/helper'

const currentYear = new Date().getFullYear()

const Step4Education = ({
  watch,
  setValue,
}: {
  register: UseFormRegister<JobSeekerFormInputs>
  errors: FieldErrors<JobSeekerFormInputs>
  watch: UseFormWatch<JobSeekerFormInputs>
  setValue: UseFormSetValue<JobSeekerFormInputs>
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)

  const educations = watch('education') || []
  const { data: session } = useSession()

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
      startYear: currentYear,
      endYear: null,
      grade: null,
      isCurrent: false,
      profileId: session?.user.id || '',
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
        startYear: currentYear,
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

  const onSubmit = (data: EducationInput) => {
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

    const newEducation = {
      ...data,
      fieldOfStudy: data.fieldOfStudy || null,
      grade: data.grade || null,
      endYear: data.isCurrent ? null : data.endYear || null,
    }

    if (editingIndex !== null) {
      const updated = [...educations]
      updated[editingIndex] = newEducation
      setValue('education', updated, { shouldValidate: true, shouldDirty: true })
    } else {
      setValue('education', [...educations, newEducation], { shouldValidate: true, shouldDirty: true })
    }

    handleCloseModal()
  }

  const handleDelete = (index: number) => {
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
              key={index}
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
                  >
                    <Edit className="h-4 w-4 text-primary" />
                  </Button>
                  <Button
                    type="button"
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

      <Modal open={isModalOpen} onClose={handleCloseModal} className="max-w-2xl max-sm:h-[70%] max-sm:overflow-y-scroll">
        <h2 className="text-xl font-semibold mb-6">
          {editingIndex !== null ? 'Edit Education' : 'Add Education'}
        </h2>

        <form onSubmit={handleEduSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormSelect
              label="Degree"
              options={degrees}
              register={eduRegister('degree', {
                required: 'Degree is required',
              })}
              error={eduErrors.degree}
            />
            <FormInput
              label="Institution"
              register={eduRegister('institution', { required: 'Institution is required' })}
              error={eduErrors.institution}
            />
          </div>

          <FormSelect
            label="Field of Study "
            options={fieldOfStudies}
            register={eduRegister('fieldOfStudy', {
              required: 'Field of study is required',
            })}
            error={eduErrors.fieldOfStudy}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              type="number"
              label="Start Year"
              register={eduRegister('startYear', { required: true })}
              error={eduErrors.startYear}
              minLength={2000}
            />

            {!isCurrent && (
              <FormInput
                type="number"
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
          />

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button type="submit">
              {editingIndex !== null ? 'Update' : 'Add'} Education
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default Step4Education
