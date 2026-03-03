'use client'
import { AppSdk } from "@/src/utils/AppSdk"
import { ADMIN_USERS_TABS, formatDate, ROLE_STYLE } from "@/src/utils/helper"
import { Role, User } from "@prisma/client"
import clsx from "clsx"
import { Check, Search, Trash2, UserPlus, Users, X } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { toast } from "sonner"
import { Spinner } from "../elements/Loader"
import { useSession } from "next-auth/react"
import Link from "next/link"
import UserDeleteModal from "./UserDeleteModal"
import { Button } from "../ui/Button"
import UsersTable from "./UsersTable"
import Pagination from "../ui/Pagination"

type Pagination = {
  total: number
  page: number
  limit: number
  totalPages: number
}

const AdminUsersList = () => {
  const [users, setUsers] = useState<User[]>([])
  const [activeTab, setActiveTab] = useState<'ALL' | Role>('ALL')
  const [isLoading, setIsLoading] = useState(true)
  const [loadingAction, setLoadingAction] = useState<string | null>(null)
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [pagination, setPagination] = useState<Pagination | null>(null)
  const [page, setPage] = useState(1)

  const fetchUsers = async (role?: string, isLoadingNeeded: boolean = true) => {
    if (isLoadingNeeded) {
      setIsLoading(true)
    }
    try {
      const params = new URLSearchParams()
      if (search) params.set('search', search)
      params.set('page', page.toString())
      params.set('limit', '12')
      if (activeTab !== 'ALL') params.set('role', activeTab)

      const url =
        `/api/admin/users?${params.toString()}`

      const res = await AppSdk.getData(url, null)

      if (res.users) {
        setUsers(res.users)
        setPagination(res.pagination)
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
    const shouldDebounce = search.length > 0
    const delay = shouldDebounce ? 500 : 0

    const timer = setTimeout(() => {
      fetchUsers(activeTab === 'ALL' ? undefined : activeTab)
    }, delay)

    return () => clearTimeout(timer)
  }, [activeTab, search, page])

  const handleDelete = async () => {
    if (!deleteUserId) return

    setLoadingAction(`delete-${deleteUserId}`)
    try {
      const res = await AppSdk.deleteData(`/api/admin/users/${deleteUserId}`, null)

      if (res.success) {
        toast.success('User deleted')
        fetchUsers(activeTab === 'ALL' ? undefined : activeTab, false)
      }
    } catch (error) {
      toast.error('Failed to delete user')
    }
    finally {
      setLoadingAction(null)
      setDeleteUserId(null)
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
              onClick={() => { setActiveTab(tab.value); setPage(1) }}
              className={clsx(
                'px-4 py-2 rounded-xl text-sm font-medium border transition cursor-pointer',
                activeTab === tab.value
                  ? tab.value === 'ALL'
                    ? 'bg-primary text-primary-foreground border-primary/40 shadow-md'
                    : tab.value === 'PLATFORM_ADMIN'
                      ? 'bg-info/10 text-info border-info/40 shadow-md'
                      : tab.value === 'COMPANY_ADMIN'
                        ? 'bg-info/50 text-secondary-foreground border-secondary/40 shadow-md'
                        : 'bg-accent text-foreground border-border/40 shadow-md'
                  : 'bg-card border-border/40 hover:bg-muted/40'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="flex justify-between items-center gap-2">
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
              placeholder="Search users..."
              aria-label="Search users..."
              className="w-full rounded-xl border border-border/60 bg-background pl-9 pr-4 py-2 text-sm outline-none focus:border-primary/40"
            />
          </div>
          <Link href="/admin/create-admin">
            <Button className="transition flex items-center gap-2 whitespace-nowrap ">
              <UserPlus className="h-4 w-4" />
              Create Admin
            </Button>
          </Link>
        </div>
      </div>
      {isLoading ?
        <div className='flex items-center justify-center min-h-75'>
          <Spinner />
        </div > :
        <>
          <div>
            {users.length === 0 ? (
              <div className="py-20 text-center">
                <Users className="h-10 w-10 mx-auto text-muted-foreground" />
                <p className="mt-4 text-muted-foreground">No users found</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto rounded-2xl border border-border/60 bg-card">
                  <UsersTable
                    filteredUsers={users}
                    loadingAction={loadingAction}
                    setDeleteUserId={setDeleteUserId}
                  />
                </div>
                {!isLoading && pagination && pagination.totalPages > 1 && (
                  <div className="mt-8">
                    <Pagination
                      page={page}
                      totalPages={pagination.totalPages}
                      onPageChange={(p) => setPage(p)}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </>
      }
      <UserDeleteModal
        deleteUserId={deleteUserId}
        handleDelete={handleDelete}
        loadingAction={loadingAction}
        setDeleteUserId={setDeleteUserId}
      />
    </div>
  )
}

export default AdminUsersList