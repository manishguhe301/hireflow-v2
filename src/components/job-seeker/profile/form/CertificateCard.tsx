import { Button } from '@/src/components/ui/Button'
import { CertificationInput } from '@/src/types'
import { formatDate } from '@/src/utils/helper'
import { Edit, Loader2, Trash2 } from 'lucide-react'
import React from 'react'

const CertificateCard = ({
  cert,
  disabled,
  deletingId,
  handleDelete,
  handleOpenModal,
  index
}: {
  cert: CertificationInput
  disabled: boolean
  handleOpenModal: (index?: number) => void
  deletingId: string | null
  handleDelete: (index: number) => Promise<void>
  index: number
}) => {
  return (
    <div
      className="rounded-2xl border border-border/40 bg-card p-6 transition hover:border-border/60"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold break-words">
            {cert.name}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground break-words">
            {cert.organization}
          </p>

          <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
            <span className="rounded-full border border-border/40 bg-muted/30 px-2 py-1">
              Issued: {formatDate(cert.issueDate)}
            </span>

            {cert.expiryDate && (
              <span className="rounded-full border border-border/40 bg-muted/30 px-2 py-1">
                Expires: {formatDate(cert.expiryDate)}
              </span>
            )}

            {cert.credentialId && (
              <span className="rounded-full border border-border/40 bg-muted/30 px-2 py-1">
                ID: {cert.credentialId}
              </span>
            )}
          </div>
        </div>

        <div className="flex gap-2 self-start sm:self-auto">
          <Button
            type="button"
            variant="ghost"
            onClick={() => handleOpenModal(index)}
            disabled={disabled}
            className="p-2!"
            aria-label="Edit certification"
          >
            <Edit className="h-4 w-4 text-primary" />
          </Button>
          <Button
            type="button"
            disabled={disabled || deletingId === cert.id}
            variant="ghost"
            onClick={() => handleDelete(index)}
            aria-label="Delete certification"
            className="p-2!"
          >
            {deletingId === cert.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4 text-destructive" />}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default CertificateCard