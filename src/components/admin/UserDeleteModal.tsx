import React from 'react'
import Modal from '../ui/Modal'
import { Spinner } from '../elements/Loader'
import { Button } from '../ui/Button'

type UserDeleteModalProps = {
  deleteUserId: string | null,
  setDeleteUserId: React.Dispatch<React.SetStateAction<string | null>>,
  handleDelete: () => Promise<void>,
  loadingAction: string | null
}

const UserDeleteModal = ({ deleteUserId, setDeleteUserId, handleDelete, loadingAction }: UserDeleteModalProps) => {
  return (
    <Modal
      open={!!deleteUserId}
      onClose={() => {
        if (!loadingAction) setDeleteUserId(null)
      }}
      className="max-w-md"
    >
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">
          Delete user?
        </h3>

        <p className="text-sm text-muted-foreground">
          This action cannot be undone. The user and all related data will be permanently removed.
        </p>

        <div className="flex justify-end gap-3 pt-4">
          <Button
            onClick={() => setDeleteUserId(null)}
            className=" px-4! py-2! rounded-xl w-full"
          >
            Cancel
          </Button>

          <Button
            onClick={handleDelete}
            disabled={loadingAction === `delete-${deleteUserId}`}
            className="px-4! py-2! border-none! rounded-xl bg-red-500 text-white  disabled:opacity-70 w-full "
          >
            {loadingAction === `delete-${deleteUserId}` ? (
              'Deleting...'
            ) : (
              'Delete'
            )}
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default UserDeleteModal