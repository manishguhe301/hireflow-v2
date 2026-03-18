'use client'
import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Building2 } from 'lucide-react'
import { Company } from '@prisma/client'
import { AppSdk } from '@/src/utils/AppSdk'
import { toast } from 'sonner'
import { Spinner } from '../elements/Loader'
import { Button } from '../ui/Button'
import { formatDate } from '@/src/utils/helper'
import { useQuery } from '@tanstack/react-query'
import CompanyDetailsSkeleton from '../skeletons/CompanyDetailsSkeleton'
import CompanyDetailsTopSection from '../shared/CompanyDetailsTopSection'
import CompanyiInfo from '../shared/CompanyiInfo'
import CompanyDocs from '../shared/CompanyDocs'
import { useAdminCompanyActions } from '@/src/store/hooks/useAdminCompanyActions'

const CompanyDetails = () => {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [rejectionReason, setRejectionReason] = useState('')
  const [loadingAction, setLoadingAction] = useState<string | null>(null)

  const { approve, reject, remove, } = useAdminCompanyActions({
    onDeleteSuccess: () => router.push('/admin/companies'),
    onSettled: () => {
      setLoadingAction(null)
      setRejectionReason('')
    },
  })

  const { data, isLoading } = useQuery({
    queryKey: ['admin-company', id],
    queryFn: async () => {
      const res = await AppSdk.getData(`/api/admin/companies/${id}`, null)

      if (!res?.company) {
        throw new Error('Company not found')
      }

      return res.company
    },
    staleTime: 1000 * 60 * 5,
  })

  const company: Company = data

  const handleApprove = async (id: string) => {
    setLoadingAction(`approve-${id}`)
    approve(id)
  }

  const handleReject = async (id: string, reason: string) => {
    if (!reason) {
      toast.error('Please provide a rejection reason')
      return
    }
    setLoadingAction(`reject-${id}`)

    reject(id, reason)
  }

  const handleDelete = async (deleteCompanyId: string) => {
    if (!deleteCompanyId) return

    setLoadingAction(`delete-${deleteCompanyId}`)

    remove(deleteCompanyId)
  }

  if (isLoading) {
    return (
      <CompanyDetailsSkeleton />
    )
  }


  if (!company) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-6">
        <div className="w-full max-w-md rounded-2xl border border-border/40 bg-card p-8 text-center space-y-4 shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-muted">
            <Building2 className="h-7 w-7 text-muted-foreground" />
          </div>

          <h2 className="text-xl font-semibold">Company not found</h2>
          <p className="text-sm text-muted-foreground">
            The company you’re looking for doesn’t exist or may have been removed.
          </p>

          <Button
            onClick={() => router.push('/admin/companies')}
            className="mt-2"
          >
            Back to Companies
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="md:p-8 p-4 space-y-10 max-w-5xl mx-auto animate-in fade-in duration-500 flex flex-col">
      <CompanyDetailsTopSection company={company} />
      <CompanyiInfo company={company} />
      <CompanyDocs
        paths={{
          businessDocPath: company.businessDocPath,
          taxDocPath: company.taxDocPath
        }}
        companyId={company.id}
      />

      {company.status !== 'REJECTED' && (
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Admin Actions</h2>

          {company.status === 'PENDING' && (
            <div className="max-w-xl space-y-4 rounded-2xl border border-border/40 bg-card p-6">
              <div>
                <label className="text-sm text-muted-foreground">
                  Rejection Reason (required if rejecting)
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Explain why this company is being rejected…"
                  className="mt-2 w-full rounded-xl border border-border/60 bg-background px-4 py-3 text-sm outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/30"
                  rows={4}
                />
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => handleApprove(company.id)}
                  disabled={loadingAction === `approve-${company.id}`}
                  className="bg-success text-success-foreground"
                >
                  {loadingAction === `approve-${company.id}`
                    ? 'Approving…'
                    : 'Approve Company'}
                </Button>

                <Button
                  variant="danger"
                  onClick={() => handleReject(company.id, rejectionReason)}
                  disabled={loadingAction === `reject-${company.id}`}
                >
                  {loadingAction === `reject-${company.id}`
                    ? 'Rejecting…'
                    : 'Reject Company'}
                </Button>
              </div>
            </div>
          )}

          {company.status === 'APPROVED' && (
            <div className="max-w-xl rounded-2xl border border-destructive/30 bg-destructive/10 p-6 space-y-3">
              <h3 className="text-sm font-semibold text-destructive">
                Danger Zone
              </h3>
              <p className="text-sm text-muted-foreground">
                Deleting an approved company is permanent and cannot be undone.
              </p>

              <Button
                variant="danger"
                onClick={() => handleDelete(company.id)}
                disabled={loadingAction === `delete-${company.id}`}
              >
                {loadingAction === `delete-${company.id}` ? (
                  <div className='flex flex-row gap-2'>
                    <span>Deleting…</span>
                    <Spinner className="h-4 w-4" />
                  </div>
                ) : 'Delete Company'}
              </Button>
            </div>
          )}
        </section>
      )}

      <section className="text-xs text-muted-foreground">
        Created at: {formatDate(company.createdAt)} •
        Last updated: {formatDate(company.updatedAt)}
      </section>
    </div>
  )
}

export default CompanyDetails
