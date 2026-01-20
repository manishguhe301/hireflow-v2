'use client'

import React, { useEffect, useMemo, useState } from 'react'
import {
  Building2,
  Search,
} from 'lucide-react'
import clsx from 'clsx'
import { Company, CompanyStatus } from '@prisma/client'
import { AppSdk } from '@/src/utils/AppSdk'
import { toast } from 'sonner'
import { Spinner } from '../elements/Loader'
import { mockCompanies } from '@/src/utils/mock'
import { STATUS_STYLE, TABS } from '@/src/utils/helper'
import DeleteCompanyModal from './DeleteCompanyModal'
import RejectCompanyModal from './RejectCompanyModal'
import CompaniesTable from './CompaniesTable'

const AdminCompanies = () => {
  const [companies, setCompanies] = useState<Company[]>(mockCompanies)
  const [activeTab, setActiveTab] = useState<'ALL' | CompanyStatus>('ALL')
  const [search, setSearch] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [loadingAction, setLoadingAction] = useState<string | null>(null)
  const [deleteCompanyId, setDeleteCompanyId] = useState<string | null>(null)
  const [rejectCompanyId, setRejectCompanyId] = useState<string | null>(null)
  const [rejectReason, setRejectReason] = useState('')

  const filteredCompanies: Company[] = useMemo(() => {
    return companies.filter((c) => {
      const statusMatch = activeTab === 'ALL' || c.status === activeTab
      const searchMatch =
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.industry.toLowerCase().includes(search.toLowerCase())
      return statusMatch && searchMatch
    })
  }, [companies, activeTab, search])

  const fetchCompanies = async (status?: string) => {
    setIsLoading(true)
    try {
      const url = status
        ? `/api/admin/companies?status=${status}`
        : '/api/admin/companies'

      const res = await AppSdk.getData(url, null)

      if (res.companies) {
        setCompanies(res.companies)
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch companies, please try again.')
    }
    finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCompanies(activeTab === 'ALL' ? undefined : activeTab)
  }, [activeTab])

  const handleApprove = async (id: string) => {
    setLoadingAction(`approve-${id}`)
    try {
      const res = await AppSdk.patchData(`/api/admin/companies/${id}`, {
        status: 'APPROVED'
      })

      if (res.success) {
        toast.success('Company approved successfully')
        fetchCompanies(activeTab === 'ALL' ? undefined : activeTab)
      }
    } catch (error) {
      toast.error('Failed to approve company')
    }
    finally {
      setLoadingAction(null)
    }
  }

  const handleReject = async (id: string, reason: string) => {
    if (!reason.trim()) {
      toast.error('Please provide a rejection reason')
      return
    }

    setLoadingAction(`reject-${id}`)

    try {
      const res = await AppSdk.patchData(`/api/admin/companies/${id}`, {
        status: 'REJECTED',
        rejectionReason: reason
      })

      if (res.success) {
        toast.success('Company rejected')
        fetchCompanies(activeTab === 'ALL' ? undefined : activeTab)
      }
    } catch (error) {
      toast.error('Failed to reject company')
    }
    finally {
      setLoadingAction(null)
      setRejectCompanyId(null)
      setRejectReason('')
    }
  }

  const handleDelete = async () => {
    if (!deleteCompanyId) return

    setLoadingAction(`delete-${deleteCompanyId}`)
    try {
      const res = await AppSdk.deleteData(`/api/admin/companies/${deleteCompanyId}`, null)

      if (res.success) {
        toast.success('Company deleted')
        fetchCompanies(activeTab === 'ALL' ? undefined : activeTab)
      }
    } catch (error) {
      toast.error('Failed to delete company')
    }
    finally {
      setLoadingAction(null)
      setDeleteCompanyId(null)
    }
  }

  useEffect(() => {
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
              onClick={() => setActiveTab(tab.value)}
              className={clsx(
                'px-4 py-2 rounded-xl text-sm font-medium border transition cursor-pointer',
                activeTab === tab.value
                  ? tab.value === 'ALL'
                    ? 'bg-blue-500 text-white border-blue-500 shadow-lg'
                    : `${STATUS_STYLE[tab.value as CompanyStatus]} shadow-lg`
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
            placeholder="Search companies..."
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
            {filteredCompanies.length === 0 ? (
              <div className="py-20 text-center">
                <Building2 className="h-10 w-10 mx-auto text-muted-foreground" />
                <p className="mt-4 text-muted-foreground">No companies found</p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-2xl border border-border/40 bg-card">
                <CompaniesTable
                  filteredCompanies={filteredCompanies}
                  handleApprove={handleApprove}
                  loadingAction={loadingAction}
                  rejectCompanyId={rejectCompanyId}
                  setDeleteCompanyId={setDeleteCompanyId}
                  setRejectCompanyId={setRejectCompanyId}
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


