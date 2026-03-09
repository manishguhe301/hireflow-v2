import Link from 'next/link'
import { Button } from '@/src/components/ui/Button'
import { Building2 } from 'lucide-react'

export default function NotFound() {
  return (
    <main className="flex min-h-[80vh] items-center justify-center bg-background px-4">
      <div className="w-full max-w-lg rounded-3xl border border-border/60 bg-card p-8 text-center shadow-sm">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-border/60 bg-muted">
          <Building2 className="h-10 w-10 text-muted-foreground" />
        </div>

        <h1 className="text-2xl font-semibold tracking-tight">
          We couldn&apos;t find this company        </h1>

        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          The company you&apos;re looking for doesn&apos;t exist, may have been removed,
          or is not publicly available.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href="/">
            <Button variant="ghost">
              Go Home
            </Button>
          </Link>

          <Link href="/explore/companies" className="w-full sm:w-auto">
            <Button className="w-full">
              Browse Companies
            </Button>
          </Link>

          <Link href="/explore/jobs" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full">
              View Jobs
            </Button>
          </Link>
        </div>
      </div>
    </main>
  )
}
