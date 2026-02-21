import { AnalyticsData } from "./CompanyDashboardPage"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

const TopJobs = ({ analytics }: {
  analytics: AnalyticsData
}) => {
  return (
    <div className="bg-card border border-border/60 rounded-2xl p-6">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={analytics.applicationsPerJob.slice(0, 5)}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis
            dataKey="jobTitle"
            stroke="hsl(var(--muted-foreground))"
            tick={{ fontSize: 12 }}
            angle={-15}
            textAnchor="end"
            height={80}
          />
          <YAxis stroke="hsl(var(--muted-foreground))" />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
            }}
          />
          <Bar dataKey="applications" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
export default TopJobs