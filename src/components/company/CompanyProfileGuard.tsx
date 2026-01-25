'use client'

import Link from 'next/link'
import { Spinner } from '@/src/components/elements/Loader'
import { useCompany } from '@/src/store/hooks/useCompany'
import { Button } from '../ui/Button'
import { Company } from '@prisma/client'

function StateWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-border/40 bg-card p-8 text-center shadow-sm">
        {children}
      </div>
    </div>
  )
}

export function NoCompanyUI() {
  return (
    <StateWrapper>
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-warning/15 text-warning">
        🏢
      </div>

      <h3 className="text-xl font-semibold">
        Create Your Company Profile
      </h3>

      <p className="mt-2 text-sm text-muted-foreground">
        You need to create a company profile before posting jobs or receiving applications.
      </p>

      <Link href="/company/profile-setup">
        <Button className="mt-6 bg-warning text-warning-foreground w-full">
          Create Profile
        </Button>
      </Link>
    </StateWrapper>
  )
}

function PendingCompanyUI() {
  return (
    <StateWrapper>
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
        ⏳
      </div>

      <h3 className="text-xl font-semibold">
        Profile Under Review
      </h3>

      <p className="mt-2 text-sm text-muted-foreground">
        Your company profile has been submitted successfully and is currently
        being reviewed by our admin team.
      </p>

      <p className="mt-1 text-sm text-muted-foreground">
        You&apos;ll be notified once it&apos;s approved.
      </p>

      <Button className="mt-6 w-full" variant="outline" disabled>
        Awaiting Approval
      </Button>
    </StateWrapper>
  )
}

export function RejectedCompanyUI({ company }: { company: Company | null }) {
  return (
    <StateWrapper>
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/15 text-destructive">
        ❌
      </div>

      <h3 className="text-xl font-semibold text-destructive">
        Profile Rejected
      </h3>

      <p className="mt-2 text-sm text-muted-foreground">
        Your company profile needs some changes before it can be approved.
      </p>

      {company?.rejectionReason && (
        <div className="mt-4 rounded-xl border border-destructive/30 bg-background p-4 text-left">
          <p className="text-sm font-medium text-destructive">
            Reason provided by admin
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {company.rejectionReason}
          </p>
        </div>
      )}

      <Link href="/company/profile-setup">
        <Button variant="danger" className="mt-6 w-full">
          Fix & Resubmit Profile
        </Button>
      </Link>
    </StateWrapper>
  )
}

export default function CompanyProfileGuard({ children }: { children: React.ReactNode }) {
  const { company, error, isLoading } = useCompany()

  if (isLoading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <Spinner className="h-8 w-8" />
      </div>
    )
  }

  if (error) {
    return (
      <StateWrapper>
        <h3 className="text-lg font-semibold text-destructive">
          Something went wrong
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          {error}
        </p>
      </StateWrapper>
    )
  }

  if (!company) {
    return (
      <NoCompanyUI />
    )
  }

  if (company.status === 'PENDING') {
    return (
      <PendingCompanyUI />
    )
  }

  if (company.status === 'REJECTED') {
    return (
      <RejectedCompanyUI company={company} />
    )
  }

  return <>{children}</>
}
