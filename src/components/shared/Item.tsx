import clsx from "clsx"

const Item = ({
  label,
  value,
  required = true
}: {
  label: string
  value?: string
  required?: boolean
}) => (
  <div>
    <p className="text-xs text-muted-foreground">
      {label}
      {required && !value && <span className="text-red-500 ml-1">*</span>}
    </p>
    <p className={clsx(
      'font-medium whitespace-pre-wrap wrap-break-word',
      !value && required && 'text-red-500',
      !value && !required && 'text-muted-foreground'
    )}>
      {value || (required ? 'Required' : '—')}
    </p>
  </div>
)

export default Item