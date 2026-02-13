'use client'
import { useProfile } from '@/src/store/hooks/useProfile'
import React from 'react'

const Profile = () => {
  const { jobSeekerProfile } = useProfile()
  return (
    <div>Profile</div>
  )
}

export default Profile