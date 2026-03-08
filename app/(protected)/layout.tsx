'use client'

import { useEffect, useState } from 'react'
import Navbar from '@/src/components/layout/Navbar'
import Sidebar from '@/src/components/layout/Sidebar'
import { useSession } from 'next-auth/react'
import { Spinner } from '@/src/components/elements/Loader'
import { useRouter } from 'next/navigation'
import clsx from 'clsx'
import PageLoader from '@/src/components/ui/PageLoader'

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/login')
    }
  }, [status, router])

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [sidebarOpen])

  if (status === 'loading') {
    return (
      <div className='flex items-center justify-center h-screen'>
        <PageLoader
          title="Checking your session"
          subtitle="Verifying authentication status"
        />
      </div>
    )
  }

  if (status === 'unauthenticated') {
    return null
  }

  return (
    <div>

      <div className="flex min-h-screen">
        <Sidebar />

        <div
          className={clsx(
            'fixed inset-0 z-50 md:hidden',
            sidebarOpen ? 'pointer-events-auto' : 'pointer-events-none'
          )}
        >
          <div
            className={clsx(
              'absolute inset-0 bg-black/30 transition-opacity duration-300',
              sidebarOpen ? 'opacity-100' : 'opacity-0'
            )}
            onClick={() => setSidebarOpen(false)}
          />

          <div
            className={clsx(
              'absolute left-0 top-0 h-full w-64 bg-card border-r border-border/60',
              'transform transition-transform duration-300 ease-out',
              sidebarOpen ? 'translate-x-0' : '-translate-x-full'
            )}
          >
            <Sidebar mobile closeSidebar={() => setSidebarOpen(false)} />
          </div>
        </div>

        <div className="flex flex-1 flex-col lg:pl-64 md:pl-20 pl-0">
          <Navbar onMenuClick={() => setSidebarOpen(true)} />
          <main className="flex-1">{children}</main>
        </div>
      </div>
      <div className="border-t border-border/60 py-6 text-center text-xs text-muted-foreground lg:pl-64 md:pl-20 pl-0">
        © {new Date().getFullYear()} HireFlow<span className="text-primary">.</span>
      </div>
    </div>
  )
}
