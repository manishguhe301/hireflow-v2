'use client'

import { useEffect, useState } from 'react'
import { FieldErrors, UseFormRegister, UseFormSetValue, UseFormWatch } from 'react-hook-form'
import StepHeader from '@/src/components/ui/StepHeader'
import { Button } from '@/src/components/ui/Button'
import { Briefcase, Plus } from 'lucide-react'
import { WorkMode } from '@prisma/client'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { AppSdk } from '@/src/utils/AppSdk'
import { JobSeekerFormInputs, WorkExperienceForm, WorkExperienceInput } from '@/src/types'
import ExperienceModal from './ExperienceModal'
import ExperienceCard from './ExperienceCard'

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
      isPartTime: false,
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
        isPartTime: experience.isPartTime,
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
        isPartTime: false,
      })
    }
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingIndex(null)
    resetExpForm()
  }

  const checkExpOverLap = (data: WorkExperienceForm): {
    flag: boolean
    message: string
  } | undefined => {
    const isPartTime = data.isPartTime ?? false

    if (!isPartTime && data.startDate) {
      const newStart = data.startDate.getTime()
      const newEnd = data.isCurrent ? Infinity : data.endDate?.getTime() ?? Infinity

      const overlapping = workExperiences.find((exp, i) => {
        if (i === editingIndex) return false
        if (exp.isPartTime) return false
        const exStart = new Date(exp.startDate).getTime()
        const exEnd = exp.isCurrent || !exp.endDate ? Infinity : new Date(exp.endDate).getTime()
        return exStart < newEnd && exStart > -Infinity && newStart < exEnd
      })

      if (overlapping) {
        return {
          flag: true,
          message: `This role overlaps with your experience at ${overlapping.company}. Mark as part-time/freelance if they ran simultaneously.`
        }
      }
      return { flag: false, message: '' }
    }
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
      isPartTime: data.isPartTime
    }

    const overlapCheck = checkExpOverLap(data)

    if (overlapCheck && overlapCheck.flag) {
      toast.error(overlapCheck.message)
      return
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
            <ExperienceCard
              key={exp.id || index}
              watch={watch}
              isEditMode={isEditMode}
              exp={exp}
              refetchProfile={refetchProfile}
              setValue={setValue}
              index={index}
              disabled={disabled}
              handleOpenModal={handleOpenModal}
            />
          ))}
        </div>
      )}
      <ExperienceModal
        isModalOpen={isModalOpen}
        handleCloseModal={handleCloseModal}
        disabled={disabled || isSaving}
        isSaving={isSaving}
        editingIndex={editingIndex}
        expErrors={expErrors}
        expRegister={expRegister}
        expWatch={expWatch}
        onSubmit={onSubmit}
        handleExpSubmit={handleExpSubmit}
        setExpValue={setExpValue}
      />
    </div>
  )
}

export default Step3Experience