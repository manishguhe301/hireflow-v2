'use client'

import { usePathname } from 'next/navigation'

interface Breadcrumb {
  label: string
  href: string
}

export function useBreadcrumbs(): Breadcrumb[] {
  const pathname = usePathname()

  return pathname
    .split('/')
    .filter(Boolean)
    .map((segment, index, arr) => {
      const href = '/' + arr.slice(0, index + 1).join('/')

      const label =
        segment === 'admin' ? 'Admin'
          : segment === 'companies' ? 'Companies'
            : segment === 'users' ? 'Users'
              : segment === 'create-admin' ? 'Create Admin'
                : segment === 'dashboard' ? 'Dashboard'
                  : segment === 'company' ? 'Company'
                    : segment === 'jobs' ? 'Jobs'
                      : segment.length > 12 ? 'Details'
                        : segment.charAt(0).toUpperCase() + segment.slice(1)

      return { label, href }
    })
}
