import { TimeSeriesData } from "./CompanyDashboardPage"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

const ApplicationOverTime = ({ timeSeriesData }: { timeSeriesData: TimeSeriesData[] }) => {
  return (
    <div className="bg-card border border-border/60 rounded-2xl p-6">
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={timeSeriesData}>
          <CartesianGrid strokeDasharray="3 3"
            stroke="hsl(var(--border))"
          />
          <XAxis dataKey="date"
            stroke="hsl(var(--text-muted-foreground))" />
          <YAxis
            stroke="hsl(var(--text-muted-foreground))" />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
            }}
          />
          <Line
            type="monotone"
            dataKey="applications"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            dot={{ fill: 'hsl(var(--primary))' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
export default ApplicationOverTime