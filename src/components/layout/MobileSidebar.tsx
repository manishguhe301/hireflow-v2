import React from 'react'
import Sidebar from './Sidebar'
import clsx from 'clsx'

const MobileSidebar = ({
  sidebarOpen,
  setSidebarOpen,
}: {
  sidebarOpen: boolean,
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  return (
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
  )
}

export default MobileSidebar