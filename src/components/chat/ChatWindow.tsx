'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { AppSdk } from '@/src/utils/AppSdk';
import { toast } from 'sonner';
import { Spinner } from '../elements/Loader';
import { MessageSquare } from 'lucide-react';
import { useChatPusher } from '@/src/store/hooks/useChatPusher';
import { ChatWindowProps, MessageWithSender } from '@/src/types';
import ChatMessage from './ChatMessage';
import PageLoader from '../ui/PageLoader';
import { DesktopChatHeader, MobileChatHeader } from './ChatHeader';
import MessageInput from './MessageInput';

export default function ChatWindow({
  conversationId,
  userType,
  onMessageSent,
  chatPartnerName,
  jobTitle,
  onBack,
  chatPartnerAvatar,
  isWithdrawn
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
      // check if server message already exists
      const exists = prev.some((m) => m.id === message.id);
      if (exists) return prev;

      // replace optimistic message if same content + sender
      const optimisticIndex = prev.findIndex(
        (m) =>
          m.id.startsWith('temp-') &&
          m.content === message.content &&
          m.senderType === message.senderType
      );

      if (optimisticIndex !== -1) {
        const updated = [...prev];
        updated[optimisticIndex] = message;
        return updated;
      }

      return [...prev, message];
    });

    const isOwnMessage =
      message.senderType === (userType === 'company' ? 'COMPANY' : 'JOB_SEEKER');

    if (!isOwnMessage) {
      const audio = new Audio('/notification.mp3');
      audio.volume = 0.6;
      audio.play().catch(() => { });
    }

    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [userType]);

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
        <MobileChatHeader
          onBack={onBack}
          chatPartnerAvatar={chatPartnerAvatar}
          chatPartnerName={chatPartnerName}
          jobTitle={jobTitle}
        />
      )}
      <DesktopChatHeader
        chatPartnerAvatar={chatPartnerAvatar}
        chatPartnerName={chatPartnerName}
        jobTitle={jobTitle}
      />
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

          const messageDate = new Date(message.createdAt).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })
          const prevDate =
            index > 0
              ? new Date(messages[index - 1].createdAt).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })
              : null

          const showDateDivider = messageDate !== prevDate

          return (
            <div
              id={`msg-${message.id}`}
              key={`${message.id}-${message.createdAt}-${index}`}
            >
              {showDateDivider && (
                <div className="flex justify-center my-4">
                  <span className="text-[10px] bg-muted px-3 py-1 rounded-full text-muted-foreground">
                    {messageDate}
                  </span>
                </div>
              )}
              <ChatMessage
                message={message as MessageWithSender & { isSending: boolean }}
                isOwnMessage={isOwnMessage}
              />
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {isWithdrawn ?
        <div className="p-4 border-t border-border bg-card">
          <div className="flex items-center justify-center rounded-xl border border-border/40 bg-muted/20 px-4 py-3">
            <p className="text-sm text-muted-foreground text-center">
              This conversation is closed — the application was withdrawn or rejected.
            </p>
          </div>
        </div> :
        <MessageInput
          conversationId={conversationId}
          messagesEndRef={messagesEndRef}
          newMessage={newMessage}
          onMessageSent={onMessageSent}
          setMessages={setMessages}
          setNewMessage={setNewMessage}
          userType={userType}
          isWithdrawn={isWithdrawn}
        />}
    </div>
  );
}