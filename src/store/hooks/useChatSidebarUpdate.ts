'use client';
import { useEffect, useRef } from 'react';
import Pusher from 'pusher-js';
import { useSession } from 'next-auth/react';

export function useChatSidebarUpdate(
  onUpdate: (deletedConversationId?: string) => void,
) {
  const { data: session } = useSession();
  const pusherRef = useRef<Pusher | null>(null);

  useEffect(() => {
    if (!session?.user?.id) return;

    if (!pusherRef.current) {
      pusherRef.current = new Pusher(process.env.NEXT_PUBLIC_PUSHER_APP_KEY!, {
        cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
      });
    }

    const channel = pusherRef.current.subscribe(
      `user-messages-${session.user.id}`,
    );

    channel.bind('conversation-updated', () => {
      onUpdate();
    });

    channel.bind(
      'conversation-deleted',
      ({ conversationId }: { conversationId: string }) => {
        onUpdate(conversationId);
      },
    );

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [session?.user?.id, onUpdate]);
}
