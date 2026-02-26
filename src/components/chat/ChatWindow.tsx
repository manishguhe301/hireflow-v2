'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { AppSdk } from '@/src/utils/AppSdk';
import { toast } from 'sonner';
import { Spinner } from '../elements/Loader';
import { Send, MessageSquare } from 'lucide-react';
import { Button } from '../ui/Button';
import { formatRelativeTime } from '@/src/utils/helper';
import clsx from 'clsx';
import { useChatPusher } from '@/src/store/hooks/useChatPusher';
import { MessageWithSender } from '@/src/types';

interface ChatWindowProps {
  conversationId: string | null;
  userType: 'company' | 'jobseeker';
  onMessageSent: () => void;
}

export default function ChatWindow({
  conversationId,
  userType,
  onMessageSent,
}: ChatWindowProps) {
  const [messages, setMessages] = useState<MessageWithSender[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleNewMessage = useCallback((message: MessageWithSender) => {
    setMessages((prev) => [...prev, message]);
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useChatPusher(conversationId, handleNewMessage);

  const fetchMessages = async () => {
    if (!conversationId) return;

    setIsLoading(true);
    try {
      const res = await AppSdk.getData(
        `/api/chat/conversations/${conversationId}/messages`,
        null,
      );
      if (res.error) {
        toast.error(res.error);
        return;
      }
      setMessages(res.messages);

      // Mark as read
      await AppSdk.patchData(`/api/chat/conversations/${conversationId}/read`, {});

      // Scroll to bottom
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (conversationId) {
      fetchMessages();
    } else {
      setMessages([]);
    }
  }, [conversationId]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !conversationId) return;

    setIsSending(true);
    try {
      const res = await AppSdk.postData('/api/chat/messages/send', {
        conversationId,
        content: newMessage,
      });

      if (res.error) {
        toast.error(res.error);
        return;
      }

      setNewMessage('');
      setMessages((prev) => [...prev, res.message]);
      onMessageSent();
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
      console.error(error);
      toast.error('Failed to send message');
    } finally {
      setIsSending(false);
    }
  };

  if (!conversationId) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground bg-muted/20">
        <MessageSquare className="h-16 w-16 mb-4 opacity-50" />
        <p className="text-lg font-medium">No conversation selected</p>
        <p className="text-sm mt-2">Select a conversation to start messaging</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-background">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => {
          const isOwnMessage =
            message.senderType === (userType === 'company' ? 'COMPANY' : 'JOB_SEEKER');

          return (
            <div
              key={`${message.id}-${message.createdAt}-${index}`}
              className={clsx(
                'flex gap-3 max-w-[80%]',
                isOwnMessage ? 'ml-auto justify-end' : 'mr-auto justify-start',
              )}
            >
              {!isOwnMessage && message.sender.profile?.avatar && (
                <img
                  src={message.sender.profile.avatar}
                  alt={message.sender.name}
                  className="h-8 w-8 rounded-full object-cover flex-shrink-0"
                />
              )}

              <div
                className={clsx(
                  'rounded-2xl px-4 py-2',
                  isOwnMessage
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-foreground',
                )}
              >
                {!isOwnMessage && (
                  <p className="text-xs font-medium mb-1 opacity-70">
                    {message.sender.name}
                  </p>
                )}
                <p className="text-sm break-words whitespace-pre-wrap">{message.content}</p>
                <p
                  className={clsx(
                    'text-xs mt-1',
                    isOwnMessage ? 'text-primary-foreground/70' : 'text-muted-foreground',
                  )}
                >
                  {formatRelativeTime(message.createdAt)}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border bg-card">
        <div className="flex gap-2">
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder="Type a message... (Enter to send, Shift+Enter for new line)"
            className="flex-1 px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            rows={2}
            disabled={isSending}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || isSending}
            className="px-4 self-end"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}