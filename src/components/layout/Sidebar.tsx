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
  X,
} from 'lucide-react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'
import { Spinner } from '../elements/Loader'
import { useTheme } from 'next-themes'

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
    { label: 'Applications', href: '/company/applications', icon: <FileText size={18} /> },
    { label: 'Profile', href: '/company/profile', icon: <Building2 size={18} /> },
  ],
  JOB_SEEKER: [
    { label: 'Browse Jobs', href: '/jobs', icon: <Briefcase size={18} /> },
    { label: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard size={18} /> },
    { label: 'Saved Jobs', href: '/dashboard/saved', icon: <Bookmark size={18} /> },
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
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  if (status === 'loading') {
    return (
      <div className='hidden md:flex w-64 flex-col items-center justify-center border-r border-border/40 bg-card px-4 py-6'>
        <Spinner className="h-8 w-8" />
      </div>
    )
  }

  const role = session?.user?.role as Role | undefined
  if (!role) return null

  const links = SIDEBAR_LINKS[role]

  return (
    <aside
      className={clsx(
        'w-64 flex-col border-r border-border/40 px-4 py-6 transition',
        'md:fixed md:inset-y-0 md:left-0 md:min-h-screen md:overflow-y-auto',
        mobile ? 'flex h-full' : 'hidden md:flex',
        isDark ? 'bg-slate-950' : 'bg-slate-50'
      )}
    >

      <div className="mb-8 px-2 flex items-center justify-between">
        <span className="text-lg font-semibold">
          HireFlow<span className="text-primary">.</span>
        </span>
        {
          mobile &&
          (
            <button className='p-1 border rounded-md' onClick={closeSidebar}>
              <X size={16} />
            </button>
          )
        }
      </div>

      <nav className="space-y-1">
        {links.map((link) => {
          const isActive =
            pathname === link.href
          // || pathname.includes(`${link.href}/`)

          return (
            <Link
              key={link.href}
              href={link.href}
              className={clsx(
                'flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition',
                isActive
                  ? 'bg-primary/10 text-primary font-bold!'
                  : 'text-muted-foreground hover:bg-muted/40 hover:text-foreground font-normal'
              )}
              onClick={() => {
                if (mobile && closeSidebar) {
                  closeSidebar()
                }
              }}
            >
              {link.icon}
              {link.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}

export default Sidebar
