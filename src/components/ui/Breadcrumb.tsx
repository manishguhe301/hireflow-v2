'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight, Home } from 'lucide-react'
import { Fragment } from 'react'

interface BreadcrumbItem {
  label: string
  href: string
}

export function Breadcrumb() {
  const pathname = usePathname()

  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const segments = pathname.split('/').filter(Boolean)
    const breadcrumbs: BreadcrumbItem[] = []
    const hiddenSegments = ['dashboard', 'company', 'admin']

    let currentPath = ''
    segments.forEach((segment) => {
      if (hiddenSegments.includes(segment)) {
        return
      }
      currentPath += `/${segment}`

      if (segment.startsWith('(') && segment.endsWith(')')) {
        return
      }

      const cleanedSegment = segment.replace(/-[a-z0-9]{5,}$/i, '')

      const label = cleanedSegment
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')

      breadcrumbs.push({
        label,
        href: currentPath
      })
    })

    return breadcrumbs
  }

  const breadcrumbs = generateBreadcrumbs()

  if (pathname === '/' || pathname === '/dashboard' || pathname === '/admin' || pathname === '/company') return null

  return (
    <nav className="flex items-center gap-2 text-sm text-muted-foreground">
      <Link
        href="/"
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

            {isLast ? (
              <span className="font-medium text-foreground truncate max-w-[200px]">
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