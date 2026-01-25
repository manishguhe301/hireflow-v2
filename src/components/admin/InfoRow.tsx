const InfoRow = ({
  icon,
  label,
  value,
}: {
  icon?: React.ReactNode
  label: string
  value: string
}) => (
  <div className="flex items-start gap-3">
    {icon && (
      <span className="mt-0.5 text-muted-foreground">{icon}</span>
    )}
    <div className="space-y-0.5">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="text-sm font-semibold text-foreground">
        {value}
      </p>
    </div>
  </div>
)

export default InfoRow
