import React from 'react'
import { DashboardStats } from '../AdminDashboard'
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

const UserGrowthChart = ({ stats: { analytics: { userGrowth } } }:
  { stats: DashboardStats }
) => {
  return (
    <div className="bg-card border border-border/60 rounded-2xl p-6">
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={userGrowth}>
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
          <Line
            type="monotone"
            dataKey="users"
            stroke="rgb(var(--primary))"
            strokeWidth={2}
            dot={{ fill: 'rgb(var(--primary))' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default UserGrowthChart