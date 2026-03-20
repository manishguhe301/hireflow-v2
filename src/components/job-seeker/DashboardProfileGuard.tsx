'use client'

import { useProfile } from '@/src/store/hooks/useProfile'
import React from 'react'
import { StateWrapper } from '../company/CompanyProfileGuard'
import { CircleUserRound, AlertTriangle } from 'lucide-react'
import Link from 'next/link'
import { Button } from '../ui/Button'
import PageLoader from '../ui/PageLoader'

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

      <Link href="/dashboard/profile/form">
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
        Your profile is only {completion}% complete. To get discovered by companies, access jobs. Complete the profile to increase your chances of getting hired.
      </p>

      <div className="mt-6 w-full rounded-full bg-muted h-2">
        <div
          className="h-2 rounded-full bg-primary transition-all"
          style={{ width: `${completion}%` }}
        />
      </div>

      <Link href="/dashboard/profile/form">
        <Button className="mt-6 w-full">
          Complete Profile
        </Button>
      </Link>
    </StateWrapper>
  )
}

const DashboardProfileGuard = ({ children }: { children: React.ReactNode }) => {
  const { jobSeekerProfile, error, isLoading, isFetched } = useProfile()

  if (isLoading || !isFetched) {
    return (
      <PageLoader title="Setting things up for you" subtitle='Just a moment' />
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
        <Button variant='outline' className='mt-2'
          onClick={() => window.location.reload()}
        >
          Refresh
        </Button>
      </StateWrapper>
    )
  }

  if (!jobSeekerProfile) {
    return <NoProfileUI />
  }

  const completion = jobSeekerProfile.profileCompleted || 0

  const isCoreIncomplete =
    completion < 70 ||
    !jobSeekerProfile.resumeUrl ||
    jobSeekerProfile.skills.length === 0

  if (
    isCoreIncomplete
  ) {
    return (
      <IncompleteProfileUI
        completion={jobSeekerProfile.profileCompleted}
      />
    )
  }

  return <>
    {children}
  </>
}

export default DashboardProfileGuard
