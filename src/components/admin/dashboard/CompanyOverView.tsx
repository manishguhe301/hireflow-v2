import React from 'react'
import StatCard from '../../shared/StatCard'
import { DashboardStats } from '../AdminDashboard'
import { Building2, CheckCircle, Clock, XCircle } from 'lucide-react'

const CompanyOverView = ({ stats: { companies } }: { stats: DashboardStats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="Total Companies"
        value={companies.total}
        description="All registered companies"
        icon={<Building2 className="h-6 w-6 text-blue-600 dark:text-blue-400" />}
        colorClass="bg-info/10"
      />
      <StatCard
        title="Pending Approval"
        value={companies.pending}
        description="Awaiting admin review"
        icon={<Clock className="h-6 w-6 text-amber-500 dark:text-amber-400" />}
        colorClass="bg-warning/10"
      />
      <StatCard
        title="Approved"
        value={companies.approved}
        description="Active companies"
        icon={<CheckCircle className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />}
        colorClass="bg-success/10"
      />
      <StatCard
        title="Rejected"
        value={companies.rejected}
        description="Declined companies"
        icon={<XCircle className="h-6 w-6 text-red-600 dark:text-red-400" />}
        colorClass="bg-destructive/10"
      />
    </div>
  )
}

export default CompanyOverView