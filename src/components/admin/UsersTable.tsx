'use client'
import { formatDate, labels } from '@/src/utils/helper'
import { User } from '@prisma/client'
import { Check, Trash2, X } from 'lucide-react'
import { useSession } from 'next-auth/react'
import React from 'react'
import { Button } from '../ui/Button'
import { Spinner } from '../elements/Loader'

type UsersTableProps = {
  filteredUsers: User[],
  loadingAction: string | null,
  setDeleteUserId: React.Dispatch<React.SetStateAction<string | null>>
}

const UsersTable = ({
  filteredUsers,
  loadingAction,
  setDeleteUserId
}: UsersTableProps) => {
  const { data: session } = useSession()

  return (
    <table className="w-full text-sm">
      <thead className="bg-muted/40 border-b border-border/40">
        <tr>
          {/* <th className="px-6 py-4 text-left">Id</th> */}
          <th className="px-6 py-4 text-left">Name</th>
          <th className="px-6 py-4 text-left">Email</th>
          <th className="px-6 py-4 text-left">Role</th>
          <th className="px-6 py-4 text-left">Email Verified</th>
          <th className="px-6 py-4 text-right">Created At</th>
          <th className="px-6 py-4 text-right">Action</th>
        </tr>
      </thead>
      <tbody>
        {filteredUsers.map((user) => (
          <tr
            key={user.id}
            className='w-full hover:bg-muted/30 transition'
          >
            {/* <td className="px-6 py-4">
                          {user.id}
                        </td> */}
            <td className="px-6 py-4">
              {user.name}
            </td>
            <td className="px-6 py-4">{user.email}</td>
            <td className="px-6 py-4">{labels[user.role]}</td>
            <td className="px-6 py-4">
              {user.emailVerified ? (
                <div className="inline-flex items-center gap-2">
                  <Check size={18} color="green" />
                  <span className="text-green-600 text-xs">Verified</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-2">
                  <X size={18} color='red' />
                  <span className="text-red-600 text-xs">Not Verified</span>
                </div>
              )}
            </td>
            <td className="px-6 py-4 text-right">
              {formatDate(user.createdAt)}
            </td>
            <td className="px-6 py-4 text-right">
              {
                user.id !== session?.user?.id ? (
                  <Button
                    variant='danger'
                    className="disabled:opacity-50 border-none p-0! cursor-pointer disabled:cursor-not-allowed bg-transparent! "
                    disabled={
                      !!loadingAction ||
                      user.id === session?.user?.id
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
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default UsersTable