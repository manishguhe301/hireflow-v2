'use client'

import { useCompany } from '@/src/store/hooks/useCompany'

export default function CompanyDashboard() {
  const { company } = useCompany()
  return (
    <div className="space-y-6 max-sm:mx-4 my-6">
      <div>
        <h1 className="text-3xl font-bold">Company Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome, {company?.name}
        </p>
      </div>

      <div className="text-muted-foreground">
        Dashboard stats coming soon…
      </div>
    </div>
  )
}
