'use client'
import { Role } from "@prisma/client"
import { useSession } from "next-auth/react"
import Link from "next/link"

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

  const handleLogout = () => {
    console.log('Logout clicked')
  }
  return (
    <nav>
      <div>HireFlow</div>

      <div className="flex flex-col gap-2">
        {links.map((link) => (
          <Link key={link.href} href={link.href}>
            {link.label}
          </Link>
        ))}
      </div>

      <div>
        <span>{user?.name}</span> - 
        <span> {user?.role}</span>
        <button onClick={handleLogout} className="block">Logout</button>
      </div>
    </nav>
  )
}

export default Navbar