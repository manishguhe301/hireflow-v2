import DashboardProfileGuard from '@/src/components/job-seeker/DashboardProfileGuard'
import Profile from '@/src/components/job-seeker/profile/Profile'
import React from 'react'

const ProfilePage = () => {
  return (
    <DashboardProfileGuard>
      <Profile />
    </DashboardProfileGuard>
  )
}

export default ProfilePage