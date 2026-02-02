'use client'

import Link from 'next/link'
import { Building2, MapPin, Briefcase } from 'lucide-react'

type CompanyCardProps = {
  company: {
    id: string
    name: string
    logo: string | null
    industry: string
    location: string
    companySize: string
    jobCount: number
  }
}

export default function CompanyCard({ company }: CompanyCardProps) {
  return (
    <Link href={`/explore/companies/${company.id}`}>
      <div className="group h-full rounded-2xl border border-border/40 bg-card p-6 hover:border-primary/40 hover:shadow-lg transition-all duration-200">
        {/* Logo */}
        <div className="mb-4 flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-xl border border-border/40 bg-muted overflow-hidden group-hover:border-primary/40 transition">
            {company.logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={company.logo}
                alt={company.name}
                className="h-full w-full object-contain"
              />
            ) : (
              <span className="text-2xl font-bold text-muted-foreground">
                {company.name.charAt(0)}
              </span>
            )}
          </div>
        </div>

        {/* Company Name */}
        <h3 className="text-center text-lg font-semibold mb-2 line-clamp-1 group-hover:text-primary transition">
          {company.name}
        </h3>

        {/* Industry */}
        <div className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground mb-3">
          <Building2 className="h-4 w-4" />
          <span className="line-clamp-1">{company.industry}</span>
        </div>

        {/* Location */}
        <div className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground mb-4">
          <MapPin className="h-4 w-4" />
          <span className="line-clamp-1">{company.location}</span>
        </div>

        {/* Job Count */}
        <div className="mt-auto pt-4 border-t border-border/40">
          <div className="flex items-center justify-center gap-2 text-sm font-medium text-primary">
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