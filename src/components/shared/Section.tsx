import { Pencil } from "lucide-react"

const Section = ({
  title,
  onEdit,
  children,
  disabled
}: {
  title: string
  onEdit: () => void
  children: React.ReactNode
  disabled?: boolean
}) => {
  return (
    <div className="rounded-2xl border border-border/40 bg-card p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold">{title}</h3>
        <button
          type="button"
          onClick={onEdit}
          disabled={disabled}
          className="flex items-center gap-1 text-sm text-primary hover:underline"
        >
          <Pencil className="h-4 w-4" />
          Edit
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
        {children}
      </div>
    </div>
  )
}

export default Section