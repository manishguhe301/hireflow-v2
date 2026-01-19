import { Spinner } from "../elements/Loader"
import Modal from "../ui/Modal"

type DeleteCompanyModalProps = {
  deleteCompanyId: string | null,
  setDeleteCompanyId: React.Dispatch<React.SetStateAction<string | null>>,
  handleDelete: () => Promise<void>,
  loadingAction: string | null
}

const DeleteCompanyModal = ({
  deleteCompanyId,
  setDeleteCompanyId,
  handleDelete,
  loadingAction
}: DeleteCompanyModalProps) => {
  return (
    <Modal
      open={!!deleteCompanyId}
      onClose={() => setDeleteCompanyId(null)}
      className="max-w-md"
    >
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">
          Delete company?
        </h3>

        <p className="text-sm text-muted-foreground">
          This action is irreversible. The company and all related data will be permanently removed.
        </p>

        <div className="flex justify-end gap-3 pt-4">
          <button
            onClick={() => setDeleteCompanyId(null)}
            className="px-4 py-2 rounded-xl border border-border/40 text-sm hover:bg-muted/40"
          >
            Cancel
          </button>

          <button
            onClick={handleDelete}
            disabled={loadingAction === `delete-${deleteCompanyId}`}
            className="px-4 py-2 rounded-xl bg-destructive text-destructive-foreground text-sm hover:opacity-90 disabled:opacity-70"
          >
            {loadingAction === `delete-${deleteCompanyId}` ? (
              <Spinner className="h-4 w-4" />
            ) : (
              'Delete'
            )}
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default DeleteCompanyModal