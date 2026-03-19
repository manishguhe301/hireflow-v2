import React, { Dispatch, SetStateAction } from 'react'
import Modal from '../../ui/Modal'
import { Button } from '../../ui/Button'
import { Spinner } from '../../elements/Loader'
import { ApplicationStatus } from '@prisma/client'

const RejectApplicantModal = ({
  open,
  isPending,
  setIsRejectModalOpen,
  setInternalNotes,
  internalNotes,
  handleStatusChange,
  newStatus
}: {
  open: boolean,
  isPending: boolean,
  internalNotes: string,
  setIsRejectModalOpen: Dispatch<SetStateAction<boolean>>
  setInternalNotes: Dispatch<SetStateAction<string>>
  handleStatusChange: (status: ApplicationStatus, notes?: string) => Promise<void>
  newStatus: ApplicationStatus | null
}) => {
  return (
    <Modal
      open={open}
      onClose={() => {
        if (!isPending) {
          setIsRejectModalOpen(false)
          setInternalNotes('')
        }
      }}
    >
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Reject Application</h3>

        <textarea
          value={internalNotes}
          onChange={(e) => setInternalNotes(e.target.value)}
          placeholder="Add internal notes (optional)..."
          rows={4}
          className="w-full rounded-xl border border-border/60 bg-background px-4 py-3 text-sm outline-none focus:border-primary/40" />

        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => setIsRejectModalOpen(false)}
            disabled={isPending}
          >
            Cancel
          </Button>

          <Button
            variant="danger"
            disabled={isPending}
            onClick={() =>
              handleStatusChange(newStatus as ApplicationStatus, internalNotes)
            }
          >
            {isPending ? <Spinner className="h-4 w-4" /> : 'Reject'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default RejectApplicantModal