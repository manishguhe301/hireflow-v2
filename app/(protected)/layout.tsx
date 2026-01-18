'use client'

import { useEffect, useState } from 'react'
import Navbar from '@/src/components/layout/Navbar'
import Sidebar from '@/src/components/layout/Sidebar'
import { useSession } from 'next-auth/react'
import { Spinner } from '@/src/components/elements/Loader'

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { status } = useSession()

  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [sidebarOpen])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner className="h-8 w-8" />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full w-64 bg-card border-r border-border/40">
            <Sidebar mobile closeSidebar={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}


      <div className="flex flex-1 flex-col">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  )
}
