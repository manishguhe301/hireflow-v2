'use client'

import { Role } from '@prisma/client'
import {
  LayoutDashboard,
  Building2,
  Users,
  UserCog,
  Briefcase,
  Bookmark,
  FileText,
  X, LogOut, Moon, Sun,
  Send,
  MessageCircle,
} from 'lucide-react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'
import { useTheme } from 'next-themes'
import { Button } from '../ui/Button'
import { signOut } from 'next-auth/react'
import { toast } from 'sonner'
import { flushSync } from 'react-dom'

const SIDEBAR_LINKS: Record<
  Role,
  { label: string; href: string; icon: React.ReactNode }[]
> = {
  PLATFORM_ADMIN: [
    { label: 'Dashboard', href: '/admin', icon: <LayoutDashboard size={18} /> },
    { label: 'Companies', href: '/admin/companies', icon: <Building2 size={18} /> },
    { label: 'Users', href: '/admin/users', icon: <Users size={18} /> },
    { label: 'Create Admin', href: '/admin/create-admin', icon: <UserCog size={18} /> },
  ],
  COMPANY_ADMIN: [
    { label: 'Dashboard', href: '/company', icon: <LayoutDashboard size={18} /> },
    { label: 'Jobs', href: '/company/jobs', icon: <Briefcase size={18} /> },
    { label: 'Chat', href: '/company/chat', icon: <MessageCircle size={18} /> },
    { label: 'Applications', href: '/company/applications', icon: <FileText size={18} /> },
    { label: 'Profile', href: '/company/profile', icon: <Building2 size={18} /> },
  ],
  JOB_SEEKER: [
    { label: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard size={18} /> },
    { label: 'Browse Jobs', href: '/jobs', icon: <Briefcase size={18} /> },
    { label: 'Chat', href: '/dashboard/chat', icon: <MessageCircle size={18} /> },
    { label: 'Applications', href: '/dashboard/applications', icon: <Send size={18} /> },
    { label: 'Saved Jobs', href: '/dashboard/saved-jobs', icon: <Bookmark size={18} /> },
    { label: 'Profile', href: '/dashboard/profile', icon: <UserCog size={18} /> },
  ],
}

interface SidebarProps {
  mobile?: boolean,
  closeSidebar?: () => void
}

const Sidebar = ({ mobile = false, closeSidebar }: SidebarProps) => {
  const { data: session, status } = useSession()
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const isDark = theme === 'dark'


  if (status === 'loading') {
    return (
      <aside className="hidden md:flex w-64 flex-col border-r border-border/60 bg-background px-4 py-6">
        <div className="h-6 w-32 bg-muted rounded mb-8 animate-pulse" />

        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-10 rounded-lg bg-muted animate-pulse"
            />
          ))}
        </div>
      </aside>
    )
  }

  const role = session?.user?.role
  if (!role || !SIDEBAR_LINKS[role]) return null

  const links = SIDEBAR_LINKS[role]

  const handleLogout = async () => {
    const toastId = toast.loading('Logging out...')
    await signOut({ callbackUrl: '/' })
    toast.dismiss(toastId)
  }

  const toggleTheme = async () => {
    if (!document.startViewTransition) {
      setTheme(isDark ? 'light' : 'dark')
      return
    }

    const transition = document.startViewTransition(() => {
      flushSync(() => {
        setTheme(isDark ? 'light' : 'dark')
      })
    })

    await transition.ready

    document.documentElement.animate(
      {
        clipPath: [
          'polygon(100% 100%, 100% 100%, 100% 100%, 100% 100%)',
          'polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%)',
        ],
      },
      {
        duration: 600,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
        pseudoElement: '::view-transition-new(root)',
      }
    )
  }

  return (
    <aside
      className={clsx(
        'lg:w-64! md:w-20! w-64! flex-col border-r border-border/60 px-4 py-6 transition',
        'md:fixed md:inset-y-0 md:left-0 md:min-h-screen md:overflow-y-auto',
        mobile ? 'flex h-full w-64!' : 'hidden md:flex',
        'bg-background'
      )}
    >
      <div className="mb-8 px-2 flex items-center justify-between">
        <Link href="/" className="text-lg font-semibold max-lg:hidden max-md:block">
          HireFlow<span className="text-primary">.</span>
        </Link>
        <Link href="/" className="text-lg font-semibold lg:hidden max-md:hidden">
          <img
            src='/logo-hireflow.png'
            alt='logo'
            width={32}
            height={32}
          />
        </Link>

        {mobile && (
          <Button
            variant="ghost"
            onClick={closeSidebar}
            className="p-1 rounded-md hover:bg-muted/40"
            aria-label="Close sidebar"
          >
            <X size={16} />
          </Button>
        )}
      </div>

      <nav className="space-y-1">
        {links.map((link) => {
          const isActive = pathname === link.href

          return (
            <Link
              key={link.href}
              href={link.href}
              className={clsx(
                'flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-muted/40 hover:text-foreground'
              )}
              onClick={() => {
                if (mobile && closeSidebar) {
                  closeSidebar()
                }
              }}
            >
              {link.icon}
              <span
                className={clsx(
                  mobile
                    ? 'block'
                    : 'hidden lg:inline',
                  isActive ? 'font-semibold' : 'font-normal'
                )}
              >
                {link.label}
              </span>
            </Link>
          )
        })}
      </nav>
      <div className="mt-auto pt-6 border-t border-border/40 flex flex-col gap-2">
        <Button
          onClick={toggleTheme}
          variant='outline'
          aria-label='Toggle Theme'
          className={clsx(
            'flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition cursor-pointer',
            'text-muted-foreground hover:bg-muted/40 hover:text-foreground w-full'
          )}
        >
          {isDark ? <Sun size={18} className='text-warning' />
            : <Moon size={18} className='text-primary' />}
          <span className={clsx(isDark ? 'text-warning' : 'text-primary', mobile ? 'block' : 'hidden lg:inline')}>
            {isDark ? 'Light Mode' : 'Dark Mode'}
          </span>
        </Button>

        <Button
          onClick={handleLogout}
          variant='danger'
          className={clsx(
            'flex items-center gap-3 w-full',
          )}
        >
          <LogOut size={18} />
          <span className={mobile ? 'block' : 'hidden lg:inline'}>
            Logout
          </span>
        </Button>
      </div>
    </aside>
  )
}

export default Sidebar
