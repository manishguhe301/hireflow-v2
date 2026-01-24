'use client'

import Link from 'next/link'
import { Spinner } from '@/src/components/elements/Loader'
import { useCompany } from '@/src/store/hooks/useCompany'
import { Button } from '../ui/Button'

export default function CompanyProfileGuard({ children }: { children: React.ReactNode }) {
  const {
    company,
    error,
    isLoading,
  } = useCompany()

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner className="h-8 w-8" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="mx-auto my-6 w-full rounded-2xl border border-destructive/30 bg-destructive/10 p-6 text-destructive">
        {error}
      </div>
    )
  }

  if (!company) {
    return (
      <div className='px-6 max-sm:px-4'>
        <div className="my-6 w-full space-y-4 rounded-2xl border border-warning/30 bg-warning/10 p-6 ">
          <h3 className="text-xl font-semibold">
            Complete Your Company Profile
          </h3>
          <p className="text-sm text-muted-foreground">
            Create your company profile to start posting jobs and receiving applications.
          </p>
          <Link href="/company/profile-setup">
            <Button className="bg-warning text-warning-foreground">
              Create Profile
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  if (company?.status === 'PENDING') {
    return (
      <div className="px-6 max-sm:px-4 my-6">
        <div className="rounded-2xl border border-primary/30 bg-primary/5 p-6 space-y-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
              ⏳
            </span>
            <h3 className="text-lg font-semibold">
              Profile Under Review
            </h3>
          </div>

          <p className="text-sm text-muted-foreground">
            Your company profile has been successfully submitted and is currently
            being reviewed by our admin team.
          </p>

          <p className="text-sm text-muted-foreground">
            This usually takes a short time. You’ll be notified once your profile
            is approved.
          </p>

          <div className="pt-2">
            <Button variant="outline" disabled>
              Approval Pending
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (company?.status === 'REJECTED') {
    return (
      <div className="px-6 max-sm:px-4 my-6">
        <div className=" rounded-2xl border border-destructive/30 bg-destructive/10 p-6 space-y-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-destructive/20 text-destructive">
              ❌
            </span>
            <h3 className="text-lg font-semibold text-destructive">
              Profile Rejected
            </h3>
          </div>

          <p className="text-sm text-muted-foreground">
            Your company profile was reviewed and needs some changes before it can
            be approved.
          </p>

          {company.rejectionReason && (
            <div className="rounded-xl border border-destructive/30 bg-background p-4">
              <p className="text-sm font-medium text-destructive">
                Reason for rejection
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {company.rejectionReason}
              </p>
            </div>
          )}

          <div className="flex items-center gap-3 pt-2">
            <Link href="/company/profile-setup">
              <Button variant="danger">
                Fix & Resubmit Profile
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
