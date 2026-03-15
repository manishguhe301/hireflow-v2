import React, { Dispatch, SetStateAction } from 'react'
import { Button } from '../../ui/Button'
import { UserCheck, XCircle } from 'lucide-react'

interface SelectedApplicantsUIProps {
  selectedApplicantsLength: number
  setSelectedApplicants: Dispatch<SetStateAction<string[]>>
  setIsBulkModalOpen: Dispatch<SetStateAction<boolean>>
  setBulkAction: Dispatch<SetStateAction<"update_status" | "reject" | null>>
}

const SelectedApplicantsUI = ({
  selectedApplicantsLength,
  setSelectedApplicants,
  setIsBulkModalOpen,
  setBulkAction
}: SelectedApplicantsUIProps
) => {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-primary/40 bg-primary/5 px-4 py-3 max-sm:flex-col max-sm:items-start">
      <p className="text-sm font-semibold text-primary">
        {selectedApplicantsLength} applicant{selectedApplicantsLength > 1 ? 's' : ''} selected
      </p>

      <div className="flex gap-2 ml-auto max-sm:items-start max-sm:ml-0">
        <Button
          size="sm"
          variant="outline"
          className="flex items-center gap-1"
          onClick={() => {
            setBulkAction('update_status')
            setIsBulkModalOpen(true)
          }}
        >
          <UserCheck className="h-4 w-4" />
          Update Status
        </Button>

        <Button
          size="sm"
          variant="danger"
          className='flex items-center gap-1'
          onClick={() => {
            setBulkAction('reject')
            setIsBulkModalOpen(true)
          }}
        >
          <XCircle className="h-4 w-4" />
          Reject All
        </Button>

        <Button
          size="sm"
          variant="outline"
          onClick={() => setSelectedApplicants([])}
        >
          Clear Selection
        </Button>
      </div>
    </div>)
}

export default SelectedApplicantsUI