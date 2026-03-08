import { AppSdk } from "@/src/utils/AppSdk"
import { ExternalLink, Eye, FileText } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { toast } from "sonner"
import { Button } from "../ui/Button"

const DocumentCard = ({
  label,
  hasDocument,
  apiUrl,
  onReveal,
  desc
}: {
  label: string
  hasDocument: boolean
  apiUrl?: string
  onReveal?: () => Promise<string>
  desc?: string
}) => {

  const [loading, setLoading] = useState(false)
  const [signedUrl, setSignedUrl] = useState<string | null>(null)

  const handleReveal = async () => {
    if (!hasDocument || loading) return

    setLoading(true)
    try {
      let url: string | null = null

      // const res = await AppSdk.getData(
      //   `/api/company/${companyId}/document?type=${type}`,
      //   null
      // );

      // if (!res?.url) {
      //   toast.error('Failed to retrieve document')
      //   return
      // }

      // setSignedUrl(res.url)
      if (onReveal) {
        url = await onReveal()
      } else if (apiUrl) {
        const res = await AppSdk.getData(apiUrl, null)
        // console.log(res);
        if (!res?.url) {
          throw new Error('No document url returned')
        }
        url = res?.url || null
      }
      if (!url) {
        toast.error('Failed to retrieve document')
        return
      }

      setSignedUrl(url)
    } catch {
      // console.log(apiUrl);
      toast.error('Unable to access document')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-xl border border-border/60 bg-card p-4 hover:border-primary/30 transition flex items-center">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 w-full">

        <div className="flex items-start gap-3 min-w-0">
          <FileText className="h-5 w-5 text-muted-foreground shrink-0" />

          <div className="flex flex-col min-w-0">
            <p className="text-sm font-medium">{label}</p>

            {hasDocument && (
              <span className="text-[11px] text-muted-foreground">
                Secure document
              </span>
            )}

            {desc && (
              <span className="text-xs text-muted-foreground leading-relaxed">
                {desc}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">

          {!hasDocument && (
            <span className="text-xs text-muted-foreground">
              Not uploaded
            </span>
          )}

          {hasDocument && !signedUrl && (
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

          {hasDocument && signedUrl && (
            <div className="flex flex-col text-sm">
              <Link
                href={signedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline break-all"
              >
                Open document
              </Link>

              <span className="text-[11px] text-muted-foreground">
                Link expires shortly
              </span>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}


export default DocumentCard