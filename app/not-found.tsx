import Link from 'next/link'
import { AlertTriangle, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <main className="min-h-screen bg-background text-foreground flex items-center justify-center px-6">
      <div className="max-w-md text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted/40 text-warning">
          <AlertTriangle className="h-10 w-10" />
        </div>

        <h1 className="mt-8 text-5xl font-extrabold tracking-tight">
          404
        </h1>

        <h2 className="mt-4 text-xl font-semibold">
          Page not found
        </h2>

        <p className="mt-3 text-muted-foreground">
          The page you’re looking for doesn’t exist, was moved, or is no longer available.
        </p>

        <div className="mt-8 flex items-center justify-center">
          <Link
            href="/redirect"
            className="inline-flex items-center gap-2 rounded-xl border border-border/40 bg-card px-5 py-2.5 text-sm font-medium hover:bg-muted/40 transition"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to dashboard
          </Link>
        </div>

        <p className="mt-10 text-xs text-muted-foreground">
          © {new Date().getFullYear()} HireFlow — Verified hiring, simplified.
        </p>
      </div>
    </main>
  )
}
