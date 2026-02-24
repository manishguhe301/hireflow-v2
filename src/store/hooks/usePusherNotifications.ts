'use client';
import { useEffect, useRef } from 'react';
import Pusher from 'pusher-js';
import { useSession } from 'next-auth/react';

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  link: string | null;
  isRead: boolean;
  createdAt: Date;
}

export function usePusherNotifications(
  onNewNotification: (notification: Notification) => void,
) {
  const { data: session } = useSession();
  const pusherRef = useRef<Pusher | null>(null);

  useEffect(() => {
    if (!session?.user?.id) return;

    pusherRef.current = new Pusher(process.env.NEXT_PUBLIC_PUSHER_APP_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    });

    const channel = pusherRef.current.subscribe(`user-${session.user.id}`);

    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    channel.bind('new-notification', (data: any) => {
      console.log('🔔 New notification received:', data.notification);
      onNewNotification(data.notification);
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
      pusherRef.current?.disconnect();
    };
  }, [session?.user?.id, onNewNotification]);
}
