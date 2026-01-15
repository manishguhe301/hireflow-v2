'use client'
import { Role } from "@prisma/client"
import { signOut, useSession } from "next-auth/react"
import Link from "next/link"
import { toast } from "sonner"

const navLinks: Record<Role, { href: string; label: string }[]> = {
  PLATFORM_ADMIN: [
    { href: '/admin', label: 'Dashboard' },
    { href: '/admin/companies', label: 'Companies' },
    { href: '/admin/users', label: 'Users' },
  ],
  COMPANY_ADMIN: [
    { href: '/company', label: 'Dashboard' },
    { href: '/company/jobs', label: 'Jobs' },
    { href: '/company/applications', label: 'Applications' },
    { href: '/company/profile', label: 'Company Profile' },
  ],
  JOB_SEEKER: [
    { href: '/jobs', label: 'Browse Jobs' },
    { href: '/dashboard', label: 'My Applications' },
    { href: '/dashboard/profile', label: 'Profile' },
    { href: '/dashboard/saved', label: 'Saved Jobs' },
  ],
}

const Navbar = () => {
  const { data: session } = useSession()
  const user = session?.user
  const links = user?.role as Role ? navLinks[user?.role as Role] : []

  const handleLogout = async () => {
    // const toastId = toast.loading('Logging out...')
    // await signOut({
    //   callbackUrl: '/login',
    // })
    // toast.dismiss(toastId)
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-border/40 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
        <Link href="/redirect" className="text-xl font-semibold tracking-tight">
          HireFlow<span className="text-primary">.</span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:text-primary transition"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {user?.role &&
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col text-right leading-tight">
              <span className="text-sm font-medium text-foreground">
                {user?.name}
              </span>
              <span className="text-xs text-muted-foreground">
                {user?.role === Role.JOB_SEEKER ? 'Job Seeker' : user?.role === Role.COMPANY_ADMIN ? 'Company Admin' : 'Platform Admin'}
              </span>
            </div>

            <button
              onClick={handleLogout}
              className="rounded-full border border-destructive/30 bg-destructive/10 px-4 py-1.5 text-sm font-medium text-destructive hover:bg-destructive/20 transition"
            >
              Logout
            </button>
          </div>
        }
      </div>
    </nav>
  )
}

export default Navbar