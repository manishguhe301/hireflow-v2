import { Spinner } from "@/src/components/elements/Loader"
import { Button } from "@/src/components/ui/Button"
import Modal from "@/src/components/ui/Modal"

type DeleteJobModalProps = {
  deleteJobId: string | null
  setDeleteJobId: React.Dispatch<React.SetStateAction<string | null>>
  handleDelete: () => Promise<void>
  loadingAction: string | null
}

const DeleteJobModal = ({
  deleteJobId,
  setDeleteJobId,
  handleDelete,
  loadingAction
}: DeleteJobModalProps) => {
  return (
    <Modal
      open={!!deleteJobId}
      onClose={() => setDeleteJobId(null)}
      className="max-w-md"
    >
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">
          Delete Job?
        </h3>

        <p className="text-sm text-muted-foreground">
          This action cannot be undone. The job posting will be permanently removed.
          {' '}<span className="font-medium text-foreground">Note: Jobs with applications cannot be deleted.</span>
        </p>

        <div className="flex justify-end gap-3 pt-4">
          <Button
            onClick={() => setDeleteJobId(null)}
            variant="outline"
            className="px-4 py-2 rounded-xl w-full"
          >
            Cancel
          </Button>

          <Button
            onClick={handleDelete}
            variant="danger"
            disabled={loadingAction === `delete-${deleteJobId}`}
            className="px-4 py-2 disabled:opacity-70 w-full"
          >
            {loadingAction === `delete-${deleteJobId}` ? (
              <Spinner className="h-4 w-4" />
            ) : (
              'Delete Job'
            )}
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default DeleteJobModal