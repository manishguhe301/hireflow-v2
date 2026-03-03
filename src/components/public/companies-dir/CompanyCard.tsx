'use client'

import Link from 'next/link'
import { Building2, MapPin, Briefcase } from 'lucide-react'
import { useState } from 'react'
import clsx from 'clsx'

type CompanyCardProps = {
  company: {
    id: string
    name: string
    logo: string | null
    industry: string
    country: string
    companySize: string
    city?: string
    jobCount: number
  }
}

export default function CompanyCard({ company }: CompanyCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false)

  return (
    <Link href={`/explore/companies/${company.id}`} className="h-full">
      <div className="group flex h-full flex-col rounded-3xl border border-border/40 bg-card p-6 transition-all duration-200 hover:border-primary/40 hover:shadow-xl">
        <div className="mb-5 flex justify-center">
          <div className=" relative flex h-20 w-20 items-center justify-center rounded-2xl border border-border/40 bg-muted overflow-hidden transition group-hover:border-primary/40">
            <>
              {company.logo ? (
                <>
                  {!imageLoaded && (
                    <div className="absolute inset-0 animate-pulse bg-muted" />
                  )}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={company.logo}
                    alt={company.name}
                    onLoad={() => setImageLoaded(true)}
                    onError={() => setImageLoaded(true)}
                    className={clsx(
                      "h-full w-full object-cover transition-opacity duration-300",
                      imageLoaded ? "opacity-100" : "opacity-0"
                    )} />
                </>
              ) : (
                <span className="text-2xl font-bold text-muted-foreground">
                  {company.name.charAt(0)}
                </span>
              )}
            </>
          </div>
        </div>

        <h3 className="mb-2 text-center text-lg font-semibold line-clamp-1 transition group-hover:text-primary">
          {company.name}
        </h3>

        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center justify-center gap-1.5 capitalize">
            <Building2 className="h-4 w-4 shrink-0" />
            <span className="line-clamp-1">{company.industry}</span>
          </div>

          <div className="flex items-center justify-center gap-1.5">
            <MapPin className="h-4 w-4 shrink-0" />
            <span className="line-clamp-1">
              {company.city && ` ${company.city}` + ', '}{company.country}
            </span>
          </div>
        </div>

        <div className="mt-auto pt-5">
          <div className="flex items-center justify-center gap-2 rounded-xl bg-primary/5 px-4 py-2 text-sm font-medium text-primary transition group-hover:bg-primary/10">
            <Briefcase className="h-4 w-4" />
            <span>
              {company.jobCount} {company.jobCount === 1 ? 'job' : 'jobs'} available
            </span>
          </div>
        </div>
      </div>
    </Link>

  )
}