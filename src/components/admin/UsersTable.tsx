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
import { DataTable, DataTableBody, DataTableCell, DataTableHeadCell, DataTableHeader, DataTableRow } from '../shared/TableComponents'
import { UsersTableProps } from '@/src/types'

const UsersTable = ({
  filteredUsers,
  loadingAction,
  setDeleteUserId,
  disabled
}: UsersTableProps) => {
  const { data: session } = useSession()

  return (
    <DataTable className={clsx("w-full text-sm", disabled && 'opacity-60 cursor-not-allowed')}>
      <DataTableHeader className="bg-muted/40 border-b border-border/60">
        <DataTableRow>
          <DataTableHeadCell>Name</DataTableHeadCell>
          <DataTableHeadCell>Email</DataTableHeadCell>
          <DataTableHeadCell>Role</DataTableHeadCell>
          <DataTableHeadCell>Email Verified</DataTableHeadCell>
          <DataTableHeadCell
            className="px-6 py-5 text-right">Created At</DataTableHeadCell>
          <DataTableHeadCell className="text-right">
            Action
          </DataTableHeadCell>
        </DataTableRow>
      </DataTableHeader>
      <DataTableBody>
        {filteredUsers.map((user) => (
          <DataTableRow
            key={user.id}
            className='w-full hover:bg-muted/30 transition'
          >
            <DataTableCell>
              {user.name}
            </DataTableCell>
            <DataTableCell>{user.email}</DataTableCell>
            <DataTableCell>
              <span className="px-2 py-1 rounded-full text-xs bg-muted">
                {labels[user.role]}
              </span>
            </DataTableCell>
            <DataTableCell>
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
            </DataTableCell>
            <DataTableCell className="text-right">
              {formatDate(user.createdAt)}
            </DataTableCell>
            <DataTableCell className="px-6 py-5 text-right flex items-center gap-3 justify-end">
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

            </DataTableCell>
          </DataTableRow>
        ))}
      </DataTableBody>
    </DataTable>
  )
}

export default UsersTable