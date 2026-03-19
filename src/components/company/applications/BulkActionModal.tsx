'use client'
import Modal from '../../ui/Modal'
import { Button } from '../../ui/Button'
import { Spinner } from '../../elements/Loader'
import { ApplicationStatus } from '@prisma/client'
import { getLabel } from '@/src/utils/helper'
import { APPLICATIONS_TABS } from '@/src/utils/constants'
import { Dispatch, SetStateAction } from 'react'

interface BulkActionModalProps {
  isBulkModalOpen: boolean
  setIsBulkModalOpen: Dispatch<SetStateAction<boolean>>
  setBulkRejectReason: Dispatch<SetStateAction<string>>
  bulkAction: 'update_status' | 'reject' | null
  selectedApplicants: string[]
  bulkStatus: "" | ApplicationStatus
  setBulkStatus: Dispatch<SetStateAction<"" | ApplicationStatus>>
  bulkRejectReason: string
  handleBulkAction: () => Promise<void>
  isBulkProcessing: boolean
}

const BulkActionModal = ({
  isBulkModalOpen,
  setIsBulkModalOpen,
  setBulkRejectReason,
  bulkAction,
  selectedApplicants,
  bulkStatus,
  setBulkStatus,
  bulkRejectReason,
  handleBulkAction,
  isBulkProcessing
}: BulkActionModalProps) => {

  return (
    <Modal
      open={isBulkModalOpen}
      onClose={() => {
        if (!isBulkProcessing) {
          setIsBulkModalOpen(false)
          setBulkRejectReason('')
        }
      }}
    >
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">
          {bulkAction === 'reject' ? 'Bulk Reject Applications' : 'Bulk Update Status'}
        </h3>

        <p className="text-sm text-muted-foreground">
          This action will update <span className="font-semibold">{selectedApplicants.length}</span> application
          {selectedApplicants.length > 1 ? 's' : ''}.
        </p>

        {bulkAction === 'update_status' && (
          <div>
            <label className="text-sm font-medium mb-2 block">New Status</label>
            <select
              value={bulkStatus}
              onChange={(e) => e.target.value !== 'APPLIED' && setBulkStatus(e.target.value as ApplicationStatus)}
              disabled={isBulkProcessing}
              className="w-full rounded-xl border border-border/60 bg-background px-4 py-3 text-sm outline-none focus:border-primary/40"
            >
              {Object.values(ApplicationStatus).filter(s => s !== 'REJECTED').map((status) => (
                <option
                  key={status}
                  value={status}
                  disabled={status === ApplicationStatus.APPLIED}
                >
                  {getLabel(APPLICATIONS_TABS, status)}
                </option>
              ))}
            </select>
          </div>
        )}

        {bulkAction === 'reject' && (
          <div>
            <label className="text-sm font-medium mb-2 block">Rejection Reason (Optional)</label>
            <textarea
              value={bulkRejectReason}
              onChange={(e) => setBulkRejectReason(e.target.value)}
              placeholder="Add internal notes..."
              rows={4}
              disabled={isBulkProcessing}
              className="w-full rounded-xl border border-border/60 bg-background px-4 py-3 text-sm outline-none focus:border-primary/40" />
          </div>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <Button
            variant="outline"
            onClick={() => setIsBulkModalOpen(false)}
            disabled={isBulkProcessing}
          >
            Cancel
          </Button>

          <Button
            variant={bulkAction === 'reject' ? 'danger' : 'primary'}
            onClick={handleBulkAction}
            disabled={isBulkProcessing}
          >
            {isBulkProcessing ? <Spinner className="h-4 w-4" /> : 'Confirm'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default BulkActionModal