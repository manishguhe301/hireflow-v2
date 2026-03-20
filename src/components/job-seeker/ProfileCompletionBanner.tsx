import { useProfile } from '@/src/store/hooks/useProfile'
import Link from 'next/link'
import React from 'react'
import { Button } from '../ui/Button'

const ProfileCompletionBanner = () => {
  const { jobSeekerProfile, error, isLoading, isFetched } = useProfile()

  if (!jobSeekerProfile) return null

  const completion = jobSeekerProfile.profileCompleted || 0

  return (
    completion < 100 && (
      <div className="m-6 rounded-2xl border border-warning/40 bg-warning/10 p-4 flex flex-row justify-between items-center max-sm:flex-col gap-2 ">
        <div>
          <p className="text-sm font-medium text-warning">
            Your profile is {completion}% complete.
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Complete your profile to increase visibility and improve hiring chances.
          </p>
        </div>
        <Link href="/dashboard/profile/form" className='max-sm:w-full'>
          <Button className="max-sm:w-full!" variant='outline'>
            Complete Profile
          </Button>
        </Link>
      </div>
    )
  )
}

export default ProfileCompletionBanner