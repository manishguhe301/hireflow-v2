import { AdminDashboardStats } from '@/src/types'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

const JobTrendsChart = (
  { stats:
    {
      analytics: {
        jobTrends
      }
    }
  }: { stats: AdminDashboardStats }) => {
  return (
    <div className="bg-card border border-border/60 rounded-2xl p-6">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={jobTrends}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--border))" />
          <XAxis dataKey="month" stroke="rgb(var(--muted-foreground))" />
          <YAxis stroke="rgb(var(--muted-foreground))" />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgb(var(--card))',
              border: '1px solid rgb(var(--border))',
              borderRadius: '8px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
            }}
          />
          <Bar dataKey="jobs" fill="rgb(var(--primary))" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default JobTrendsChart