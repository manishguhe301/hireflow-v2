'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
  Building2,
  Mail,
  Phone,
  Globe,
  MapPin,
  CheckCircle,
  XCircle,
  Clock,
  ArrowLeft
} from 'lucide-react'
import clsx from 'clsx'
import { Company } from '@prisma/client'
import { AppSdk } from '@/src/utils/AppSdk'
import { toast } from 'sonner'
import DocumentCard from './DocumentCard'
import InfoRow from './InfoRow'
import InfoCard from './InfoCard'
import { Spinner } from '../elements/Loader'
import { STATUS_STYLE } from './AdminCompanies'

const CompanyDetails = () => {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()

  const [company, setCompany] = useState<Company | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchCompany = async () => {
    try {
      const res = await AppSdk.getData(`/api/admin/companies/${id}`, null)
      setCompany(res.company)
    } catch (error) {
      toast.error('Failed to load company')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCompany()
  }, [id])

  const handleApprove = async (id: string) => {
    try {
      const res = await AppSdk.patchData(`/api/admin/companies/${id}`, {
        status: 'APPROVED'
      })

      if (res.success) {
        toast.success('Company approved successfully')
        fetchCompany()
      }
    } catch (error) {
      toast.error('Failed to approve company')
    }
  }

  const handleReject = async (id: string, reason: string) => {
    if (!reason) {
      toast.error('Please provide a rejection reason')
      return
    }

    try {
      const res = await AppSdk.patchData(`/api/admin/companies/${id}`, {
        status: 'REJECTED',
        rejectionReason: reason
      })

      if (res.success) {
        toast.success('Company rejected')
        fetchCompany()
      }
    } catch (error) {
      toast.error('Failed to reject company')
    }
  }

  if (!company) {
    return (
      <div className="min-h-[500px] flex items-center justify-center">
        <div className="max-w-md text-center space-y-6">
          <div className="mx-auto h-16 w-16 rounded-full bg-muted flex items-center justify-center">
            <Building2 className="h-8 w-8 text-muted-foreground" />
          </div>

          <div>
            <h2 className="text-xl font-semibold">Company not found</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              The company you&apos;re trying to access doesn&apos;t exist or may have been removed.
            </p>
          </div>

          <button
            onClick={() => router.push('/admin/companies')}
            className="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition"
          >
            Back to Companies
          </button>
        </div>
      </div>
    )
  }


  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <Spinner className="h-8 w-8" />
      </div>
    )
  }

  return (
    <div className="p-8 space-y-10 max-w-[1200px] mx-auto animate-in fade-in duration-500">
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Companies
      </button>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">{company.name}</h1>
          <p className="mt-2 text-muted-foreground">{company.description}</p>
        </div>

        <span
          className={clsx(
            'inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium w-fit',
            STATUS_STYLE[company.status]
          )}
        >
          {company.status === 'PENDING' && <Clock className="h-4 w-4" />}
          {company.status === 'APPROVED' && <CheckCircle className="h-4 w-4" />}
          {company.status === 'REJECTED' && <XCircle className="h-4 w-4" />}
          {company.status}
        </span>
      </div>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InfoCard title="Company Information">
          <InfoRow icon={<Building2 />} label="Industry" value={company.industry} />
          <InfoRow icon={<MapPin />} label="Location" value={company.location} />
          <InfoRow label="Company Size" value={company.companySize} />
          <InfoRow label="Founded" value={company.foundedYear?.toString() || '—'} />
        </InfoCard>

        <InfoCard title="Contact Information">
          <InfoRow icon={<Mail />} label="Email" value={company.contactEmail} />
          <InfoRow icon={<Phone />} label="Phone" value={company.contactPhone || '—'} />
          <InfoRow icon={<Globe />} label="Website" value={company.website || '—'} />
        </InfoCard>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Documents</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DocumentCard
            label="Business Document"
            url={company.businessDocument}
          />
          <DocumentCard
            label="Tax Document"
            url={company.taxDocument}
          />
        </div>
      </section>

      {company.status !== 'REJECTED' && (
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Admin Actions</h2>

          {company.status === 'PENDING' && (
            <div className="flex flex-wrap gap-3">
              <button className="px-4 py-2 rounded-xl bg-green-600 text-white text-sm hover:opacity-90"
                onClick={() => handleApprove(company.id)}
              >
                Approve Company
              </button>
              <button className="px-4 py-2 rounded-xl bg-red-600 text-white text-sm hover:opacity-90"
                onClick={() => handleReject(company.id, 'reason')}
              >
                Reject Company
              </button>
            </div>
          )}

          {company.status === 'APPROVED' && (
            <button className="px-4 py-2 rounded-xl bg-red-600 text-white text-sm hover:opacity-90" onClick={() => handleReject(company.id, 'reason')}
            >
              Reject Company
            </button>
          )}

          {/* <div className="max-w-xl">
            <label className="text-sm text-muted-foreground">
              Rejection Reason (required when rejecting)
            </label>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter reason for rejection..."
              className="mt-2 w-full rounded-xl border border-border/40 bg-background px-4 py-3 text-sm outline-none focus:border-primary/40"
              rows={4}
            />
          </div> */}
        </section>
      )}

      <section className="text-xs text-muted-foreground">
        {/* USE HERE FORMAT DATES HELPERS */}
        Created at: {company.createdAt.toLocaleDateString()} •
        Last updated: {company.updatedAt.toLocaleDateString()}
      </section>
    </div>
  )
}

export default CompanyDetails





