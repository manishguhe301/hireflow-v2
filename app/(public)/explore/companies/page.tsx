import { Spinner } from '@/src/components/elements/Loader'
import CompaniesDirectory from '@/src/components/public/companies-dir/CompaniesDirectory'
import { Metadata } from 'next'
import { Suspense } from 'react'

export const metadata: Metadata = {
  title: 'Companies - Find Your Next Employer | HireFlow',
  description: 'Browse companies hiring on HireFlow. Discover top employers and explore job opportunities.',
}

export default function CompaniesPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <Spinner className="h-8 w-8 mb-3" />
          <p className="text-sm text-muted-foreground">
            Loading companies...
          </p>
        </div>
      }
    >
      <CompaniesDirectory />
    </Suspense>
  )
}