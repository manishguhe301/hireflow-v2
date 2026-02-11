'use client'

import { useProfile } from '@/src/store/hooks/useProfile'
import React from 'react'
import { Spinner } from '../elements/Loader'
import { StateWrapper } from '../company/CompanyProfileGuard'
import { CircleUserRound, AlertTriangle } from 'lucide-react'
import Link from 'next/link'
import { Button } from '../ui/Button'

function NoProfileUI() {
  return (
    <StateWrapper>
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-warning/15 text-warning">
        <CircleUserRound />
      </div>

      <h3 className="text-xl font-semibold">
        Create Your Professional Profile
      </h3>

      <p className="mt-2 text-sm text-muted-foreground">
        You need to create your profile before applying to jobs and getting discovered by companies.
      </p>

      <Link href="/dashboard/profile/setup">
        <Button className="mt-6 w-full bg-warning text-warning-foreground">
          Create Profile
        </Button>
      </Link>
    </StateWrapper>
  )
}

function IncompleteProfileUI({ completion }: { completion: number }) {
  return (
    <StateWrapper>
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-warning/15 text-warning">
        <AlertTriangle />
      </div>

      <h3 className="text-xl font-semibold">
        Complete Your Profile
      </h3>

      <p className="mt-2 text-sm text-muted-foreground">
        Your profile is only {completion}% complete. Complete it to increase your chances of getting hired.
      </p>

      <div className="mt-6 w-full rounded-full bg-muted h-2">
        <div
          className="h-2 rounded-full bg-primary transition-all"
          style={{ width: `${completion}%` }}
        />
      </div>

      <Link href="/dashboard/profile/edit">
        <Button className="mt-6 w-full">
          Complete Profile
        </Button>
      </Link>
    </StateWrapper>
  )
}

const DashboardProfileGuard = ({ children }: { children: React.ReactNode }) => {
  const { jobSeekerProfile, error, isLoading } = useProfile()

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

  if (!jobSeekerProfile) {
    return <NoProfileUI />
  }

  if (jobSeekerProfile.profileCompleted < 100) {
    return (
      <IncompleteProfileUI
        completion={jobSeekerProfile.profileCompleted}
      />
    )
  }

  return <>{children}</>
}

export default DashboardProfileGuard
