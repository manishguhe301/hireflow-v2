'use client'
import { useProfile } from '@/src/store/hooks/useProfile'
import { Briefcase } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { Button } from '../../ui/Button'

const NoRecommendationUI = () => {
  const { jobSeekerProfile } = useProfile()
  return (
    <div className="text-center py-8 text-muted-foreground border border-border/60 rounded-xl">
      <Briefcase className="h-10 w-10 mx-auto mb-2 opacity-50" />
      <p className="text-sm font-medium">
        No recommendations yet
      </p>

      {jobSeekerProfile && jobSeekerProfile?.profileCompleted < 70 &&
        <>
          <p className="text-xs mt-1 text-muted-foreground">
            Complete your profile to improve job matches
          </p>

          <Link href="/dashboard/profile">
            <Button size="sm" className="mt-3">
              Complete Profile
            </Button>
          </Link>
        </>
      }
    </div>
  )
}

export default NoRecommendationUI