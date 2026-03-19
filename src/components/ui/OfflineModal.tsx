'use client'

import { useEffect, useState } from 'react'
import { WifiOff, RefreshCw } from 'lucide-react'
import { Button } from './Button'

export function OfflineModal() {
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    //eslint-disable-next-line
    setIsOnline(navigator.onLine)

    const handleOffline = () => setIsOnline(false)
    const handleOnline = () => setIsOnline(true)

    window.addEventListener('offline', handleOffline)
    window.addEventListener('online', handleOnline)

    return () => {
      window.removeEventListener('offline', handleOffline)
      window.removeEventListener('online', handleOnline)
    }
  }, [])

  if (isOnline) return null

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="bg-background border border-border/60 rounded-2xl shadow-2xl p-8 mx-4 max-w-sm w-full text-center flex flex-col items-center gap-5">

        <div className="h-16 w-16 rounded-2xl bg-destructive/10 flex items-center justify-center">
          <WifiOff className="h-8 w-8 text-destructive" />
        </div>

        <div className="space-y-1.5">
          <h2 className="text-lg font-semibold text-foreground">
            No Internet Connection
          </h2>
          <p className="text-sm text-muted-foreground">
            Please check your network and try again. The page will resume automatically once you&apos;re back online.
          </p>
        </div>

        <Button
          variant="outline"
          onClick={() => window.location.reload()}
          className="inline-flex items-center gap-2 w-full justify-center"
        >
          <RefreshCw className="h-4 w-4" />
          Retry
        </Button>
      </div>
    </div>
  )
}