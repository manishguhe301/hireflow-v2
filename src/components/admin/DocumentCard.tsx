import { FileText } from "lucide-react"
import Link from "next/link"

const DocumentCard = ({
  label,
  url,
}: {
  label: string
  url?: string | null
}) => (
  <div className="flex items-center justify-between rounded-2xl border border-border/40 bg-card p-5 shadow-sm">
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted">
        <FileText className="h-5 w-5 text-muted-foreground" />
      </div>

      <div>
        <p className="text-sm font-semibold">{label}</p>
        <p className="text-xs text-muted-foreground">
          {url ? 'Uploaded' : 'Not uploaded'}
        </p>
      </div>
    </div>

    {url ? (
      <Link
        href={url}
        target="_blank"
        className="text-sm font-medium text-primary hover:underline"
      >
        View
      </Link>
    ) : (
      <span className="text-xs text-muted-foreground">—</span>
    )}
  </div>
)

export default DocumentCard
