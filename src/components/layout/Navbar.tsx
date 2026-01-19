'use client'

import { Menu, ChevronRight } from 'lucide-react'
import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import { toast } from 'sonner'
import { useBreadcrumbs } from '@/src/store/hooks/useBreadCrumb'

const Navbar = ({ onMenuClick }: { onMenuClick?: () => void }) => {
  const { data: session } = useSession()
  const user = session?.user
  const breadcrumbs = useBreadcrumbs()

  const handleLogout = async () => {
    const toastId = toast.loading('Logging out...')
    await signOut({
      callbackUrl: '/login',
    })
    toast.dismiss(toastId)
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border/40 bg-background/80 backdrop-blur">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">

          <button
            onClick={onMenuClick}
            className="md:hidden rounded-lg border border-border/40 p-2 hover:bg-muted/40"
          >
            <Menu size={18} />
          </button>

          <Link href="/redirect" className="md:hidden text-lg font-semibold">
            HireFlow<span className="text-primary">.</span>
          </Link>

          {breadcrumbs.length > 1 &&
            <nav className="hidden md:flex items-center gap-1 text-sm text-muted-foreground">
              {breadcrumbs.map((crumb, index) => (
                <div key={`${crumb.href}-${index}`} className="flex items-center gap-1">
                  {index !== 0 && <ChevronRight size={14} />}
                  {index === breadcrumbs.length - 1 ? (
                    <span className="font-medium text-foreground">
                      {crumb.label}
                    </span>
                  ) : (
                    <Link
                      href={crumb.href}
                      className="hover:text-foreground transition"
                    >
                      {crumb.label}
                    </Link>
                  )}
                </div>
              ))}
            </nav>}
        </div>

        {user && (
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-sm font-medium">{user.name}</span>
              <span className="text-xs text-muted-foreground">{user.role}</span>
            </div>

            <button
              onClick={handleLogout}
              className="rounded-full border border-destructive/30 bg-destructive/10 px-4 py-1.5 text-sm font-medium text-destructive hover:bg-destructive/20 transition"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  )
}

export default Navbar