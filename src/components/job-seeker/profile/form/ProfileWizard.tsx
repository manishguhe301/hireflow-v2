'use client'

import { StateWrapper } from '@/src/components/company/CompanyProfileGuard'
import { Spinner } from '@/src/components/elements/Loader'
import { useProfile } from '@/src/store/hooks/useProfile'

const ProfileWizard = () => {
  const { jobSeekerProfile, isLoading, error } = useProfile()

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

  const mode = jobSeekerProfile ? 'edit' : 'create'

  return (
    <div>
      {mode === 'create' ? 'Create Profile' : 'Edit Profile'}
    </div>
  )
}

export default ProfileWizard
