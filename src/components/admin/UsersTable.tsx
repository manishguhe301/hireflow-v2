'use client'
import { formatDate } from '@/src/utils/helper'
import { Role, User } from '@prisma/client'
import { Check, Trash2, X } from 'lucide-react'
import { useSession } from 'next-auth/react'
import React from 'react'
import { Button } from '../ui/Button'
import { Spinner } from '../elements/Loader'
import Link from 'next/link'
import { labels } from '@/src/utils/constants'
import clsx from 'clsx'

type UsersTableProps = {
  filteredUsers: User[],
  loadingAction: string | null,
  setDeleteUserId: React.Dispatch<React.SetStateAction<string | null>>
  disabled?: boolean
}

const UsersTable = ({
  filteredUsers,
  loadingAction,
  setDeleteUserId,
  disabled
}: UsersTableProps) => {
  const { data: session } = useSession()

  return (
    <table className={clsx("w-full text-sm", disabled && 'opacity-60 cursor-not-allowed')}>
      <thead className="bg-muted/40 border-b border-border/60">
        <tr>
          <th
            scope="col"
            className="px-6 py-5 text-left">Name</th>
          <th
            scope="col"
            className="px-6 py-5 text-left">Email</th>
          <th
            scope="col"
            className="px-6 py-5 text-left">Role</th>
          <th
            scope="col"
            className="px-6 py-5 text-left">Email Verified</th>
          <th
            scope="col"
            className="px-6 py-5 text-right">Created At</th>
          <th
            scope="col"
            className="px-6 py-5 text-right">Action</th>
        </tr>
      </thead>
      <tbody>
        {filteredUsers.map((user) => (
          <tr
            key={user.id}
            className='w-full hover:bg-muted/30 transition'
          >
            <td className="px-6 py-5">
              {user.name}
            </td>
            <td className="px-6 py-5">{user.email}</td>
            <td className="px-6 py-5">
              <span className="px-2 py-1 rounded-full text-xs bg-muted">
                {labels[user.role]}
              </span>
            </td>
            <td className="px-6 py-5">
              {user.emailVerified ? (
                <div className="inline-flex items-center gap-2">
                  <Check className="h-4 w-4 text-success" />
                  <span className="text-green-600 text-xs">Verified</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-2">
                  <X className="h-4 w-4 text-destructive" />
                  <span className="text-red-600 text-xs">Not Verified</span>
                </div>
              )}
            </td>
            <td className="px-6 py-5 text-right">
              {formatDate(user.createdAt)}
            </td>
            <td className="px-6 py-5 text-right flex items-center gap-3 justify-end">
              <span className='text-xs text-muted-foreground'>
                {
                  user.role === Role.JOB_SEEKER && (
                    <Link href={`/user-profile/${user.id}`}
                      target='_blank'
                    >View Profile</Link>
                  )
                }
              </span>
              <span>
                {
                  user.id !== session?.user?.id ? (
                    <Button
                      variant='ghost'
                      className="disabled:opacity-50 border-none p-0! cursor-pointer disabled:cursor-not-allowed bg-transparent! "
                      disabled={
                        !!loadingAction ||
                        user.id === session?.user?.id || disabled
                      }

                      onClick={() => setDeleteUserId(user.id)}
                    >
                      {loadingAction === `delete-${user.id}` ? (
                        <Spinner className="h-4 w-4" />
                      ) : (
                        <Trash2 className="h-4 w-4 text-destructive" />
                      )}
                    </Button>
                  ) : <div>
                    <span className="text-muted-foreground">You</span>
                  </div>
                }
              </span>

            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default UsersTable