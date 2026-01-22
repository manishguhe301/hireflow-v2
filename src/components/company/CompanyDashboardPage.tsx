'use client'

import { useCompany } from '@/src/store/hooks/useCompany'
import Link from 'next/link'

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

      {company?.status === 'PENDING' && (
        <div className="max-w-2xl rounded-2xl border border-warning/30 bg-warning/10 p-4 text-sm">
          ⏳ Your profile is under review by our admin team.
        </div>
      )}

      {company?.status === 'REJECTED' && (
        <div className="max-w-2xl rounded-2xl border border-destructive/30 bg-destructive/10 p-4">
          <p className="font-semibold">Profile Rejected</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {company.rejectionReason}
          </p>
          <Link href="/company/profile-setup">
            <button className="mt-3 rounded-xl bg-destructive px-4 py-2 text-sm text-destructive-foreground">
              Resubmit Profile
            </button>
          </Link>
        </div>
      )}

      <div className="text-muted-foreground">
        Dashboard stats coming soon…
      </div>
    </div>
  )
}
