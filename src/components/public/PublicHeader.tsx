'use client'

import Link from 'next/link'
import { Menu } from 'lucide-react'
import { Button } from '../ui/Button'
import { links } from '@/src/utils/constants'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'

export default function PublicHeader() {
  const handleMenuClose = (e: React.MouseEvent) => {
    e.currentTarget.closest('details')?.removeAttribute('open')
  }
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-6 py-3.5 flex items-center justify-between">
        <Link href="/" className="text-xl font-semibold tracking-tight">
          HireFlow<span className="text-primary">.</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          <Link href="/explore/jobs" className={clsx("hover:text-primary transition",
            pathname === "/explore/jobs"
              ? "text-primary"
              : "text-muted-foreground hover:text-primary"
          )}>
            Jobs
          </Link>
          <Link href="/explore/companies" className={clsx("hover:text-primary transition",
            pathname === "/explore/companies"
              ? "text-primary"
              : "text-muted-foreground hover:text-primary"
          )}>
            Companies
          </Link>
          <Link href="/how-it-works" className={clsx("hover:text-primary transition")}>How it works</Link>
          <Link
            href="/login"
            className="rounded-full border border-primary/30 bg-primary/10 hover:bg-primary/20 transition"
          >
            <Button size="sm" variant="outline">
              Login
            </Button>
          </Link>
        </nav>

        {/* Mobile */}
        <div className="md:hidden">
          <details className="group relative">
            <summary className="list-none cursor-pointer rounded-full border border-border/60 p-2 hover:bg-muted/50 transition">
              <Menu className="h-5 w-5" />
            </summary>

            <div className="absolute right-0 mt-3 w-56 rounded-2xl border border-border/60 bg-background shadow-xl p-4 space-y-3">
              {links.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={handleMenuClose}
                  className="block text-sm text-muted-foreground hover:text-primary transition"
                >
                  {link.label}
                </Link>
              ))}

              <div className="border-t border-border/60 pt-3">
                <Link href="/login" className="block w-full">
                  <Button className="w-full">
                    Login
                  </Button>
                </Link>
              </div>
            </div>
          </details>
        </div>
      </div>
    </header>
  )
}
