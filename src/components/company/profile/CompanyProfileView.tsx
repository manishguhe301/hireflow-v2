'use client'

import Link from 'next/link'
import { useCompany } from '@/src/store/hooks/useCompany'
import { Button } from '@/src/components/ui/Button'
import { ProfileSkeleton } from '../../skeletons/ProfileSkeleton'
import CompanyDetailsTopSection from '../../shared/CompanyDetailsTopSection'
import CompanyiInfo from '../../shared/CompanyiInfo'
import CompanyDocs from '../../shared/CompanyDocs'

const CompanyProfileView = () => {
  const { company, isLoading, error } = useCompany()

  if (isLoading) {
    return (
      <ProfileSkeleton />
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
      <CompanyDetailsTopSection company={company} />
      <CompanyiInfo company={company} />
      <CompanyDocs
        paths={{
          businessDocPath: company.businessDocPath,
          taxDocPath: company.taxDocPath
        }}
        companyId={company.id}
      />
      <div className="flex justify-end pt-2 border-t border-border/40">
        <Link href="/company/profile-setup">
          <Button>Edit Profile</Button>
        </Link>
      </div>
    </div>
  )
}

export default CompanyProfileView
