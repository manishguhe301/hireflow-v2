import { formatDateRange } from '@/src/utils/helper'
import { WorkExperience } from '@prisma/client'

const Experience = ({ exp }: { exp: WorkExperience }) => {
  return (
    <div key={exp.id} className="border-l-2 border-primary/40 pl-4">
      <h3 className="font-semibold">{exp.title}</h3>
      <p className="text-sm text-muted-foreground">
        {exp.company} {exp.location && `• ${exp.location}`}
      </p>
      {exp.isPartTime && (
        <p className="text-sm text-muted-foreground">
          Part-time
        </p>
      )}
      <p className="text-xs text-muted-foreground mt-1">
        {formatDateRange(exp.startDate, exp.endDate, exp.isCurrent)}
      </p>
      {exp.description && (
        <p className="mt-2 text-sm text-muted-foreground">
          {exp.description}
        </p>
      )}
    </div>
  )
}

export default Experience