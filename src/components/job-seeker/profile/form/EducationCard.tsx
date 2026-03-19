import { Button } from '@/src/components/ui/Button'
import { EducationInput } from '@/src/types'
import { degrees, fieldOfStudies } from '@/src/utils/constants'
import { getLabel } from '@/src/utils/helper'
import { Edit, Loader2, Trash2 } from 'lucide-react'

const EducationCard = ({ edu, disabled, handleOpenModal, index, handleDelete, educations, deletingId }: {
  edu: EducationInput
  disabled: boolean
  handleOpenModal: (index?: number) => void
  index: number
  handleDelete: (index: number) => Promise<void>
  educations: EducationInput[]
  deletingId: string | null
}) => {
  return (
    <div
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
            disabled={disabled}
            aria-label="Edit"
          >
            <Edit className="h-4 w-4 text-primary" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={() => handleDelete(index)}
            className="p-2!"
            disabled={disabled || deletingId === educations[index].id}
            aria-label="Delete"
          >
            {deletingId === educations[index].id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4 text-destructive" />}
          </Button>
        </div>
      </div>
    </div>)
}

export default EducationCard