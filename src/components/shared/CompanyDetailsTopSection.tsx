'use client'
import { CheckCircle, Clock, XCircle } from 'lucide-react'
import clsx from 'clsx'
import { Company, CompanyStatus } from '@prisma/client'
import { useSession } from 'next-auth/react'
import BackButton from './BackButton'

const statusStyles: Record<CompanyStatus, string> = {
  PENDING: 'bg-warning/10 text-warning border-warning/30',
  APPROVED: 'bg-success/10 text-success border-success/30',
  REJECTED: 'bg-destructive/10 text-destructive border-destructive/30',
}

const CompanyDetailsTopSection = ({ company }: { company: Company }) => {

  const { data: session } = useSession()
  return (
    <>
      {session?.user.role !== 'COMPANY_ADMIN' &&
        <BackButton />
      }
      <div className="rounded-2xl border border-border/40 bg-card p-8 shadow-sm">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="flex items-start gap-4">
            <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-border/40 bg-muted overflow-hidden">
              {company?.logo ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={company?.logo}
                    alt={`${company.name} logo`}
                    className={clsx(
                      "h-full w-full object-cover transition-opacity duration-300",
                    )}
                    loading="lazy"
                  />
                </>
              ) : (
                <span className="text-sm font-semibold text-muted-foreground">
                  {company.name.charAt(0).toUpperCase()}
                </span>
              )}
            </div>

            <div className="space-y-1">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight capitalize">
                {company.name}
              </h1>
              <p className="text-sm text-muted-foreground capitalize">
                {company.industry} • {company.companySize}
              </p>

              <p className="text-xs text-muted-foreground mt-1">
                {company.city && `${company.city}, `}{company.country}
                {company.foundedYear && ` • Founded ${company.foundedYear}`}
              </p>
            </div>
          </div>

          {session && session?.user.role !== 'JOB_SEEKER' &&
            <div
              className={clsx(
                'inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold',
                statusStyles[company.status],
              )}
            >
              {company.status === 'PENDING' ?
                <Clock className="h-4 w-4" /> :
                company.status === 'APPROVED' ?
                  <CheckCircle className="h-4 w-4" /> :
                  <XCircle className="h-4 w-4" />
              }
              {company.status}
            </div>
          }
        </div>
      </div>
    </>
  )
}

export default CompanyDetailsTopSection