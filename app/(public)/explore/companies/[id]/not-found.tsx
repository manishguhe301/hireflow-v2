import Link from 'next/link'
import { Button } from '@/src/components/ui/Button'
import { Building2 } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-muted p-6">
            <Building2 className="h-12 w-12 text-muted-foreground" />
          </div>
        </div>

        <h1 className="text-2xl font-bold mb-2">Company Not Found</h1>
        <p className="text-muted-foreground mb-6">
          This company doesn&apos;t exist or is no longer available.
        </p>

        <div className="flex gap-3 justify-center max-sm:flex-col max-sm:w-full">
          <Link href="/companies">
            <Button>Browse Companies</Button>
          </Link>
          <Link href="/jobs">
            <Button variant="outline">View Jobs</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}