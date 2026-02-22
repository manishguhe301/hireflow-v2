'use client'
import { formatRelativeTime } from '@/src/utils/helper'
import { Check, CheckCheck, SquareArrowOutUpRight, Trash2, X } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useRef } from 'react'

interface Notification {
  id: string
  type: string
  title: string
  message: string
  link: string | null
  isRead: boolean
  createdAt: Date
}

interface Props {
  notifications: Notification[]
  isLoading: boolean
  onClose: () => void
  onMarkAsRead: (ids: string[]) => void
  onMarkAllAsRead: () => void
  onRefresh: () => void
  deleteNotification: (id: string, isALL?: boolean) => void
}

const NotificationDropdown = ({
  notifications,
  isLoading,
  onClose,
  onMarkAsRead,
  onMarkAllAsRead,
  deleteNotification
}: Props) => {
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [onClose])

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 top-12 w-96 max-h-[500px] overflow-y-auto bg-background border border-border rounded-2xl shadow-lg z-50"
    >
      <div className="sticky top-0 bg-background border-b border-border p-4 flex items-center justify-between">
        <h3 className="font-semibold">Notifications</h3>
        <div className="flex items-center gap-2">
          {notifications.some((n) => !n.isRead) && (
            <button
              onClick={onMarkAllAsRead}
              className="text-xs text-primary hover:underline flex items-center gap-1 cursor-pointer"
            >
              <CheckCheck className="h-3 w-3" />
              Mark all read
            </button>
          )}
          {notifications.length > 1 && <button
            onClick={() => {
              deleteNotification('', true)
            }}
            className="text-xs text-destructive hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Trash2 className="h-3 w-3" />
            Delete all
          </button>
          }
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground cursor-pointer">
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div>
        {isLoading ? (
          <div className="p-8 text-center text-muted-foreground">Loading...</div>
        ) : notifications.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            No notifications yet
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 border-b border-border hover:bg-muted/50 transition ${!notification.isRead ? 'bg-primary/5' : ''
                }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0 flex items-start gap-2">
                  {notification.link ? (
                    <Link
                      href={notification.link}
                      onClick={() => {
                        if (!notification.isRead) {
                          onMarkAsRead([notification.id])
                        }
                        onClose()
                      }}
                    >
                      <div className='flex flex-row items-center gap-1'>
                        {!notification.isRead &&
                          <div className="h-1 w-1  bg-primary rounded-full animate-pulse"></div>
                        }
                        <p className="font-medium text-sm">{notification.title}</p>
                        <SquareArrowOutUpRight className='text-muted-foreground h-3 w-3' />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {formatRelativeTime(notification.createdAt)}
                      </p>
                    </Link>
                  ) : (
                    <div>
                      <div className='flex flex-row items-center gap-1'>
                        {!notification.isRead &&
                          <div className="h-1 w-1  bg-primary rounded-full animate-pulse"></div>
                        }
                        <p className="font-medium text-sm">{notification.title}</p>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {formatRelativeTime(notification.createdAt)}
                      </p>
                    </div>
                  )}
                </div>
                {notification.isRead && (
                  <button
                    onClick={() => onMarkAsRead([notification.id])}
                    className="text-primary hover:text-primary/80"
                    title="Mark as read"
                  >
                    <Check className="h-4 w-4" />
                  </button>
                )}
                <Trash2 className='h-4 w-4 text-destructive cursor-pointer' onClick={() => {
                  deleteNotification(notification.id)
                }} />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default NotificationDropdown