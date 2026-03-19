'use client'
import { FullProfile } from '@/src/store/slices/job-seeker/userProfileSlice'
import { formatDate } from '@/src/utils/helper'
import { useSession } from 'next-auth/react'

const AdminMetadata = ({ profile }: {
  profile: FullProfile
}) => {
  const { data: session } = useSession()
  if (!session || session.user.role !== 'PLATFORM_ADMIN') return null
  return (
    <div className="rounded-2xl border border-border/40 bg-card p-6 space-y-4">
      <h2 className="text-lg font-semibold mb-4">Admin Metadata</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">

        <p>
          <span className="font-medium text-foreground">
            User ID:
          </span>
          {profile.userId}
        </p>
        <p>
          <span className="font-medium text-foreground">
            Profile Completion:
          </span>
          {profile.profileCompleted}%
        </p>
        <p>
          <span className="font-medium text-foreground">
            Visibility:
          </span>
          {profile.isPublic ? 'Public' : 'Private'}
        </p>

        <p>
          <span className="font-medium text-foreground">
            Created:
          </span>
          {formatDate(profile.createdAt)}
        </p>
        <p>
          <span className="font-medium text-foreground">
            Updated:
          </span>
          {formatDate(profile.updatedAt)}
        </p>

      </div>
    </div>
  )
}

export default AdminMetadata