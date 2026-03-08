import { ExistingHistory } from '../JobDetailsForApplicant'
import {
  CheckCircle,
  Circle,
  XCircle,
} from 'lucide-react'
import { APPLICATIONS_TABS, formatRelativeTime, getLabel } from '@/src/utils/helper'
import clsx from 'clsx'

const STATUS_FLOW = [
  'APPLIED',
  'REVIEWING',
  'SHORTLISTED',
  'INTERVIEW_SCHEDULED',
  'OFFERED',
  'HIRED',
  'REJECTED',
]

const ApplicationProgress = ({ existingApplication }: { existingApplication: ExistingHistory }) => {
  return (
    <div>
      <div className="border-t border-border/60 pt-4 space-y-4">
        <h4 className="text-sm font-semibold">Application Progress</h4>
        {existingApplication.status === 'REJECTED' && <p className="text-xs text-red-600 mt-2">
          This application was closed before moving to the next stage.
        </p>
        }
        <div className="relative pl-6">
          <div className="absolute left-2 top-0 bottom-0 w-px bg-border" />

          {STATUS_FLOW.map((status) => {
            const historyItem = existingApplication.statusHistory.find(
              (s) => s.status === status,
            )

            const isCompleted = !!historyItem

            return (
              <div
                key={status}
                className="relative flex items-start gap-3 pb-6 last:pb-0"
              >

                <div className="absolute -left-[9px] top-1">
                  {isCompleted ? (
                    status === 'REJECTED' ? (
                      <XCircle className="h-4 w-4 text-red-600" />
                    ) : (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    )
                  ) : (
                    <Circle className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>

                <div>
                  <p
                    className={clsx(
                      'text-sm font-medium pl-4',
                      isCompleted
                        ? status === 'REJECTED' ? 'text-red-600' : 'text-primary'
                        : 'text-muted-foreground',
                    )}
                  >
                    {getLabel(
                      APPLICATIONS_TABS,
                      status,
                    )}
                  </p>

                  {historyItem && (
                    <p className="text-xs text-muted-foreground mt-1 pl-4">
                      {formatRelativeTime(historyItem.date)}
                    </p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default ApplicationProgress