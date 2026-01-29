import Link from "next/link"

const InfoRow = ({
  icon,
  label,
  value,
  isLink
}: {
  icon?: React.ReactNode
  label: string
  value: string
  isLink?: boolean
}) => (
  <div className="flex items-start gap-3">
    {icon && (
      <span className="mt-0.5 text-muted-foreground">{icon}</span>
    )}
    <div className="space-y-0.5">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      {isLink && value !== '—' ? (
        <Link
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium text-primary hover:underline"
        >
          {value}
        </Link>
      ) : (
        <p className="text-sm font-medium">{value}</p>
      )}
    </div>
  </div>
)

export default InfoRow
