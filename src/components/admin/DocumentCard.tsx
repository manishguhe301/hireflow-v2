import { AppSdk } from "@/src/utils/AppSdk"
import { ExternalLink, Eye, FileText } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { toast } from "sonner"
import { Button } from "../ui/Button"

const DocumentCard = ({
  label, companyId
}: {
  label: string
  companyId: string
}) => {
  const [loading, setLoading] = useState(false)
  const [signedUrl, setSignedUrl] = useState<string | null>(null)

  const handleReveal = async () => {
    setLoading(true)
    try {
      const res = await AppSdk.getData(
        `/api/company/${companyId}/document`,
        null
      )

      if (!res?.url) {
        toast.error('Failed to retrieve document')
        return
      }

      setSignedUrl(res.url)
    } catch {
      toast.error('Unable to access document')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-xl border border-border/60 bg-card p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FileText className="h-5 w-5 text-muted-foreground" />
          <span className="text-sm font-medium">{label}</span>
        </div>

        {!signedUrl && (
          <Button
            size="sm"
            variant="outline"
            onClick={handleReveal}
            disabled={loading}
            className="flex items-center gap-2"
          >
            {loading ? 'Revealing…' : 'Reveal'}
            {!loading && <Eye className="h-4 w-4" />}
          </Button>
        )}
        {signedUrl && (
          <div className="flex items-center gap-2 text-sm">
            <ExternalLink className="h-4 w-4 text-primary" />
            <Link
              href={signedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline underline-offset-2 break-all"
            >
              Open document
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}


export default DocumentCard