import { degrees, fieldOfStudies } from '@/src/utils/constants'
import { getLabel } from '@/src/utils/helper'
import { Education } from '@prisma/client'

const EduCard = ({ edu }: { edu: Education }) => {
  return (
    <div key={edu.id} className='border-l-2 border-primary/40 pl-4'>
      <h3 className="font-semibold">{getLabel(degrees, edu.degree)}
        {(edu.fieldOfStudy !== 'SECONDARY' && edu.fieldOfStudy !== 'HIGHER_SECONDARY')
          && ` - ${getLabel(fieldOfStudies, edu.fieldOfStudy)}`
        }
      </h3>
      <p className="text-sm text-muted-foreground">
        {edu.institution}
      </p>
      <p className="text-xs text-muted-foreground">
        {edu.startYear} — {!edu.isCurrent ? edu.endYear : 'Present'}
      </p>
    </div>)
}

export default EduCard