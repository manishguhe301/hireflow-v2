'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { AppSdk } from '@/src/utils/AppSdk';
import { toast } from 'sonner';
import { Spinner } from '../elements/Loader';
import { Send, MessageSquare, MoveLeft } from 'lucide-react';
import { Button } from '../ui/Button';
import clsx from 'clsx';
import { useChatPusher } from '@/src/store/hooks/useChatPusher';
import { MessageWithSender } from '@/src/types';
import ChatMessage from './ChatMessage';
import { useMutation } from '@tanstack/react-query';
import PageLoader from '../ui/PageLoader';

interface ChatWindowProps {
  conversationId: string | null;
  userType: 'company' | 'jobseeker';
  onMessageSent: () => void;
  chatPartnerName?: string;
  jobTitle?: string;
  onBack?: () => void;
}

export default function ChatWindow({
  conversationId,
  userType,
  onMessageSent,
  chatPartnerName,
  jobTitle,
  onBack,
}: ChatWindowProps) {
  const [messages, setMessages] = useState<MessageWithSender[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const lastFetchedMessageIdRef = useRef<string | null>(null);

  const handleNewMessage = useCallback((message: MessageWithSender) => {
    setMessages((prev) => {
      const exists = prev.some((m) => m.id === message.id);
      if (exists) return prev;
      return [...prev, message];
    });

    const isOwnMessage =
      message.senderType === (userType === 'company' ? 'COMPANY' : 'JOB_SEEKER');

    if (!isOwnMessage) {
      if (typeof window !== 'undefined' && 'Audio' in window) {
        const audio = new Audio('/notification.mp3');
        audio.volume = 0.6;
        audio.play().catch(() => { });
      }
    }

    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useChatPusher(conversationId, handleNewMessage);

  const fetchMessages = useCallback(async (pageNum: number) => {
    if (!conversationId) return;

    setIsLoadingMore(true);
    try {
      const res = await AppSdk.getData(
        `/api/chat/conversations/${conversationId}/messages?page=${pageNum}&limit=8`,
        null,
      );

      if (res.error) {
        toast.error(res.error);
        return;
      }

      const scrollContainer = scrollContainerRef.current;
      const oldScrollHeight = scrollContainer?.scrollHeight || 0;

      if (pageNum === 1) {
        lastFetchedMessageIdRef.current = res.messages[res.messages.length - 1]?.id ?? null;
        setMessages(res.messages);
      } else {
        lastFetchedMessageIdRef.current = res.messages[res.messages.length - 1]?.id ?? null;

        setMessages((prev) => [...res.messages, ...prev]);

        requestAnimationFrame(() => {
          if (scrollContainerRef.current) {
            const newScrollHeight = scrollContainerRef.current.scrollHeight;
            scrollContainerRef.current.scrollTop = newScrollHeight - oldScrollHeight;
          }
        });
      }

      setHasMore(res.pagination.hasMore);
      await AppSdk.patchData(`/api/chat/conversations/${conversationId}/read`, {});
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingMore(false);
    }
  }, [conversationId]);

  useEffect(() => {
    if (isLoading || !lastFetchedMessageIdRef.current) return;
    const el = document.getElementById(`msg-${lastFetchedMessageIdRef.current}`);
    if (el) {
      el.scrollIntoView({ block: 'end', behavior: 'instant' });
      lastFetchedMessageIdRef.current = null;
    }
  }, [isLoading]);

  useEffect(() => {
    if (!conversationId) return;

    setMessages([]);
    setPage(1);
    setHasMore(true);
    setIsLoading(true);

    fetchMessages(1).then(() => {
      setIsLoading(false);
    });

  }, [conversationId, fetchMessages]);

  useEffect(() => {
    setNewMessage('')
  }, [conversationId])


  const handleScroll = async () => {
    if (!scrollContainerRef.current || isLoadingMore || !hasMore) return;

    if (scrollContainerRef.current.scrollTop === 0) {
      const nextPage = page + 1;
      setPage(nextPage);
      await fetchMessages(nextPage);
    }
  };

  const sendMutation = useMutation({
    mutationFn: (content: string) =>
      AppSdk.postData('/api/chat/messages/send', { conversationId, content }),
    onSuccess: (res, content) => {
      if (res.error) {
        toast.error(res.error);
        setNewMessage(content);
        return;
      }
      onMessageSent();
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    },
    onError: (_error, content) => {
      toast.error('Failed to send message');
      setNewMessage(content);
    },
  });

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !conversationId) return;

    const tempMessage = newMessage;
    setNewMessage('');
    sendMutation.mutate(tempMessage);
  };

  if (!conversationId) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground bg-muted/20 w-full">
        <MessageSquare className="h-16 w-16 mb-4 opacity-50" />
        <p className="text-lg font-medium">No conversation selected</p>
        <p className="text-sm mt-2">Select a conversation to start messaging</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className='w-full h-full flex items-center justify-center'>
        <PageLoader title='Loading messages' subtitle='This may take a few seconds' />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-background w-full">
      {conversationId && (
        <div className="p-3 border-b flex items-center gap-3 sm:hidden bg-card">
          <Button
            variant="ghost"
            size='sm'
            onClick={onBack}
            aria-label='Go Back'
            className="p-2!"
          >
            <MoveLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm truncate">{chatPartnerName}</p>
            {jobTitle && (
              <p className="text-[10px] text-muted-foreground truncate line-clamp-1">
                {jobTitle}
              </p>
            )}
          </div>
        </div>
      )}
      <div className="hidden sm:flex items-center justify-between border-b border-border px-4 py-3 bg-card">
        <div className="flex items-center gap-3 min-w-0">
          <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center">
            {chatPartnerName?.charAt(0).toUpperCase()}
          </div>

          <div className="min-w-0">
            <p className="text-sm font-semibold truncate">{chatPartnerName}</p>

            {jobTitle && (
              <p className="text-xs text-muted-foreground truncate">
                Re: {jobTitle}
              </p>
            )}
          </div>
        </div>
      </div>
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-6 py-6 space-y-3 bg-muted/10"
      >
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center text-muted-foreground py-10">
            <MessageSquare className="h-10 w-10 mb-2 opacity-50" />
            <p className="text-sm">Start the conversation</p>
          </div>
        )}
        {isLoadingMore && page > 1 && (
          <div className="flex justify-center py-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Spinner className="h-4 w-4" />
              Loading earlier messages...
            </div>
          </div>
        )}
        {messages.map((message, index) => {
          const isOwnMessage =
            message.senderType === (userType === 'company' ? 'COMPANY' : 'JOB_SEEKER');

          const messageDate = new Date(message.createdAt).toDateString()
          const prevDate =
            index > 0
              ? new Date(messages[index - 1].createdAt).toDateString()
              : null

          const showDateDivider = messageDate !== prevDate

          return (
            <div
              id={`msg-${message.id}`}
              key={`${message.id}-${message.createdAt}-${index}`}
            >
              {showDateDivider && (
                <div className="flex justify-center my-4">
                  <span className="text-xs bg-muted px-3 py-1 rounded-full text-muted-foreground">
                    {messageDate}
                  </span>
                </div>
              )}
              <ChatMessage
                message={message}
                isOwnMessage={isOwnMessage}
              />
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-border bg-card">
        <div className="flex flex-col gap-2">
          <textarea
            value={newMessage}
            onChange={(e) => {
              setNewMessage(e.target.value)
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder="Type a message... (Enter to send, Shift+Enter for new line)"
            className={clsx(
              'w-full resize-none rounded-xl border px-4 py-3 text-sm outline-none transition',
              'bg-background text-foreground border-border/60',
              'focus:border-primary/40 focus:ring-1 focus:ring-primary/30',
            )}
            rows={2}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || sendMutation.isPending}
            className="px-4 self-end"
            aria-label='Send Message'
          >
            {sendMutation.isPending ? (
              <Spinner className="h-4 w-4" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}