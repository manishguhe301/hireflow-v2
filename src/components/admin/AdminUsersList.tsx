'use client'
import { AppSdk } from "@/src/utils/AppSdk"
import { ADMIN_USERS_TABS, formatDate, ROLE_STYLE } from "@/src/utils/helper"
import { Role, User } from "@prisma/client"
import clsx from "clsx"
import { Check, Search, Trash2, Users, X } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { toast } from "sonner"
import { Spinner } from "../elements/Loader"
import { useSession } from "next-auth/react"

const labels = {
  JOB_SEEKER: 'Job Seeker',
  COMPANY_ADMIN: 'Company Admin',
  PLATFORM_ADMIN: 'Platform Admin',
}

const AdminUsersList = () => {
  const [users, setUsers] = useState<User[]>([])
  const [activeTab, setActiveTab] = useState<'ALL' | Role>('ALL')
  const [search, setSearch] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [loadingAction, setLoadingAction] = useState<string | null>(null)
  const { data: session } = useSession()
  const user = session?.user

  const fetchUsers = async (role?: string) => {
    setIsLoading(true)
    try {
      const url = role
        ? `/api/admin/users?role=${role}`
        : '/api/admin/users'

      const res = await AppSdk.getData(url, null)

      if (res.users) {
        setUsers(res.users)
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch Users, please try again.')
    }
    finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers(activeTab === 'ALL' ? undefined : activeTab)
  }, [activeTab])

  const filteredUsers = useMemo(() => {
    return users.filter(user =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
    )
  }, [users, search])

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return

    setLoadingAction(`delete-${id}`)
    try {
      const res = await AppSdk.deleteData(`/api/admin/users/${id}`, null)

      if (res.success) {
        toast.success('User deleted')
        fetchUsers(activeTab === 'ALL' ? undefined : activeTab)
      }
    } catch (error) {
      toast.error('Failed to delete user')
    }
    finally {
      setLoadingAction(null)
    }
  }

  return (
    <div className="p-4 md:p-8 md:px-8 space-y-8 w-full md:max-w-[1400px] md:mx-auto animate-in fade-in duration-500 max-sm:max-w-screen">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">
          Manage Users
        </h1>
        <p className="mt-2 text-muted-foreground">
          Review and manage registered users
        </p>
      </div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex gap-2 items-center flex-wrap">
          {ADMIN_USERS_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={clsx(
                'px-4 py-2 rounded-xl text-sm font-medium border transition cursor-pointer',
                activeTab === tab.value
                  ? tab.value === 'ALL'
                    ? 'bg-blue-500 text-white border-blue-500 shadow-lg'
                    : `${ROLE_STYLE[tab.value as Role]} shadow-lg`
                  : 'bg-card border-border/40 hover:bg-muted/40'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users..."
            className="w-full rounded-xl border border-border/40 bg-background pl-9 pr-4 py-2 text-sm outline-none focus:border-primary/40"
          />
        </div>
      </div>
      {isLoading ?
        <div className='flex items-center justify-center min-h-75'>
          <Spinner />
        </div > :
        <>
          <div>
            {filteredUsers.length === 0 ? (
              <div className="py-20 text-center">
                <Users className="h-10 w-10 mx-auto text-muted-foreground" />
                <p className="mt-4 text-muted-foreground">No users found</p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-2xl border border-border/40 bg-card">
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
                              <button
                                className="text-muted-foreground hover:text-destructive disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                                disabled={
                                  loadingAction === `delete-${user.id}` ||
                                  user.id === session?.user?.id
                                }
                                onClick={() => handleDelete(user.id)}
                              >
                                {loadingAction === `delete-${user.id}` ? (
                                  <Spinner className="h-4 w-4" />
                                ) : (
                                  <Trash2 className="h-4 w-4" />
                                )}
                              </button>
                            ) : <div>
                              <span className="text-muted-foreground">You</span>
                            </div>
                          }
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      }
    </div>
  )
}

export default AdminUsersList