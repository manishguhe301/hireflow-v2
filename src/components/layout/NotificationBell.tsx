'use client'
import { Bell, BellRing } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { AppSdk } from '@/src/utils/AppSdk'
import { toast } from 'sonner'
import NotificationDropdown from './NotificationDropdown'
import { usePusherNotifications } from '@/src/store/hooks/usePusherNotifications'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { usePathname } from 'next/navigation'

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
  const [isOpen, setIsOpen] = useState(false)
  const queryClient = useQueryClient()
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [deleteNotificationId, setDeleteNotificationId] = useState('')

  const pathname = usePathname()

  const {
    data,
    isLoading,
    refetch
  } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const res = await AppSdk.getData('/api/notifications?limit=10', null)

      if (res.error) {
        throw new Error(res.error)
      }

      return res
    },
    staleTime: 1000 * 60
  })

  const notifications: Notification[] = data?.notifications || []
  const unreadCount: number = data?.unreadCount || 0

  useEffect(() => {
    audioRef.current = new Audio('/notification.mp3')
  }, [])


  const handleNewNotification = useCallback((newNotification: Notification) => {

    if (audioRef.current) {
      audioRef.current.currentTime = 0
      audioRef.current.play().catch(() => { })
    }
    //eslint-disable-next-line
    queryClient.setQueryData(['notifications'], (old: any) => {
      if (!old) return old

      return {
        ...old,
        notifications: [newNotification, ...old.notifications.slice(0, 9)],
        unreadCount: old.unreadCount + 1
      }
    })
  }, [queryClient])

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

  const markAsReadMutation = useMutation({
    mutationFn: async (notificationIds: string[]) => {
      return AppSdk.patchData('/api/notifications', { notificationIds })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    }
  })

  const markAsRead = async (notificationIds: string[]) => {
    markAsReadMutation.mutate(notificationIds)
  }

  const markAllReadMutation = useMutation({
    mutationFn: async () => {
      return AppSdk.patchData('/api/notifications', { markAllAsRead: true })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
      toast.success('All notifications marked as read')
    }
  })

  const markAllAsRead = async () => {
    markAllReadMutation.mutate()
  }

  const deleteMutation = useMutation({
    mutationFn: async ({ notificationId, isALL }: { notificationId?: string, isALL?: boolean }) => {
      return AppSdk.deleteData(`/api/notifications`, {
        ...(isALL ? { deleteAll: true } : { notificationIds: [notificationId] }),
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
      toast.success('Notification deleted')
    },
    onSettled: () => {
      setDeleteNotificationId('')
    }
  })

  const deleteNotification = async (notificationId?: string, isALL: boolean = false) => {
    setDeleteNotificationId(notificationId as string)
    deleteMutation.mutate({ notificationId, isALL })
  }


  useEffect(() => {
    //eslint-disable-next-line
    setIsOpen(false)
  }, [pathname])

  return (
    <div className="relative max-sm:static">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-muted rounded-lg transition max-sm:static"
        aria-label="Notifications"
      >
        {unreadCount > 0 ? <BellRing className='h-5 w-5 text-destructive' /> : <Bell className="h-5 w-5" />}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 left-5 h-5 w-5 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center font-semibold max-sm:right-14">
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
          onRefresh={refetch}
          deleteNotification={deleteNotification}
          deleteNotificationId={deleteNotificationId}
          disabled={deleteMutation.isPending
            || markAsReadMutation.isPending
            || markAllReadMutation.isPending
          }
        />
      )}
    </div>
  )
}

export default NotificationBell