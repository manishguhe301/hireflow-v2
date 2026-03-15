import StatCard from '../../shared/StatCard'
import {
  Layers,
  Eye,
  UserCheck,
  CalendarClock,
  XCircle,
  CheckCircle,
  FileCheck,
  OctagonAlert,
} from 'lucide-react'

interface StatsDataProps {
  total: number
  reviewing: number
  shortlisted: number
  interviewScheduled: number
  rejected: number
  hired: number
  offered: number
  onHold: number
}

const ApplicationDashboardStats = ({
  statsData
}: { statsData: StatsDataProps }) => {
  return (
    <section className="grid grid-cols-1 max-w-full md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4">
      <StatCard
        title="Total"
        value={statsData?.total}
        icon={<Layers className="h-5 w-5" />}
        valueClass='text-3xl! mb-0!'
        colorClass="bg-gray-500/10 text-gray-600"
      />
      <StatCard
        title="Reviewing"
        value={statsData?.reviewing}
        icon={<Eye className="h-5 w-5" />}
        valueClass='text-3xl! mb-0!'
        colorClass="bg-yellow-500/10 text-yellow-600"
      />
      <StatCard
        title="Shortlisted"
        value={statsData?.shortlisted}
        icon={<UserCheck className="h-5 w-5" />}
        valueClass='text-3xl! mb-0!'
        colorClass="bg-purple-500/10 text-purple-600"
      />
      <StatCard
        title="Interview Scheduled"
        value={statsData?.interviewScheduled}
        icon={<CalendarClock className="h-5 w-5" />}
        valueClass='text-3xl! mb-0!'
        colorClass="bg-indigo-500/10 text-indigo-600"
      />
      <StatCard
        title="Rejected"
        value={statsData?.rejected}
        icon={<XCircle className="h-5 w-5" />}
        valueClass='text-3xl! mb-0!'
        colorClass="bg-red-500/10 text-red-600"
      />
      <StatCard
        title="Hired"
        value={statsData?.hired}
        icon={<CheckCircle className="h-5 w-5" />}
        valueClass='text-3xl! mb-0!'
        colorClass="bg-emerald-500/10 text-emerald-600"
      />
      <StatCard
        title="Offered"
        value={statsData?.offered}
        icon={<FileCheck className="h-5 w-5" />}
        valueClass='text-3xl! mb-0!'
        colorClass="bg-amber-500/10 text-amber-600"
      />
      <StatCard
        title="On Hold"
        value={statsData?.onHold}
        icon={<OctagonAlert className="h-5 w-5" />}
        valueClass='text-3xl! mb-0!'
        colorClass="bg-rose-500/10 text-rose-600"
      />
    </section>
  )
}

export default ApplicationDashboardStats