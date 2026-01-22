'use client'

import Link from 'next/link'
import { Spinner } from '@/src/components/elements/Loader'
import { useCompany } from '@/src/store/hooks/useCompany'

export default function CompanyProfileGuard({ children }: { children: React.ReactNode }) {
  const {
    exists,
    isComplete,
    company,
    completionPercentage,
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

  if (!exists) {
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
            <button className="rounded-xl bg-warning px-4 py-2 text-sm font-medium text-warning-foreground">
              Create Profile
            </button>
          </Link>
        </div>
      </div>
    )
  }

  if (!isComplete) {
    return (
      <div className='px-6 max-sm:px-4 my-6 max-sm:my-4'>
        <div className="space-y-6 ">
          <div className="mx-auto  rounded-2xl border border-primary/30 bg-primary/5 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">
                  Complete Your Profile
                </h3>
                <p className="text-sm text-muted-foreground">
                  Your profile is {completionPercentage}% complete.
                </p>
              </div>
              <span className="text-2xl font-bold text-primary">
                {completionPercentage}%
              </span>
            </div>

            <Link href="/company/profile-setup">
              <button className="mt-4 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
                Complete Profile
              </button>
            </Link>
          </div>

          <div className="mx-auto max-w-2xl">
            <h1 className="text-3xl font-bold">Company Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome, {company?.name}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
