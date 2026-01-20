import { FileText } from "lucide-react";
import Link from "next/link";

const DocumentCard = ({ label, url }: { label: string; url?: string | null }) => (
  <div className="flex items-center justify-between p-4 border border-border/60 rounded-xl bg-card">
    <div className="flex items-center gap-3">
      <FileText className="h-5 w-5 text-muted-foreground" />
      <span className="text-sm font-medium">{label}</span>
    </div>
    {url ? (
      <Link
        href={url}
        target="_blank"
        className="text-sm text-primary hover:underline"
      >
        View
      </Link>
    ) : (
      <span className="text-xs text-muted-foreground">Not uploaded</span>
    )}
  </div>
)

export default DocumentCard