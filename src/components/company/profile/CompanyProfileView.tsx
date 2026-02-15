'use client'

import Link from 'next/link'
import clsx from 'clsx'
import {
  Building2,
  Mail,
  Phone,
  Globe,
  MapPin,
  Users,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  Linkedin,
} from 'lucide-react'
import { useCompany } from '@/src/store/hooks/useCompany'
import { Spinner } from '@/src/components/elements/Loader'
import { Button } from '@/src/components/ui/Button'
import { CompanyStatus } from '@prisma/client'
import InfoCard from '../../admin/InfoCard'
import InfoRow from '../../admin/InfoRow'
import DocumentCard from '../../admin/DocumentCard'

const statusStyles: Record<CompanyStatus, string> = {
  PENDING: 'bg-warning/10 text-warning border-warning/30',
  APPROVED: 'bg-success/10 text-success border-success/30',
  REJECTED: 'bg-destructive/10 text-destructive border-destructive/30',
}

const CompanyProfileView = () => {
  const { company, isLoading, error } = useCompany()

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner className="h-8 w-8" />
      </div>
    )
  }

  if (error || !company) {
    return (
      <div className="mx-auto max-w-lg rounded-2xl border border-border/40 bg-card p-6 text-center">
        <p className="text-sm text-muted-foreground">
          Unable to load company profile.
        </p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-6">
      <div className="rounded-3xl border border-border/40 bg-card p-6 shadow-sm">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-border/40 bg-muted overflow-hidden">
              {company.logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={company.logo}
                  alt={`${company.name} logo`}
                  className="h-full w-full object-contain"
                />
              ) : (
                <span className="text-lg font-semibold text-muted-foreground">
                  {company.name.charAt(0)}
                </span>
              )}
            </div>

            <div>
              <h1 className="text-2xl font-bold">{company.name}</h1>
              <p className="text-sm text-muted-foreground capitalize">
                {company.industry} •
                {company.city && ` ${company.city}` + ', '}
                {company.country}
              </p>
            </div>
          </div>

          <div
            className={clsx(
              'inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold',
              statusStyles[company.status],
            )}
          >
            {company.status === 'PENDING' && <Clock className="h-4 w-4" />}
            {company.status === 'APPROVED' && <CheckCircle className="h-4 w-4" />}
            {company.status === 'REJECTED' && <XCircle className="h-4 w-4" />}
            {company.status}
          </div>
        </div>
      </div>

      {company.status === 'REJECTED' && company.rejectionReason && (
        <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6">
          <h3 className="text-sm font-semibold text-destructive">
            Rejection Reason
          </h3>
          <p className="mt-2 text-sm text-muted-foreground whitespace-pre-line">
            {company.rejectionReason}
          </p>
        </div>
      )}

      <div className="rounded-2xl border border-border/40 bg-card p-6">
        <h2 className="text-lg font-semibold">About the Company</h2>
        <p
          className="mt-3 text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap wrap-break-word"

        >
          {company.description}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <InfoCard title="Company Information">
          <InfoRow icon={<Building2 />} label="Industry" value={company.industry} />
          <InfoRow icon={<MapPin />} label="Location" value={`${company.city && `${company.city}, `}` + company.country} />
          <InfoRow icon={<Users />} label="Company Size" value={company.companySize} />
          <InfoRow
            icon={<Calendar />}
            label="Founded"
            value={company.foundedYear?.toString() || '—'}
          />
        </InfoCard>

        <InfoCard title="Contact Information">
          <InfoRow icon={<Mail />} label="Email" value={company.contactEmail} />
          <InfoRow icon={<Phone />} label="Phone" value={`${company.countryPhoneCode} ${company.contactPhone}` || '—'} />
          <InfoRow icon={<Globe />} label="Website" value={company.website || '—'} isLink />
          <InfoRow
            icon={<Linkedin />}
            label="LinkedIn"
            value={company.linkedinProfile || '—'}
            isLink
          />
          {company.address && (
            <InfoRow icon={<MapPin />} label="Address" value={company.address} />
          )}
        </InfoCard>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Documents</h2>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <DocumentCard
            label="Business Registration"
            hasDocument={!!company.businessDocPath}
            apiUrl={`/api/company/${company.id}/document?type=business`}
          />

          <DocumentCard
            label="Tax Document"
            hasDocument={!!company.taxDocPath}
            apiUrl={`/api/company/${company.id}/document?type=tax`}
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Link href="/company/profile-setup">
          <Button>Edit Profile</Button>
        </Link>
      </div>
    </div>
  )
}

export default CompanyProfileView
