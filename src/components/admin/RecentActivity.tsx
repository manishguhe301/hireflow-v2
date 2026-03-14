import { DashboardStats } from './AdminDashboard'
import { formatRelativeTime } from '@/src/utils/helper'

const RecentActivity = ({ stats: { analytics: { recentActivity } } }:
  { stats: DashboardStats }) => {
  return recentActivity.map((activity, index) => (
    <div
      key={index}
      className="block rounded-xl border border-border/60 bg-card p-4"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="font-medium">{activity.action}</p>
          <p className="text-sm text-muted-foreground line-clamp-1">
            {activity.details}
          </p>
        </div>
        <p className="text-xs text-muted-foreground whitespace-nowrap">
          {formatRelativeTime(activity.timestamp)}
        </p>
      </div>
    </div>
  ))
}

export default RecentActivity