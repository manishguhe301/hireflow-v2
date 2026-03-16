'use client'
import { useRouter } from 'next/navigation'
import { Button } from '../ui/Button'
import { ArrowLeft, CheckCircle, Clock, XCircle } from 'lucide-react'
import clsx from 'clsx'
import { Company } from '@prisma/client'
import { companyIndustries } from '@/src/utils/constants'
import { useSession } from 'next-auth/react'

const CompanyDetailsTopSection = ({ company }: { company: Company }) => {
  const router = useRouter()

  const companyIndustry = companyIndustries.find((ind) =>
    ind.value === company.industry)?.label || company.industry

  const { data: session } = useSession()
  return (
    <>
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="inline-flex items-center gap-2 mb-6 p-0!"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>
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
                {companyIndustry} •  {company.city && ` ${company.city}` + ', '} {company.country}
              </p>
            </div>
          </div>

          {session?.user.role === 'PLATFORM_ADMIN' &&
            <div
              className={clsx(
                'inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold',
                company.status === 'PENDING' &&
                'bg-warning/10 text-warning border border-warning/20',
                company.status === 'APPROVED' &&
                'bg-success/10 text-success border border-success/20',
                company.status === 'REJECTED' &&
                'bg-destructive/10 text-destructive border border-destructive/20'
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