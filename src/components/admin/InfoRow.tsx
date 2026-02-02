const InfoRow = ({
  icon,
  label,
  value,
  isLink
}: {
  icon: React.ReactNode
  label: string
  value: string
  isLink?: boolean
}) => {
  return (
    <div className="flex items-center gap-3">
      <div className="text-muted-foreground">{icon}</div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        {isLink && value !== '—' ? (
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-primary hover:underline"
          >
            {value}
          </a>
        ) : (
          <p className="text-sm font-medium">{value}</p>
        )}
      </div>
    </div>
  )
}

export default InfoRow
