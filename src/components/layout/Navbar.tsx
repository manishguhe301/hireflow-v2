'use client'
import { navLinks } from "@/src/utils/helper"
import { Role } from "@prisma/client"
import { Menu } from "lucide-react"
import { signOut, useSession } from "next-auth/react"
import { useTheme } from "next-themes"
import Link from "next/link"
import { toast } from "sonner"

const Navbar = () => {
  const { data: session } = useSession()
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const user = session?.user
  const links = user?.role as Role ? navLinks[user?.role as Role] : []

  const handleLogout = async () => {
    const toastId = toast.loading('Logging out...')
    await signOut({
      callbackUrl: '/login',
    })
    toast.dismiss(toastId)
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

        {user?.role && (
          <div className="flex items-center gap-4">
            <div className="hidden md:flex flex-col text-right leading-tight">
              <span className="text-sm font-medium text-foreground">
                {user.name}
              </span>
              <span className="text-xs text-muted-foreground">
                {user.role === Role.JOB_SEEKER
                  ? 'Job Seeker'
                  : user.role === Role.COMPANY_ADMIN
                    ? 'Company Admin'
                    : 'Platform Admin'}
              </span>
            </div>

            <button
              onClick={handleLogout}
              className="hidden xs:inline-flex md:inline-flex rounded-full border border-destructive/30 bg-destructive/10 px-4 py-1.5 text-sm font-medium text-destructive hover:bg-destructive/20 transition"
            >
              Logout
            </button>

            {/* Mobile menu */}
            <div className="relative md:hidden">
              <details className="group">
                <summary className="list-none cursor-pointer rounded-full border border-border/40 p-2 hover:bg-muted/40 transition ">
                  <Menu className="h-5 w-5" />
                </summary>

                <div className={`absolute right-0 mt-3 w-56 rounded-2xl border border-border/40 ${isDark ? 'bg-slate-950' : 'bg-slate-50'} shadow-xl p-4 space-y-3 backdrop-blur-3xl`}>
                  <div className="pb-3 border-b border-border/30">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {user.role === Role.JOB_SEEKER
                        ? 'Job Seeker'
                        : user.role === Role.COMPANY_ADMIN
                          ? 'Company Admin'
                          : 'Platform Admin'}
                    </p>
                  </div>

                  {links.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={(e) => {
                        e.currentTarget.closest('details')?.removeAttribute('open')
                      }}
                      className="block text-sm text-muted-foreground hover:text-primary transition"
                    >
                      {link.label}
                    </Link>
                  ))}

                  {/* Logout inside menu (<480px) */}
                  <button
                    onClick={(e) => {
                      e.currentTarget.closest('details')?.removeAttribute('open')
                      handleLogout()
                    }}
                    className="w-full rounded-xl border border-destructive/30 bg-destructive/10 py-2 text-sm font-medium text-destructive hover:bg-destructive/20 transition"
                  >
                    Logout
                  </button>
                </div>
              </details>
            </div>
          </div>
        )}
      </div>
    </nav>

  )
}

export default Navbar