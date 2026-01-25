const InfoCard = ({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) => (
  <div className="rounded-2xl border border-border/40 bg-card p-6 space-y-5 shadow-sm">
    <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
      {title}
    </h3>
    <div className="space-y-4">{children}</div>
  </div>
)

export default InfoCard
