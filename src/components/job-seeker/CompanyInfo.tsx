'use client'
import { CompanyInfoForJob } from '@/src/types'
import React from 'react'
import { Button } from '../ui/Button'
import { useRouter } from 'next/navigation'
import { companyIndustries } from '@/src/utils/constants'
import { getLabel } from '@/src/utils/helper'
import { useSession } from 'next-auth/react'
import clsx from 'clsx'

const CompanyInfo = ({
  company
}: {
  company: CompanyInfoForJob
}) => {
  const router = useRouter()
  const { data: session } = useSession()
  return (
    <div className="rounded-2xl border border-border/40 bg-card p-6 space-y-4">
      <div className="flex items-center gap-4 ">
        {company?.logo ? (
          <div className='relative'>
            {/* eslint-disable-next-line */}
            <img
              src={company?.logo}
              alt={company.name}
              className={clsx("h-14 w-14 rounded-lg object-cover border border-border",
                'transition-opacity duration-300',
              )}
            />
          </div>
        ) : (
          <div className="h-14 w-14 rounded-lg bg-muted flex items-center justify-center" >
            {company.name.charAt(0).toUpperCase()}
          </div>
        )}
        <div>
          <h4 className="font-semibold">
            {company.name}
          </h4>
          <p className="text-xs text-muted-foreground">
            {getLabel(companyIndustries, company.industry)}
          </p>
        </div>
      </div>

      <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
        {company.description || '-'}
      </p>

      <Button
        variant='ghost'
        onClick={() =>
          router.push(
            session?.user.id
              ? `/company-details/${company.id}` :
              `/explore/companies/${company.id}`)
        }
        className="text-sm font-medium text-primary hover:underline"
      >
        View Company
      </Button>
    </div>
  )
}

export default CompanyInfo