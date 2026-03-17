'use client'
import { FullProfile } from '@/src/store/slices/job-seeker/userProfileSlice'
import { yearsOfExperiences } from '@/src/utils/constants'
import { getLabel } from '@/src/utils/helper'
import { Briefcase, MapPin, MessageCircle } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { Button } from '../ui/Button'
import clsx from 'clsx'
import { useSession } from 'next-auth/react'
import { Spinner } from '../elements/Loader'
import { useRouter } from 'next/navigation'
import { ParamValue } from 'next/dist/server/request/params'

const ProfileTopSection = ({ profile,
  isPublicBtnShow = true,
  handleMessageClick,
  isPending,
  slug,
  isApplicationAvailable
}: {
  profile: FullProfile,
  isPublicBtnShow?: boolean
  handleMessageClick?: () => Promise<void>
  isPending?: boolean
  slug?: ParamValue
  isApplicationAvailable?: boolean
}) => {
  const { data: session } = useSession()
  const router = useRouter()

  const isComapnyAdmin = session?.user.role === 'COMPANY_ADMIN'
  const isOwner = session?.user?.id === profile.userId
  const isPlatFormAdmin = session?.user?.role === 'PLATFORM_ADMIN'

  return (
    <div className="rounded-3xl border border-border/40 bg-card p-6 shadow-sm">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-5 max-sm:flex-col">
          <div className="relative  h-20 w-20 overflow-hidden rounded-2xl border border-border/40 bg-muted">
            {profile?.avatar ? (
              <>
                {/*  eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={profile?.avatar}
                  alt={profile.name}
                  className={clsx(
                    "h-full w-full object-cover transition-opacity duration-300",
                  )}
                />
              </>
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xl font-semibold text-muted-foreground">
                {profile.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          <div className='max-sm:flex max-sm:flex-col max-sm:items-center'>
            <h1 className="text-2xl font-bold">{profile.name}</h1>
            <p className="text-sm text-muted-foreground">
              {profile.professionalTitle || '—'}
            </p>

            <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {profile.city && `${profile.city}, `} {profile.country}
              </span>

              <span className="flex items-center gap-1">
                <Briefcase className="h-3 w-3" />
                {getLabel(yearsOfExperiences, profile.yearsOfExperience as string) || '—'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-3 max-sm:w-full">
          {isOwner &&
            <Link
              href="/dashboard/profile/form"
              className='max-sm:w-full'
            >
              <Button className='max-sm:w-full' variant="outline">Edit Profile</Button>
            </Link>
          }
          {isPublicBtnShow &&
            <Link
              href={`/user-profile/${profile.userId}`}
              target="_blank"
              className='max-sm:w-full'
            >
              <Button className='max-sm:w-full'>View Public Profile</Button>
            </Link>
          }

          {!isOwner && !isPlatFormAdmin && (
            <Button
              variant="outline"
              className="flex items-center gap-1 border-primary text-primary"
              onClick={handleMessageClick}
              disabled={isPending}
            >
              {isPending ? (
                <span className="flex items-center gap-1">
                  <Spinner className="w-4 h-4" />
                  Initializing Chat
                </span>
              ) : (
                <>
                  <MessageCircle className="h-4 w-4" />
                  Message
                </>
              )}
            </Button>
          )}
          {isComapnyAdmin && isApplicationAvailable && (
            <Button
              variant="outline"
              className="flex items-center gap-1"
              onClick={() => router.push(`/company/applications/${slug}`)}
            >
              View Application
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProfileTopSection