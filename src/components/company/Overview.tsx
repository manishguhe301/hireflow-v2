import { CompanyDashboardStats } from '@/src/types'
import React from 'react'
import StatCard from '../shared/StatCard'
import { Briefcase, Eye, FileText, Users } from 'lucide-react'

const Overview = ({ stats }: {
  stats: CompanyDashboardStats
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Total Jobs"
        value={stats.totalJobs}
        description={`${stats.activeJobs} active`}
        icon={<Briefcase className="h-5 w-5" />}
        colorClass="bg-primary/10 text-primary"
      />
      <StatCard
        title="Applications"
        value={stats.totalApplications}
        description="All time"
        icon={<FileText className="h-5 w-5" />}
        colorClass="bg-blue-500/10 text-blue-600"
      />
      <StatCard
        title="Total Views"
        value={stats.totalViews}
        description="Job impressions"
        icon={<Eye className="h-5 w-5" />}
        colorClass="bg-purple-500/10 text-purple-600"
      />
      <StatCard
        title="Hired"
        value={stats.statusBreakdown.hired}
        description="Successful hires"
        icon={<Users className="h-5 w-5" />}
        colorClass="bg-emerald-500/10 text-emerald-600"
      />
    </div>
  )
}

export default Overview