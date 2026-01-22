'use client'

import { Menu, ChevronRight } from 'lucide-react'
import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import { toast } from 'sonner'
import { useBreadcrumbs } from '@/src/store/hooks/useBreadCrumb'
import { Button } from '../ui/Button'
import { labels } from '@/src/utils/helper'

const Navbar = ({ onMenuClick }: { onMenuClick?: () => void }) => {
  const { data: session } = useSession()
  const user = session?.user
  const breadcrumbs = useBreadcrumbs()

  const handleLogout = async () => {
    const toastId = toast.loading('Logging out...')
    await signOut({
      callbackUrl: '/',
    })
    toast.dismiss(toastId)
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <Button
            onClick={onMenuClick}
            variant="ghost"
            className="md:hidden rounded-lg hover:bg-muted/50 p-0!"
          >
            <Menu size={18} />
          </Button>

          <Link href="/redirect" className="md:hidden text-lg font-semibold">
            HireFlow<span className="text-primary">.</span>
          </Link>
          {/* 
          {breadcrumbs.length > 1 && (
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
            </nav>
          )} 
           */}
        </div>

        {user && (
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-sm font-medium">{user.name}</span>
              <span className="text-xs text-muted-foreground">
                {labels[user.role]}
              </span>
            </div>

            <Button
              onClick={handleLogout}
              variant="danger"
              className="rounded-full px-4 py-1.5 text-sm border-border/60"
            >
              Logout
            </Button>
          </div>
        )}
      </div>
    </header>
  )
}

export default Navbar