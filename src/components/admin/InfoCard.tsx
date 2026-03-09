import clsx from "clsx"

const InfoCard = ({
  title,
  children,
  className
}: {
  title: string
  children: React.ReactNode
  className?: string
}) => (
  <div className={clsx("rounded-2xl border border-border/40 bg-card p-6 space-y-5 shadow-sm", className)}>
    <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
      {title}
    </h3>
    <div className="space-y-4">{children}</div>
  </div>
)

export default InfoCard
