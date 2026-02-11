'use client'
import { useProfile } from '@/src/store/hooks/useProfile'
import React from 'react'

const ProfileSetupWizard = () => {
  const { jobSeekerProfile } = useProfile()
  return (
    <div>ProfileSetupWizard</div>
  )
}

export default ProfileSetupWizard