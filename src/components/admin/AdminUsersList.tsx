'use client'
import { AppSdk } from "@/src/utils/AppSdk"
import { Role, User } from "@prisma/client"
import clsx from "clsx"
import { RefreshCw, Search, UserPlus, Users, } from "lucide-react"
import { useMemo, useState } from "react"
import { toast } from "sonner"

import Link from "next/link"
import UserDeleteModal from "./UserDeleteModal"
import { Button } from "../ui/Button"
import UsersTable from "./UsersTable"
import Pagination from "../ui/Pagination"
import useDebounce from "@/src/store/hooks/useDebounce"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import AdminUsersTableSkeleton from "../skeletons/AdminUsersTableSkeleton"
import { ADMIN_USERS_TABS } from "@/src/utils/constants"

type Pagination = {
  total: number
  page: number
  limit: number
  totalPages: number
}

const AdminUsersList = () => {
  const [activeTab, setActiveTab] = useState<'ALL' | Role>('ALL')
  const [loadingAction, setLoadingAction] = useState<string | null>(null)
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const debouncedSearch = useDebounce(search, 500)
  const queryClient = useQueryClient()

  const queryParams = useMemo(() => {
    const params = new URLSearchParams()

    if (debouncedSearch) params.set('search', debouncedSearch)
    if (activeTab !== 'ALL') params.set('role', activeTab)

    params.set('page', page.toString())
    params.set('limit', '12')

    return params.toString()
  }, [debouncedSearch, activeTab, page])

  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['admin-users', activeTab, debouncedSearch, page],
    queryFn: async () => {
      const res = await AppSdk.getData(
        `/api/admin/users?${queryParams.toString()}`,
        null
      )

      if (!res) throw new Error('Failed to fetch users')

      return res
    },
    placeholderData: (prev) => prev,
    staleTime: 1000 * 60 * 5,
  })

  const users: User[] = data?.users ?? []
  const pagination: Pagination | null = data?.pagination ?? null

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return AppSdk.deleteData(`/api/admin/users/${id}`, null)
    },
    onSuccess: () => {
      toast.success('User deleted')
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
      setDeleteUserId(null)
    },
    onError: () => {
      toast.error('Failed to delete user')
    },
    onSettled: () => {
      setLoadingAction(null)
    },
  })

  const handleDelete = async () => {
    if (!deleteUserId) return
    setLoadingAction(`delete-${deleteUserId}`)
    deleteMutation.mutate(deleteUserId)
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
            <Button
              key={tab.value}
              size="sm"
              variant={tab.value === activeTab ? 'primary' : 'ghost'}
              onClick={() => { setActiveTab(tab.value); setPage(1) }}
              className={clsx(
                activeTab === tab.value
                  ? tab.value === 'ALL'
                    ? 'bg-primary! text-primary-foreground! border-primary/40! shadow-md!'
                    : tab.value === 'PLATFORM_ADMIN'
                      ? 'bg-info/10! text-info! border-info/40! shadow-md!'
                      : tab.value === 'COMPANY_ADMIN'
                        ? 'bg-info/50! text-secondary-foreground! border-secondary/40! shadow-md!'
                        : 'bg-accent! text-foreground! border-border/40! shadow-md!'
                  : 'bg-card! border-border/40! hover:bg-muted/40!'
              )}
            >
              {tab.label}
            </Button>
          ))}
          <Button
            variant="outline"
            onClick={() => refetch()}
            size="sm"
            className="flex flex-row items-center gap-2"
            disabled={isLoading || isFetching}
          >
            <RefreshCw size={16} /> Refresh
          </Button>
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
              disabled={isLoading || isFetching}
              placeholder="Search users..."
              aria-label="Search users..."
              className="w-full rounded-xl border border-border/60 bg-background pl-9 pr-4 py-2 text-sm outline-none focus:border-primary/40"
            />
          </div>
          <Link href="/admin/create-admin">
            <Button className="transition flex items-center gap-2 whitespace-nowrap "
              disabled={isLoading || isFetching}
            >
              <UserPlus className="h-4 w-4" />
              Create Admin
            </Button>
          </Link>
        </div>
      </div>
      {isLoading ?
        <AdminUsersTableSkeleton /> :
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
                    disabled={isLoading || isFetching}
                  />
                </div>
                {!isLoading && !isFetching && pagination && pagination.totalPages > 1 && (
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
        deleteUserName={users.find((u) => u.id === deleteUserId)?.name ?? ''}
        setDeleteUserId={setDeleteUserId}
      />
    </div>
  )
}

export default AdminUsersList