'use client'

interface StatCardProps {
  title: string
  value: number
  description: string
  icon: React.ReactNode
  colorClass: string
}

const StatCard = ({ title, value, description, icon, colorClass }: StatCardProps) => {
  return (
    <div className="bg-card border border-border/60 rounded-2xl p-6 hover:border-primary/40 transition hover:shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-4xl font-bold whitespace-nowrap mt-3 mb-2">{value}</p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
        <div className={`h-12 w-12 rounded-xl ${colorClass} flex items-center justify-center flex-shrink-0 ml-4`}>
          {icon}
        </div>
      </div>
    </div>
  )
}

export default StatCard