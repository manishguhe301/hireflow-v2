import StatCard from '../shared/StatCard'
import { DashboardStats } from './AdminDashboard'
import { Briefcase, CheckCircle, FileText, XCircle } from 'lucide-react'

const PlatFormOverView = ({ stats: { platform } }: { stats: DashboardStats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="Total Jobs"
        value={platform.totalJobs}
        description="Posted on platform"
        icon={<Briefcase className="h-6 w-6 text-primary" />}
        colorClass="bg-primary/10"
      />
      <StatCard
        title="Applications"
        value={platform.totalApplications}
        description="Total submissions"
        icon={<FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />}
        colorClass="bg-info/10"
      />
      <StatCard
        title="Approved (30d)"
        value={platform.recentApprovals}
        description="Companies approved"
        icon={<CheckCircle className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />}
        colorClass="bg-success/10"
      />
      <StatCard
        title="Rejected (30d)"
        value={platform.recentRejections}
        description="Companies rejected"
        icon={<XCircle className="h-6 w-6 text-red-600 dark:text-red-400" />}
        colorClass="bg-destructive/10"
      />
    </div>
  )
}

export default PlatFormOverView