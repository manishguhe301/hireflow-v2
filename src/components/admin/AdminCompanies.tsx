'use client'

import React, { useEffect, useState } from 'react'
import {
  Building2,
  Search,
} from 'lucide-react'
import clsx from 'clsx'
import { Company, CompanyStatus } from '@prisma/client'
import { AppSdk } from '@/src/utils/AppSdk'
import { toast } from 'sonner'
import { Spinner } from '../elements/Loader'
import { TABS } from '@/src/utils/helper'
import DeleteCompanyModal from './DeleteCompanyModal'
import RejectCompanyModal from './RejectCompanyModal'
import CompaniesTable from './CompaniesTable'
import Pagination from '../ui/Pagination'
import useDebounce from '@/src/store/hooks/useDebounce'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import AdminCompaniesTableSkeleton from '../skeletons/AdminCompaniesTableSkeleton'

type Pagination = {
  total: number
  page: number
  limit: number
  totalPages: number
}

const AdminCompanies = () => {
  const [activeTab, setActiveTab] = useState<'ALL' | CompanyStatus>('ALL')
  const [loadingAction, setLoadingAction] = useState<string | null>(null)
  const [deleteCompanyId, setDeleteCompanyId] = useState<string | null>(null)
  const [rejectCompanyId, setRejectCompanyId] = useState<string | null>(null)
  const [rejectReason, setRejectReason] = useState('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  // const [pagination, setPagination] = useState<Pagination | null>(null)
  // const [companies, setCompanies] = useState<Company[]>([])
  // const [isLoading, setIsLoading] = useState(true)
  const debouncedSearch = useDebounce(search, 500)
  const queryClient = useQueryClient()

  // const fetchCompanies = async (status?: string, isLoadingNeeded: boolean = true) => {
  //   if (isLoadingNeeded) {
  //     setIsLoading(true)
  //   }
  //   try {
  //     const params = new URLSearchParams()
  //     if (status) params.set('status', status)
  //     if (search) params.set('search', search)
  //     params.set('page', page.toString())
  //     params.set('limit', '12')

  //     const url =
  //       `/api/admin/companies?${params.toString()}`

  //     const res = await AppSdk.getData(url, null)

  //     if (res.companies) {
  //       setCompanies(res.companies)
  //       setPagination(res.pagination)
  //     }
  //   } catch (error) {
  //     console.error(error);
  //     toast.error('Failed to fetch companies, please try again.')
  //   }
  //   finally {
  //     setIsLoading(false)
  //   }
  // }

  // useEffect(() => {
  //   const shouldDebounce = search.length > 0
  //   const delay = shouldDebounce ? 500 : 0

  //   const timer = setTimeout(() => {
  //     fetchCompanies(activeTab === 'ALL' ? undefined : activeTab)
  //   }, delay)

  //   return () => clearTimeout(timer)
  // }, [activeTab, search, page])

  const queryParams = new URLSearchParams()

  if (activeTab !== 'ALL') queryParams.set('status', activeTab)
  if (debouncedSearch) queryParams.set('search', debouncedSearch)

  queryParams.set('page', page.toString())
  queryParams.set('limit', '12')

  const { data, isLoading } = useQuery({
    queryKey: ['admin-companies', activeTab, debouncedSearch, page],
    queryFn: async () => {
      const res = await AppSdk.getData(
        `/api/admin/companies?${queryParams.toString()}`,
        null
      )

      if (!res) throw new Error('Failed to fetch companies')

      return res
    },
    placeholderData: (prev) => prev,
    staleTime: 1000 * 60 * 5,
  })

  const companies: Company[] = data?.companies ?? []
  const pagination: Pagination | null = data?.pagination ?? null

  const approveMutation = useMutation({
    mutationFn: async (id: string) => {
      return AppSdk.patchData(`/api/admin/companies/${id}`, {
        status: 'APPROVED',
      })
    },
    onSuccess: () => {
      toast.success('Company approved successfully')
      queryClient.invalidateQueries({ queryKey: ['admin-companies'] })
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard-stats'] })
    },
    onError: () => {
      toast.error('Failed to approve company')
    },
    onSettled: () => {
      setLoadingAction(null)
    },
  })

  const handleApprove = async (id: string) => {
    setLoadingAction(`approve-${id}`)
    // try {
    //   const res = await AppSdk.patchData(`/api/admin/companies/${id}`, {
    //     status: 'APPROVED'
    //   })

    //   if (res.success) {
    //     toast.success('Company approved successfully')
    //     fetchCompanies(activeTab === 'ALL' ? undefined : activeTab, false)
    //   }
    // } catch (error) {
    //   toast.error('Failed to approve company')
    // }
    // finally {
    // setLoadingAction(null)
    // }

    approveMutation.mutate(id)


  }

  const rejectMutation = useMutation({
    mutationFn: async ({
      id,
      reason,
    }: {
      id: string
      reason: string
    }) => {
      return AppSdk.patchData(`/api/admin/companies/${id}`, {
        status: 'REJECTED',
        rejectionReason: reason,
      })
    },
    onSuccess: () => {
      toast.success('Company rejected')
      queryClient.invalidateQueries({ queryKey: ['admin-companies'] })
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard-stats'] })
    },
    onError: () => {
      toast.error('Failed to reject company')
    },
    onSettled: () => {
      setRejectCompanyId(null)
      setRejectReason('')
      setLoadingAction(null)
    },
  })

  const handleReject = async (id: string, reason: string) => {
    if (!reason.trim()) {
      toast.error('Please provide a rejection reason')
      return
    }

    setLoadingAction(`reject-${id}`)

    rejectMutation.mutate({ id, reason })

    // try {
    //   const res = await AppSdk.patchData(`/api/admin/companies/${id}`, {
    //     status: 'REJECTED',
    //     rejectionReason: reason
    //   })

    //   if (res.success) {
    //     toast.success('Company rejected')
    //     fetchCompanies(activeTab === 'ALL' ? undefined : activeTab, false)
    //   }
    // } catch (error) {
    //   toast.error('Failed to reject company')
    // }
    // finally {
    //   setLoadingAction(null)
    //   setRejectCompanyId(null)
    //   setRejectReason('')
    // }
  }


  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return AppSdk.deleteData(`/api/admin/companies/${id}`, null)
    },
    onSuccess: () => {
      toast.success('Company deleted')
      queryClient.invalidateQueries({ queryKey: ['admin-companies'] })
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard-stats'] })
    },
    onError: () => {
      toast.error('Failed to delete company')
    },
    onSettled: () => {
      setLoadingAction(null)
    }
  })

  const handleDelete = async () => {
    if (!deleteCompanyId) return

    setLoadingAction(`delete-${deleteCompanyId}`)

    deleteMutation.mutate(deleteCompanyId)

    setDeleteCompanyId(null)

    // try {
    //   const res = await AppSdk.deleteData(`/api/admin/companies/${deleteCompanyId}`, null)

    //   if (res.success) {
    //     toast.success('Company deleted')
    //     fetchCompanies(activeTab === 'ALL' ? undefined : activeTab, false)
    //   }
    // } catch (error) {
    //   toast.error('Failed to delete company')
    // }
    // finally {
    //   setLoadingAction(null)
    //   setDeleteCompanyId(null)
    // }
  }

  useEffect(() => {
    //eslint-disable-next-line
    setRejectCompanyId(null)
    setRejectReason('')
    setDeleteCompanyId(null)
  }, [activeTab])


  return (
    <div className="p-4 md:p-8 md:px-8 space-y-8 w-full md:max-w-[1400px] md:mx-auto animate-in fade-in duration-500 max-sm:max-w-screen">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">
          Manage Companies
        </h1>
        <p className="mt-2 text-muted-foreground">
          Review and manage registered companies
        </p>
      </div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex gap-2 items-center flex-wrap">
          {TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => {
                setActiveTab(tab.value)
                setPage(1)
              }}
              className={clsx(
                'px-4 py-2 rounded-xl text-sm font-medium border transition cursor-pointer',
                activeTab === tab.value
                  ? tab.value === 'ALL'
                    ? 'bg-primary text-primary-foreground border-primary/40 shadow-md'
                    : tab.value === 'PENDING'
                      ? 'bg-amber-400 text-amber-950 border-amber-950/40 shadow-md'
                      : tab.value === 'APPROVED'
                        ? 'bg-success/10 text-success border-success/40 shadow-md'
                        : 'bg-destructive/10 text-destructive border-destructive/40 shadow-md'
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
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
            aria-label="Search companies"
            placeholder="Search companies..."
            className="w-full rounded-xl border border-border/60 bg-background pl-9 pr-4 py-2 text-sm outline-none focus:border-primary/40"
          />
        </div>
      </div>
      {isLoading ?
        <AdminCompaniesTableSkeleton />
        :
        <>
          <div>
            {companies.length === 0 ? (
              <div className="py-20 text-center">
                <Building2 className="h-10 w-10 mx-auto text-muted-foreground" />
                <p className="mt-4 text-muted-foreground">No companies found</p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-2xl border border-border/60 bg-card">
                <CompaniesTable
                  filteredCompanies={companies}
                  handleApprove={handleApprove}
                  loadingAction={loadingAction}
                  rejectCompanyId={rejectCompanyId}
                  setDeleteCompanyId={setDeleteCompanyId}
                  setRejectCompanyId={setRejectCompanyId}
                />
              </div>
            )}

            {!isLoading && pagination && pagination.totalPages > 1 && (
              <div className="mt-8">
                <Pagination
                  page={page}
                  totalPages={pagination.totalPages}
                  onPageChange={(p) => setPage(p)}
                />
              </div>
            )}
          </div>
        </>}
      <DeleteCompanyModal
        deleteCompanyId={deleteCompanyId}
        setDeleteCompanyId={setDeleteCompanyId}
        handleDelete={handleDelete}
        loadingAction={loadingAction}
      />
      <RejectCompanyModal
        rejectCompanyId={rejectCompanyId}
        setRejectCompanyId={setRejectCompanyId}
        rejectReason={rejectReason}
        setRejectReason={setRejectReason}
        onReject={handleReject}
        loadingAction={loadingAction}
      />
    </div >
  )
}

export default AdminCompanies


