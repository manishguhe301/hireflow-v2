'use client'
import { AppSdk } from "@/src/utils/AppSdk"
import { useState } from "react"
import { toast } from "sonner"
import Modal from "../../ui/Modal"
import { Button } from "../../ui/Button"
import { Spinner } from "../../elements/Loader"
import { useMutation } from "@tanstack/react-query"

const WithdrawModal = ({
  isWithDrawModalOpen,
  id,
  onClose,
  onSuccess,
}: {
  isWithDrawModalOpen: boolean
  id: string | null
  onClose: () => void
  onSuccess: () => void
}) => {
  // const [isSubmitting, setIsSubmitting] = useState(false)

  const withdrawMutation = useMutation({
    mutationFn: async () => {
      if (!id) throw new Error('No application id')
      const res = await AppSdk.deleteData(`/api/applications/${id}/withdraw`, null)
      if (res.error) throw new Error(res.error)
      return res
    },
    onSuccess: () => {
      toast.success('Application withdrawn successfully')
      onSuccess()
      onClose()
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to withdraw application')
    },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!id) {
      toast.error('Failed to withdraw application')
      return
    }
    // setIsSubmitting(true)
    // try {
    //   const res = await AppSdk.deleteData(`/api/applications/${id}/withdraw`, null)

    //   if (res.error) {
    //     toast.error(res.error || 'Failed to withdraw application')
    //     return
    //   }

    //   toast.success('Application withdrawn successfully')
    //   fetchApplications(false)
    //   onClose()
    // } catch (error) {
    //   console.log(error)
    //   toast.error('Failed to withdraw application')
    // } finally {
    //   setIsSubmitting(false)
    // }
    withdrawMutation.mutate()
  }

  return (
    <Modal
      open={isWithDrawModalOpen}
      onClose={() => {
        if (!withdrawMutation.isPending) {
          onClose()
        }
      }}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold">Withdraw Application</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Are you sure you want to withdraw this application?
          </p>
        </div>
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-border/40">
          <Button
            type="button"
            variant="danger"
            onClick={onClose}
            className='w-full'
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={!id || withdrawMutation.isPending}
            className='w-full'
          >
            {withdrawMutation.isPending ?
              <Spinner className='w-4 h-4' />
              : 'Withdraw Application'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
export default WithdrawModal