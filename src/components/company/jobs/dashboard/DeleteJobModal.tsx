import { Spinner } from "@/src/components/elements/Loader"
import { Button } from "@/src/components/ui/Button"
import Modal from "@/src/components/ui/Modal"

type DeleteJobModalProps = {
  deleteJobId: string | null
  setDeleteJobId: React.Dispatch<React.SetStateAction<string | null>>
  handleDelete: () => Promise<void>
  loadingAction: string | null
  jobTitle: string
}

const DeleteJobModal = ({
  deleteJobId,
  setDeleteJobId,
  handleDelete,
  loadingAction,
  jobTitle
}: DeleteJobModalProps) => {
  return (
    <Modal
      open={!!deleteJobId}
      onClose={() => !loadingAction && setDeleteJobId(null)}
      className="max-w-md"
    >
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">
          Delete Job?
        </h3>

        <div className="space-y-2 text-sm">
          <p className="text-muted-foreground">
            Are you sure you want to delete
            <span className="font-medium text-foreground">
              {' '}{jobTitle}
            </span>?  This action cannot be undone. The job posting will be permanently removed.
          </p>

          <p className="text-warning font-medium">
            Jobs with existing applications cannot be deleted.
          </p>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button
            onClick={() => setDeleteJobId(null)}
            variant="outline"
            disabled={loadingAction === `delete-${deleteJobId}`}
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
              <span className="flex items-center justify-center gap-2">
                Deleting
                <Spinner className="h-4 w-4" />
              </span>
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