import { DeleteCompanyModalProps } from "@/src/types"
import { Spinner } from "../elements/Loader"
import { Button } from "../ui/Button"
import Modal from "../ui/Modal"

const DeleteCompanyModal = ({
  deleteCompanyId,
  setDeleteCompanyId,
  handleDelete,
  loadingAction,
  companyName
}: DeleteCompanyModalProps) => {
  return (
    <Modal
      open={!!deleteCompanyId}
      onClose={() =>
        !loadingAction &&
        setDeleteCompanyId(null)
      }
      className="max-w-md "
    >
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">
          Delete company?
        </h3>

        <p className="text-sm text-muted-foreground">
          Are you sure you want to delete <strong>{companyName}</strong>?  This action is irreversible. The company and all related data will be permanently removed.
        </p>

        <div className="flex justify-end gap-3 pt-4">
          <Button
            onClick={() => setDeleteCompanyId(null)}
            variant="ghost"
            className="px-4! py-2! rounded-xl w-full "
          >
            Cancel
          </Button>

          <Button
            onClick={handleDelete}
            variant="danger"
            disabled={loadingAction === `delete-${deleteCompanyId}`}
            className="px-4! py-2!  disabled:opacity-70 w-full"
          >
            {loadingAction === `delete-${deleteCompanyId}` ? (
              <Spinner className="h-4 w-4" />
            ) : (
              'Delete'
            )}
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default DeleteCompanyModal