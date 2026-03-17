import { DirCompanyType } from '@/src/types'
import { Building2 } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const CompaniesSection = ({ companies }: {
  companies: DirCompanyType[]
}) => {
  return (
    <section className="border-t border-border/60" id='companies'>
      <div className="mx-auto max-w-7xl px-6 py-24">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-semibold tracking-tight">
            Verified companies on HireFlow<span className="text-primary">.</span>
          </h2>
          <p className="mt-3 text-sm text-muted-foreground max-w-xl mx-auto">
            Every company is manually reviewed and approved by our platform admins before they can post jobs
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
          {companies.map(company => (
            <Link
              href={`/explore/companies/${company.id}`}
              key={company.id}
              className="group flex flex-col items-center justify-center rounded-2xl border border-border/60 bg-card p-6 transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-md"
            >
              <div className="relative mb-4">
                <div className="absolute inset-0 rounded-full border border-primary/30 blur-[0.5px]" />
                <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-border/40 bg-muted overflow-hidden sm:h-12 sm:w-12">
                  {company?.logo ? (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={company?.logo}
                        alt={`${company.name} logo`}
                        className="h-full w-full object-cover transition-all duration-300 group-hover:scale-105" />
                    </>
                  ) : (
                    <Building2 className="h-6 w-6 text-muted-foreground" />
                  )}
                </div>
              </div>

              <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition">
                {company.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export default CompaniesSection