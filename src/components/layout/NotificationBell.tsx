'use client'
import { Bell, BellRing } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { AppSdk } from '@/src/utils/AppSdk'
import { toast } from 'sonner'
import NotificationDropdown from './NotificationDropdown'
import { usePusherNotifications } from '@/src/store/hooks/usePusherNotifications'

interface Notification {
  id: string
  type: string
  title: string
  message: string
  link: string | null
  isRead: boolean
  createdAt: Date
}

const NotificationBell = () => {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const fetchNotifications = useCallback(async (isLoaderNeeded: boolean = true) => {
    if (isLoaderNeeded) {
      setIsLoading(true)
    }
    try {
      const res = await AppSdk.getData('/api/notifications?limit=10', null)
      if (res.error) {
        toast.error(res.error)
        return
      }
      setNotifications(res.notifications)
      setUnreadCount(res.unreadCount)
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const handleNewNotification = useCallback((newNotification: Notification) => {
    setNotifications((prev) => [newNotification, ...prev.slice(0, 9)])

    setUnreadCount((prev) => prev + 1)

    if (typeof window !== 'undefined' && 'Audio' in window) {
      const audio = new Audio('/notification.mp3')
      audio.play().catch(() => { })
    }
  }, [])

  usePusherNotifications(handleNewNotification)

  useEffect(() => {
    const originalTitle = document.title.replace(/^\(\d+\)\s*/, '')

    if (unreadCount > 0) {
      document.title = `(${unreadCount}) ${originalTitle}`
    } else {
      document.title = originalTitle
    }

    return () => {
      document.title = originalTitle
    }
  }, [unreadCount])

  useEffect(() => {
    fetchNotifications()
    // const interval = setInterval(() => fetchNotifications(false), 30000)
    // return () => clearInterval(interval)
  }, [fetchNotifications])

  const markAsRead = async (notificationIds: string[]) => {
    try {
      await AppSdk.patchData('/api/notifications', { notificationIds })
      fetchNotifications(false)
    } catch (error) {
      console.error(error)
    }
  }

  const markAllAsRead = async () => {
    try {
      await AppSdk.patchData('/api/notifications', { markAllAsRead: true })
      fetchNotifications(false)
      toast.success('All notifications marked as read')
    } catch (error) {
      console.error(error)
    }
  }

  const deleteNotification = async (notificationId?: string, isALL: boolean = false) => {
    try {
      await AppSdk.deleteData(`/api/notifications`, {
        notificationIds: !isALL && notificationId ? [notificationId] : notifications.map(n => n.id),
      })
      fetchNotifications(false)
      toast.success('Notification deleted')
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="relative max-sm:static">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-muted rounded-lg transition max-sm:static"
      >
        {unreadCount > 0 ? <BellRing className='h-5 w-5 text-destructive' /> : <Bell className="h-5 w-5" />}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center font-semibold max-sm:right-14">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <NotificationDropdown
          notifications={notifications}
          isLoading={isLoading}
          onClose={() => setIsOpen(false)}
          onMarkAsRead={markAsRead}
          onMarkAllAsRead={markAllAsRead}
          onRefresh={fetchNotifications}
          deleteNotification={deleteNotification}
        />
      )}
    </div>
  )
}

export default NotificationBell