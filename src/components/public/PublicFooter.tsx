import Link from 'next/link'

export default function PublicFooter() {
  return (
    <footer className="mt-auto border-t border-border/60">
      <div className="mx-auto max-w-7xl px-6 py-14 grid gap-10 md:grid-cols-3">
        <div>
          <h4 className="font-semibold">
            HireFlow<span className="text-primary">.</span>
          </h4>
          <p className="mt-3 text-sm text-muted-foreground max-w-xs">
            A verified job platform ensuring quality hiring for companies and candidates.
          </p>
        </div>

        <div>
          <h5 className="text-sm font-semibold mb-3">Platform</h5>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link href="/explore/jobs" className="hover:text-primary">Browse Jobs</Link></li>
            <li><Link href="/explore/companies" className="hover:text-primary">Companies</Link></li>
            <li><Link href="/signup" className="hover:text-primary">Sign Up</Link></li>
          </ul>
        </div>

        <div>
          <h5 className="text-sm font-semibold mb-3">Company</h5>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link href="#" className="hover:text-primary">About</Link></li>
            <li><Link href="#" className="hover:text-primary">Privacy</Link></li>
            <li><Link href="#" className="hover:text-primary">Terms</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border/60 py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} HireFlow<span className="text-primary">.</span>
      </div>
    </footer>
  )
}