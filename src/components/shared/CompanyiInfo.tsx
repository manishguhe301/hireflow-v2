'use client'
import { Company } from '@prisma/client'
import {
  Building2,
  Calendar,
  Globe,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Users,
  XCircle
} from 'lucide-react'
import InfoCard from './InfoCard'
import InfoRow from './InfoRow'
import { companyIndustries } from '@/src/utils/constants'
import { useSession } from 'next-auth/react'

const CompanyiInfo = ({ company }: {
  company: Company,
}) => {
  const { data: session } = useSession()
  const companyIndustry = companyIndustries.find((ind) =>
    ind.value === company.industry)?.label || company.industry
  return (
    <div>

      {session && session?.user.role !== 'JOB_SEEKER' && 'REJECTED' && company.rejectionReason && (
        <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6 space-y-2">
          <div className="flex items-center gap-2">
            <XCircle className="h-5 w-5 text-destructive" />
            <h2 className="text-sm font-semibold text-destructive">
              Rejection Reason
            </h2>
          </div>

          <p className="text-sm text-muted-foreground whitespace-pre-line">
            {company.rejectionReason}
          </p>
        </div>
      )}

      <div className="rounded-2xl border border-border/40 bg-card p-6 space-y-3 ">
        <h2 className="text-lg font-semibold">
          About the Company
        </h2>

        <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap break-words ">
          {company.description || '—'}
        </p>

      </div>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InfoCard title="Company Information">
          <InfoRow
            icon={<Building2 />}
            label="Industry"
            value={companyIndustry}
          />
          <InfoRow
            label="Company Size
            " icon={<Users
            />} value={company
              .companySize}
          />
          <InfoRow
            label="Founded"
            icon={<Calendar />}
            value={company.foundedYear
              ?.toString() || '—'}
          />
          <InfoRow
            icon={<MapPin />}
            label="Location"
            value={`${company.city
              && `${company.city}, `}` + company.country}
          />
        </InfoCard>

        <InfoCard title="Contact Information">
          {session && session?.user.role !== 'JOB_SEEKER' &&
            <>
              <InfoRow
                icon={<Mail />}
                label="Email"
                value={company.contactEmail}
              />
              <InfoRow
                icon={<Phone />}
                label="Phone"
                value={company.contactPhone
                  ? `${company.countryPhoneCode} ${company.contactPhone}` :
                  'N/A'}
              />
            </>
          }
          <InfoRow
            icon={<Globe />}
            label="Website"
            value={company.website
              || '—'}
            isLink
          />
          <InfoRow
            icon={<Linkedin />}
            label="LinkedIn"
            value={company.linkedinProfile || '—'}
            isLink
          />
          {company.address && (
            <InfoRow
              icon={<MapPin />}
              label="Address"
              value={company.address} />
          )}
        </InfoCard>
      </section>
    </div>
  )
}

export default CompanyiInfo