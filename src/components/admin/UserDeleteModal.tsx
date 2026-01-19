import React from 'react'
import Modal from '../ui/Modal'
import { Spinner } from '../elements/Loader'

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
          <button
            onClick={() => setDeleteUserId(null)}
            className="px-4 py-2 rounded-xl border border-border/40 text-sm hover:bg-muted/40"
          >
            Cancel
          </button>

          <button
            onClick={handleDelete}
            disabled={loadingAction === `delete-${deleteUserId}`}
            className="px-4 py-2 rounded-xl bg-destructive text-destructive-foreground text-sm hover:opacity-90 disabled:opacity-70"
          >
            {loadingAction === `delete-${deleteUserId}` ? (
              'Deleting...'
            ) : (
              'Delete'
            )}
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default UserDeleteModal