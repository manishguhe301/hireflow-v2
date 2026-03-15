import { Stats } from './JobApplicants'
import StatCard from '../../shared/StatCard'
import {
  CalendarClock,
  CheckCircle,
  Eye,
  FileCheck,
  Layers,
  OctagonAlert,
  UserCheck,
  XCircle
} from 'lucide-react';

const ApplicationStats = ({
  stats
}: { stats: Stats }) => {
  return (
    <section className="grid grid-cols-1 max-w-full md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4">
      <StatCard
        title="Total"
        value={stats.total}
        icon={<Layers className="h-5 w-5" />}
        colorClass="bg-gray-500/10 text-gray-600"
        isValueSmall
      />
      <StatCard
        title="Reviewing"
        value={stats.reviewing}
        icon={<Eye className="h-5 w-5" />}
        colorClass="bg-yellow-500/10 text-yellow-600"
        isValueSmall
      />
      <StatCard
        title="Shortlisted"
        value={stats.shortlisted}
        icon={<UserCheck className="h-5 w-5" />}
        colorClass="bg-purple-500/10 text-purple-600"
        isValueSmall
      />
      <StatCard
        title="Interview Scheduled"
        value={stats.interviewScheduled}
        icon={<CalendarClock className="h-5 w-5" />}
        colorClass="bg-indigo-500/10 text-indigo-600"
        isValueSmall
      />
      <StatCard
        title="Rejected"
        value={stats.rejected}
        icon={<XCircle className="h-5 w-5" />}
        colorClass="bg-red-500/10 text-red-600"
        isValueSmall
      />
      <StatCard
        title="Hired"
        value={stats.hired}
        icon={<CheckCircle className="h-5 w-5" />}
        colorClass="bg-emerald-500/10 text-emerald-600"
        isValueSmall
      />
      <StatCard
        title="Offered"
        value={stats.offered}
        icon={<FileCheck className="h-5 w-5" />}
        colorClass="bg-amber-500/10 text-amber-600"
        isValueSmall
      />
      <StatCard
        title="On Hold"
        value={stats.onHold}
        icon={<OctagonAlert className="h-5 w-5" />}
        colorClass="bg-rose-500/10 text-rose-600"
        isValueSmall
      />
    </section>
  )
}

export default ApplicationStats