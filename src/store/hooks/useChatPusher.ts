'use client';
import { useEffect, useRef } from 'react';
import Pusher from 'pusher-js';
import { useSession } from 'next-auth/react';
import { MessageWithSender } from '@/src/types';

export function useChatPusher(
  conversationId: string | null,
  onNewMessage: (message: MessageWithSender) => void,
) {
  const { data: session } = useSession();
  const pusherRef = useRef<Pusher | null>(null);

  useEffect(() => {
    if (!session?.user?.id || !conversationId) return;

    if (!pusherRef.current) {
      pusherRef.current = new Pusher(process.env.NEXT_PUBLIC_PUSHER_APP_KEY!, {
        cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
      });
    }

    const channel = pusherRef.current.subscribe(
      `conversation-${conversationId}`,
    );

    channel.bind('new-message', (data: { message: MessageWithSender }) => {
      // console.log('🔔 New message:', data.message);
      onNewMessage(data.message);
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [conversationId, onNewMessage, session?.user?.id]);
}
