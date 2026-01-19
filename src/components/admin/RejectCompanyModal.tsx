import { Spinner } from "../elements/Loader"
import { Button } from "../ui/Button"
import Modal from "../ui/Modal"

type RejectCompanyModalProps = {
  rejectCompanyId: string | null
  setRejectCompanyId: React.Dispatch<React.SetStateAction<string | null>>
  rejectReason: string
  setRejectReason: React.Dispatch<React.SetStateAction<string>>
  onReject: (id: string, reason: string) => Promise<void>
  loadingAction: string | null
}

const RejectCompanyModal = ({
  rejectCompanyId,
  setRejectCompanyId,
  rejectReason,
  setRejectReason,
  onReject,
  loadingAction,
}: RejectCompanyModalProps) => {
  const isLoading = loadingAction === `reject-${rejectCompanyId}`
  const isOpen = Boolean(rejectCompanyId)

  return (
    <Modal
      open={isOpen}
      onClose={() => {
        setRejectCompanyId(null)
        setRejectReason('')
      }}
      className="max-w-md"
    >
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">
          Reject company?
        </h3>

        <p className="text-sm text-muted-foreground">
          Please provide a clear reason for rejection. This will be visible to the company.
        </p>

        <textarea
          value={rejectReason}
          onChange={(e) => setRejectReason(e.target.value)}
          placeholder="Enter rejection reason..."
          rows={4}
          className="w-full rounded-xl border border-border/40 bg-background px-3 py-2 text-sm outline-none focus:border-primary/40 resize-none"
        />

        <div className="flex justify-end gap-3 pt-4">
          <Button
            onClick={() => {
              setRejectCompanyId(null)
              setRejectReason('')
            }}
            className="px-4! py-2! rounded-xl! w-full "
          >
            Cancel
          </Button>

          <Button
            disabled={!rejectReason.trim() || isLoading}
            onClick={() =>
              rejectCompanyId && onReject(rejectCompanyId, rejectReason)
            }
            className="px-4! py-2! rounded-xl bg-red-500 text-white hover:opacity-90 disabled:opacity-50 w-full border-red-500"
          >
            {isLoading ? <Spinner className="h-4 w-4" /> : 'Reject'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default RejectCompanyModal
