'use client'

import { Menu, } from 'lucide-react'
import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import { toast } from 'sonner'
import { Button } from '../ui/Button'
import { labels } from '@/src/utils/helper'
import { Breadcrumb } from '../ui/Breadcrumb'
import { useAppDispatch } from '@/src/store/hooks'
import { clearCompany } from '@/src/store/slices/companySlice'

const Navbar = ({ onMenuClick }: { onMenuClick?: () => void }) => {
  const { data: session } = useSession()
  const user = session?.user
  const dispatch = useAppDispatch()

  const handleLogout = async () => {
    const toastId = toast.loading('Logging out...')
    await signOut({
      callbackUrl: '/',
    })
    dispatch(clearCompany())
    toast.dismiss(toastId)
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="flex items-center justify-between px-4 md:px-6 py-4">
        <div className="flex items-center gap-3">
          <Button
            onClick={onMenuClick}
            variant="ghost"
            className="md:hidden rounded-lg hover:bg-muted/50 p-0!"
          >
            <Menu size={18} />
          </Button>

          <Link href="/redirect" className="md:hidden text-lg font-semibold">
            HireFlow<span className="text-primary">.</span>
          </Link>
          <div className='hidden md:block'>
            <Breadcrumb />
          </div>
        </div>

        {user && (
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-sm font-medium capitalize">{user.name}</span>
              <span className="text-xs text-muted-foreground">
                {labels[user.role]}
              </span>
            </div>

            <Button
              onClick={handleLogout}
              variant="danger"
              className="rounded-full px-4 py-1.5 text-sm border-border/60"
            >
              Logout
            </Button>
          </div>
        )}
      </div>
    </header>
  )
}

export default Navbar