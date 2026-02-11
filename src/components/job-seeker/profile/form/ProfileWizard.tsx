'use client'

import { Spinner } from '@/src/components/elements/Loader'
import { useProfile } from '@/src/store/hooks/useProfile'

const ProfileWizard = () => {
  const { jobSeekerProfile, isLoading } = useProfile()

  const mode = jobSeekerProfile ? 'edit' : 'create'

  if (isLoading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <Spinner className="h-8 w-8" />
      </div>
    )
  }
  return (
    <div>
      {mode === 'create' ? 'Create Profile' : 'Edit Profile'}
    </div>
  )
}

export default ProfileWizard
