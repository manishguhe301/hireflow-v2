const InfoRow = ({
  icon,
  label,
  value,
}: {
  icon?: React.ReactNode
  label: string
  value: string
}) => (
  <div className="flex items-start gap-3 text-sm">
    {icon && <span className="text-muted-foreground">{icon}</span>}
    <div>
      <p className="text-muted-foreground">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  </div>
)

export default InfoRow