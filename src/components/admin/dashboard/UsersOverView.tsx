import React from 'react'
import StatCard from '../../shared/StatCard'
import { Briefcase, UserCog, Users } from 'lucide-react'
import { AdminDashboardStats } from '@/src/types'

const UsersOverView = ({ stats: { users } }: { stats: AdminDashboardStats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatCard
        title="Total Users"
        value={users.total}
        description="All platform users"
        icon={<Users className="h-6 w-6 text-violet-600 dark:text-violet-400" />}
        colorClass="bg-info/10"
      />
      <StatCard
        title="Job Seekers"
        value={users.jobSeekers}
        description="Active job seekers"
        icon={<Briefcase className="h-6 w-6 text-primary" />}
        colorClass="bg-primary/10"
      />
      <StatCard
        title="Platform Admins"
        value={users.admins}
        description="Admin accounts"
        icon={<UserCog className="h-6 w-6 text-slate-600 dark:text-slate-400" />}
        colorClass="bg-muted"
      />
    </div>)
}

export default UsersOverView