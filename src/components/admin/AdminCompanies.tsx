'use client'

import React, { useMemo, useState } from 'react'
import {
  Building2,
  Search,
  CheckCircle,
  XCircle,
  Trash2,
  Clock
} from 'lucide-react'
import clsx from 'clsx'
import { Company, CompanyStatus } from '@prisma/client'
import Link from 'next/link'

/* ================= MOCK DATA (PRISMA-SAFE) ================= */

const mockCompanies: Company[] = [
  {
    id: '65f1a1a1a1a1a1a1a1a1a1a1',
    userId: '64u1',
    name: 'Acme Technologies',
    logo: null,
    description: 'Enterprise SaaS platform',
    industry: 'Software',
    companySize: '51-200',
    foundedYear: 2018,
    website: 'https://acme.com',
    linkedinProfile: null,
    location: 'Bangalore, India',
    contactEmail: 'hr@acme.com',
    contactPhone: null,
    address: null,
    businessDocument: null,
    taxDocument: null,
    status: 'PENDING',
    rejectionReason: null,
    approvedAt: null,
    approvedBy: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '65f1b2b2b2b2b2b2b2b2b2b2',
    userId: '64u2',
    name: 'FinStack',
    logo: null,
    description: 'Fintech infrastructure',
    industry: 'FinTech',
    companySize: '11-50',
    foundedYear: 2020,
    website: 'https://finstack.io',
    linkedinProfile: null,
    location: 'Mumbai, India',
    contactEmail: 'careers@finstack.io',
    contactPhone: null,
    address: null,
    businessDocument: null,
    taxDocument: null,
    status: 'APPROVED',
    rejectionReason: null,
    approvedAt: new Date(),
    approvedBy: 'admin_1',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '65f1c3c3c3c3c3c3c3c3c3c3',
    userId: '64u3',
    name: 'Healthify',
    logo: null,
    description: 'Healthcare platform',
    industry: 'Healthcare',
    companySize: '201-500',
    foundedYear: 2015,
    website: null,
    linkedinProfile: null,
    location: 'London, UK',
    contactEmail: 'jobs@healthify.com',
    contactPhone: null,
    address: null,
    businessDocument: null,
    taxDocument: null,
    status: 'REJECTED',
    rejectionReason: 'Invalid documents',
    approvedAt: null,
    approvedBy: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
] as const


const TABS: { label: string; value: CompanyStatus | 'ALL' }[] = [
  { label: 'All', value: 'ALL' },
  { label: 'Pending', value: 'PENDING' },
  { label: 'Approved', value: 'APPROVED' },
  { label: 'Rejected', value: 'REJECTED' },
]

const STATUS_STYLE: Record<CompanyStatus, string> = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  APPROVED: 'bg-green-100 text-green-700',
  REJECTED: 'bg-red-100 text-red-700',
}

const AdminCompanies = () => {
  const [companies, setCompanies] = useState<Company[]>(mockCompanies)
  const [activeTab, setActiveTab] = useState<'ALL' | CompanyStatus>('ALL')
  const [search, setSearch] = useState('')

  const filteredCompanies = useMemo(() => {
    return companies.filter((c) => {
      const statusMatch = activeTab === 'ALL' || c.status === activeTab
      const searchMatch =
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.industry.toLowerCase().includes(search.toLowerCase())
      return statusMatch && searchMatch
    })
  }, [companies, activeTab, search])

  // const updateStatus = (id: string, status: CompanyStatus) => {
  //   setCompanies((prev) =>
  //     prev.map((c) =>
  //       c.id === id ? { ...c, status } : c
  //     )
  //   )
  // }

  return (
    <div className="p-8 space-y-8 max-w-[1400px] mx-auto animate-in fade-in duration-500">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold tracking-tight">
          Manage Companies
        </h1>
        <p className="mt-2 text-muted-foreground">
          Review and manage registered companies
        </p>
      </div>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex gap-2">
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

      {/* Table */}
      {filteredCompanies.length === 0 ? (
        <div className="py-20 text-center">
          <Building2 className="h-10 w-10 mx-auto text-muted-foreground" />
          <p className="mt-4 text-muted-foreground">No companies found</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border/40 bg-card">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 border-b border-border/40">
              <tr>
                <th className="px-6 py-4 text-left">Company</th>
                <th className="px-6 py-4 text-left">Industry</th>
                <th className="px-6 py-4 text-left">Location</th>
                <th className="px-6 py-4 text-left">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCompanies.map((company) => (
                <tr
                  key={company.id}
                  className='w-full'
                >
                  <td className="px-6 py-4">
                    <div className="font-medium">{company.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {company.contactEmail}
                    </div>
                  </td>
                  <td className="px-6 py-4">{company.industry}</td>
                  <td className="px-6 py-4">{company.location}</td>
                  <td className="px-6 py-4">
                    <span
                      className={clsx(
                        'inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium',
                        STATUS_STYLE[company.status]
                      )}
                    >
                      {company.status === 'PENDING' && <Clock className="h-3 w-3" />}
                      {company.status === 'APPROVED' && <CheckCircle className="h-3 w-3" />}
                      {company.status === 'REJECTED' && <XCircle className="h-3 w-3" />}
                      {company.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="inline-flex items-center gap-2">
                      <Link
                        href={`/admin/companies/${company.id}`}
                        target='_blank'
                        className="text-muted-600 hover:underline text-xs"
                      >View Details</Link>
                      {company.status === 'PENDING' && (
                        <>
                          <button
                            // onClick={() => updateStatus(company.id, 'APPROVED')}
                            className="text-green-600 hover:underline text-xs"
                          >
                            Approve
                          </button>
                          <button
                            // onClick={() => updateStatus(company.id, 'REJECTED')}
                            className="text-red-600 hover:underline text-xs"
                          >
                            Reject
                          </button>
                        </>
                      )}

                      {company.status === 'APPROVED' && (
                        <button
                          // onClick={() => updateStatus(company.id, 'REJECTED')}
                          className="text-red-600 hover:underline text-xs"
                        >
                          Reject
                        </button>
                      )}

                      <button className="text-muted-foreground hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </button>

                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default AdminCompanies
