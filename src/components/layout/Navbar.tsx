'use client'

import { Menu, } from 'lucide-react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { Button } from '../ui/Button'
import { labels } from '@/src/utils/helper'
import { Breadcrumb } from '../ui/Breadcrumb'
import NotificationBell from './NotificationBell'


const Navbar = ({ onMenuClick }: { onMenuClick?: () => void }) => {
  const { data: session } = useSession()
  const user = session?.user
  // const dispatch = useAppDispatch()

  // const handleLogout = async () => {
  //   const toastId = toast.loading('Logging out...')
  //   await signOut({
  //     callbackUrl: '/',
  //   })
  //   dispatch(clearCompany())
  //   toast.dismiss(toastId)
  // }

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="flex items-center justify-between px-4 md:px-6 py-4">
        <div className="flex items-center gap-3">
          <Button
            onClick={onMenuClick}
            variant="ghost"
            className="md:hidden rounded-lg hover:bg-muted/50 p-0!"
            aria-label="Menu"
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
          <div className="flex items-center gap-4 max-sm:relative">
            <NotificationBell />
            <Link href={user.role === 'JOB_SEEKER'
              ? "/dashboard/profile" : user.role === 'COMPANY_ADMIN'
                ? '/company/profile' : '/admin'} className="flex flex-row gap-1 items-center">
              <div className="h-10 w-10 flex items-center justify-center rounded-full overflow-hidden border border-border/40 bg-muted">
                <span className="text-sm font-semibold text-primary">
                  {user.name?.charAt(0)?.toUpperCase()}
                </span>
              </div>
              <div className="hidden sm:flex flex-col items-start text-center gap-1">
                <span className="text-sm font-medium capitalize leading-tight">
                  {user.name}
                </span>
                <span className="text-xs text-muted-foreground">
                  {labels[user.role]}
                </span>
              </div>

              {/* <Button
              onClick={handleLogout}
              variant="danger"
              className="rounded-full px-4 py-1.5 text-sm border-border/60"
            >
              Logout
            </Button> */}
            </Link>
          </div>

        )}
      </div>
    </header >
  )
}

export default Navbar