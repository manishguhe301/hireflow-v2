'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight, Home } from 'lucide-react'
import { Fragment } from 'react'
import { useSession } from 'next-auth/react'

interface BreadcrumbItem {
  label: string
  href: string
  linkable: boolean
}

const labelOverrides: Record<string, string> = {
  'create-admin': 'Create Admin',
  'saved-jobs': 'Saved Jobs',
  'profile-setup': 'Profile Setup',
  'company-details': 'Company Details',
  'user-profile': 'User Profile',
  'how-it-works': 'How It Works',
  'create': 'Create',
  'edit': 'Edit',
}

const nonLinkable = new Set(['user-profile', 'company-details', 'edit'])

export function Breadcrumb() {
  const pathname = usePathname()
  const { data: session } = useSession()

  const homeHref =
    session?.user?.role === 'PLATFORM_ADMIN' ? '/admin'
      : session?.user?.role === 'COMPANY_ADMIN' ? '/company'
        : session?.user?.role === 'JOB_SEEKER' ? '/dashboard'
          : '/'

  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const segments = pathname.split('/').filter(Boolean)
    const breadcrumbs: BreadcrumbItem[] = []

    const hiddenPrefixes = new Set(['dashboard', 'company', 'admin'])

    let basePrefix = ''
    const cleanSegments: string[] = []

    for (const seg of segments) {
      if (!basePrefix && hiddenPrefixes.has(seg)) {
        basePrefix = `/${seg}`
      } else {
        cleanSegments.push(seg)
      }
    }

    let currentPath = basePrefix

    for (const segment of cleanSegments) {
      currentPath += `/${segment}`

      let label: string
      if (labelOverrides[segment]) {
        label = labelOverrides[segment]
      } else {
        const cleaned = segment.replace(/-[a-z0-9]{5,6}$/i, '')
        label = cleaned
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')
      }

      breadcrumbs.push({
        label,
        href: currentPath,
        linkable: !nonLinkable.has(segment),
      })
    }

    return breadcrumbs
  }

  const breadcrumbs = generateBreadcrumbs()

  if (breadcrumbs.length === 0) return null

  return (
    <nav className="flex items-center gap-2 text-sm text-muted-foreground">
      <Link
        href={homeHref}
        className="hover:text-foreground transition"
        aria-label="Home"
      >
        <Home className="h-4 w-4" />
      </Link>

      {breadcrumbs.map((item, index) => {
        const isLast = index === breadcrumbs.length - 1

        return (
          <Fragment key={item.href}>
            <ChevronRight className="h-4 w-4" />
            {isLast || !item.linkable ? (
              <span
                className={`truncate max-w-[200px] ${isLast ? 'font-medium text-foreground' : ''
                  }`}
              >
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                className="hover:text-foreground transition"
              >
                {item.label}
              </Link>
            )}
          </Fragment>
        )
      })}
    </nav>
  )
}