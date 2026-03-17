'use client'
import { Button } from '@/src/components/ui/Button'
import { JobSeekerFormInputs, WorkExperienceInput } from '@/src/types'
import { AppSdk } from '@/src/utils/AppSdk'
import { workModes } from '@/src/utils/constants'
import { formatDate, getLabel } from '@/src/utils/helper'
import { Edit, Loader2, Trash2 } from 'lucide-react'
import React, { useState } from 'react'
import { UseFormSetValue, UseFormWatch } from 'react-hook-form'
import { toast } from 'sonner'

const ExperienceCard = ({
  exp,
  watch,
  isEditMode,
  refetchProfile,
  setValue,
  index,
  disabled,
  handleOpenModal
}: {
  index: number
  exp: WorkExperienceInput
  watch: UseFormWatch<JobSeekerFormInputs>
  isEditMode: boolean | undefined
  refetchProfile: (() => void) | undefined
  setValue: UseFormSetValue<JobSeekerFormInputs>
  disabled?: boolean
  handleOpenModal: (index?: number) => void
}) => {
  const [deletingItemId, setDeletingItemId] = useState<string | null>(null)
  const workExperiences = watch('workExperience') || []


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

  return (
    <div
      className="rounded-2xl border border-border/40 bg-card p-6 transition hover:border-border/60 max-sm:w-full"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold break-words">{exp.title}</h3>
          <p className="mt-1 text-sm text-muted-foreground break-words">
            {exp.company}
          </p>
          <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
            {exp.isPartTime && (
              <span className="inline-flex items-center gap-1 rounded-full border border-border/40 bg-muted/30 px-2 py-1 break-all">
                Part-time
              </span>
            )}
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
            {deletingItemId === exp.id ?
              <Loader2 className="h-4 w-4 animate-spin" /> :
              <Trash2 className="h-4 w-4 text-destructive" />
            }
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ExperienceCard