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

  if (timeSeriesData.length === 0) {
    return (
      <div className="bg-card border border-border/60 rounded-2xl p-6 h-75 flex items-center justify-center">
        <p className="text-center">No data available</p>
      </div>
    )
  }

  return (
    <div className="bg-card border border-border/60 rounded-2xl p-6">
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={timeSeriesData}>
          <CartesianGrid strokeDasharray="3 3"
            stroke="rgb(var(--border))"
          />
          <XAxis dataKey="date"
            stroke="rgb(var(--muted-foreground))"
            angle={-15}
          />
          <YAxis
            stroke="rgb(var(--muted-foreground))"

          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgb(var(--card))',
              border: '1px solid rgb(var(--border))',
              borderRadius: '8px',
            }}
          />

          <Line
            type="monotone"
            dataKey="applications"
            stroke="rgb(var(--primary))"
            strokeWidth={2}
            dot={{ fill: 'rgb(var(--primary))' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
export default ApplicationOverTime