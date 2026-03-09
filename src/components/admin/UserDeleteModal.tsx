import React from 'react'
import Modal from '../ui/Modal'
import { Spinner } from '../elements/Loader'
import { Button } from '../ui/Button'

type UserDeleteModalProps = {
  deleteUserId: string | null,
  setDeleteUserId: React.Dispatch<React.SetStateAction<string | null>>,
  handleDelete: () => Promise<void>,
  loadingAction: string | null
  deleteUserName: string
}

const UserDeleteModal = ({ deleteUserId, setDeleteUserId, handleDelete, loadingAction, deleteUserName }: UserDeleteModalProps) => {
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
          Are you sure you want to delete &#34;{deleteUserName}&#34;? This action cannot be undone. The user and all related data will be permanently removed.
        </p>

        <div className="flex justify-end gap-3 pt-4">
          <Button
            onClick={() => setDeleteUserId(null)}
            variant='outline'
            className=" px-4! py-2! rounded-xl w-full"
          >
            Cancel
          </Button>

          <Button
            variant='danger'
            onClick={handleDelete}
            disabled={loadingAction === `delete-${deleteUserId}`}
            className="px-4! py-2! border-none! rounded-xl  text-white disabled:opacity-70 w-full"
          >
            {loadingAction === `delete-${deleteUserId}` ? (
              <div className="flex items-center gap-2 justify-center">
                Deleting
                <Spinner className="h-4 w-4" />
              </div>
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