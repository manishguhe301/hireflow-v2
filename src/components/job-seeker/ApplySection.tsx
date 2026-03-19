'use client'
import { formatDate } from '@/src/utils/helper'
import React, { Dispatch, SetStateAction } from 'react'
import ApplicationProgress from './applications/ApplicationProgress'
import { Button } from '../ui/Button'
import { useRouter } from 'next/navigation'
import { Send } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { ExistingHistory } from '@/src/types'

const ApplySection = ({
  hasApplied,
  existingApplication,
  isDeadlinePassed,
  setIsApplyModalOpen
}: {
  hasApplied: boolean
  isDeadlinePassed: boolean
  existingApplication?: ExistingHistory | null
  setIsApplyModalOpen: Dispatch<SetStateAction<boolean>>
}) => {

  const { data: session } = useSession()
  const router = useRouter()
  return (
    <div className='flex flex-row items-center gap-4'>
      {hasApplied ? (
        <div className="space-y-3 w-full">
          <div className="w-full rounded-xl bg-green-500/10 border border-green-500/30 py-3 px-4 text-center">
            <p className="text-sm font-medium text-green-600 dark:text-green-400">
              ✓ Already Applied
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Applied on {formatDate(existingApplication?.createdAt || '')}
            </p>
          </div>

          {existingApplication && existingApplication?.statusHistory?.length > 0 && (
            <ApplicationProgress existingApplication={existingApplication} />
          )}


          <Button
            variant="outline"
            className="w-full"
            onClick={() => router.push('/dashboard/applications')}
          >
            View My Applications
          </Button>
        </div>
      ) :
        !isDeadlinePassed ? (
          <Button
            onClick={() => {
              if (!session?.user?.id) {
                router.push('/login')
                return
              }
              setIsApplyModalOpen(true)
            }}
            className="w-full rounded-xl py-3 flex items-center gap-2 justify-center"
            disabled={!session?.user?.id}
          >
            <Send size={20} />  Apply Now
          </Button>
        ) :
          <div className="w-full rounded-xl bg-red-500/10 border border-red-500/30 py-3 px-4 text-center">
            <p className="text-sm font-medium text-red-600 dark:text-red-400">
              Application Deadline Passed
            </p>
          </div>
      }
    </div>
  )
}

export default ApplySection