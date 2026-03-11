import Link from 'next/link'

export default function PublicFooter() {
  return (
    <footer className="mt-auto border-t border-border/60 relative">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      <div className="mx-auto max-w-7xl px-6 py-16 grid gap-10 md:grid-cols-3 sm:grid-cols-2">
        <div>
          <h4 className="font-semibold text-lg tracking-tight">
            HireFlow<span className="text-primary">.</span>
          </h4>
          <p className="mt-3 text-sm text-muted-foreground max-w-xs">
            A verified job platform ensuring quality hiring for companies and candidates.
          </p>
        </div>

        <div>
          <h5 className="text-sm font-semibold mb-3">Platform</h5>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link href="/explore/jobs" className="hover:text-primary transition">Browse Jobs</Link></li>
            <li><Link href="/explore/companies" className="hover:text-primary transition">Companies</Link></li>
            <li><Link href="/signup" className="hover:text-primary transition">Sign Up</Link></li>
          </ul>
        </div>

        <div>
          <h5 className="text-sm font-semibold mb-3">Company</h5>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link href="/about" className="hover:text-primary transition">About</Link></li>
            <li><Link href="/privacy" className="hover:text-primary transition">Privacy</Link></li>
            <li><Link href="/terms" className="hover:text-primary transition">Terms</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border/60 py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} HireFlow<span className="text-primary">.</span>
      </div>
    </footer>
  )
}