import React from 'react'
import StatCard from '../../shared/StatCard'
import { JobSeekerDashboardStats } from '@/src/types'
import { APPLICATION_TABS_STATUS_COLORS } from '@/src/utils/helper'
import {
  Layers,
  Send,
  Eye,
  UserCheck,
  CalendarClock,
  XCircle,
  Gift,
  CheckCircle,
} from 'lucide-react'

const ApplicationsOverview = ({
  statsData
}: { statsData: JobSeekerDashboardStats }) => {
  return (
    <>
      <StatCard
        title="Total"
        value={statsData.total}
        description="All your applications"
        colorClass={APPLICATION_TABS_STATUS_COLORS.total}
        icon={<Layers className="h-5 w-5" />}
      />

      <StatCard
        title="Applied"
        value={statsData.applied}
        description="Submitted applications"
        colorClass={APPLICATION_TABS_STATUS_COLORS.applied}
        icon={<Send className="h-5 w-5" />}
      />

      <StatCard
        title="Reviewing"
        value={statsData.reviewing}
        description="Under review"
        colorClass={APPLICATION_TABS_STATUS_COLORS.reviewing}
        icon={<Eye className="h-5 w-5" />}
      />

      <StatCard
        title="Shortlisted"
        value={statsData.shortlisted}
        description="Selected for interview"
        colorClass={APPLICATION_TABS_STATUS_COLORS.shortlisted}
        icon={<UserCheck className="h-5 w-5" />}
      />

      <StatCard
        title="Interview"
        value={statsData.interviewScheduled}
        description="Interview scheduled"
        colorClass={APPLICATION_TABS_STATUS_COLORS.interviewScheduled}
        icon={<CalendarClock className="h-5 w-5" />}
      />

      <StatCard
        title="Rejected"
        value={statsData.rejected}
        description="Not selected"
        colorClass={APPLICATION_TABS_STATUS_COLORS.rejected}
        icon={<XCircle className="h-5 w-5" />}
      />

      <StatCard
        title="Offered"
        value={statsData.offered}
        description="Offer received"
        colorClass={APPLICATION_TABS_STATUS_COLORS.offered}
        icon={<Gift className="h-5 w-5" />}
      />

      <StatCard
        title="Hired"
        value={statsData.hired}
        description="Successfully hired"
        colorClass={APPLICATION_TABS_STATUS_COLORS.hired}
        icon={<CheckCircle className="h-5 w-5" />}
      />
    </>
  )
}

export default ApplicationsOverview