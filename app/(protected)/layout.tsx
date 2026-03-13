'use client'

import { useEffect, useState } from 'react'
import Navbar from '@/src/components/layout/Navbar'
import Sidebar from '@/src/components/layout/Sidebar'
import { useSession } from 'next-auth/react'

import { usePathname, useRouter } from 'next/navigation'
import PageLoader from '@/src/components/ui/PageLoader'
import MobileSidebar from '@/src/components/layout/MobileSidebar'
import { Github } from 'lucide-react'

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { status } = useSession()
  const router = useRouter()

  const pathname = usePathname()

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
      <div className='flex items-center justify-center h-screen bg-muted/10'>
        <PageLoader
          title="Checking your session"
          subtitle="Verifying authentication status"
        />
      </div>
    )
  }

  if (status === 'unauthenticated') {
    return (
      <div className="flex items-center justify-center h-screen">
        <PageLoader
          title="Redirecting"
          subtitle="Taking you to login"
        />
      </div>
    )
  }

  return (
    <div>

      <div className="flex min-h-screen">
        <Sidebar />

        <MobileSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <div className="flex flex-1 flex-col lg:pl-64 md:pl-20 pl-0">
          <Navbar onMenuClick={() => setSidebarOpen(true)} />
          <main className="flex-1">{children}</main>
        </div>
      </div>
      {!pathname.includes('chat') && <div className="border-t border-border/60 py-6 text-center text-xs text-muted-foreground lg:pl-64 md:pl-20 pl-0">
        <div className=" px-6 flex items-center justify-between text-xs text-muted-foreground">
          <span>
            © {new Date().getFullYear()} HireFlow<span className="text-primary">.</span>
          </span>
          <a
            href="https://github.com/manishguhe301/hireflow-v2"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-primary transition"
          >
            <Github className="w-4 h-4" />
            View on GitHub
          </a>

        </div>
      </div>}
    </div >
  )
}
