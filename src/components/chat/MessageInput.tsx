import clsx from 'clsx';
import { Spinner } from '../elements/Loader';
import { Send } from 'lucide-react';
import { Button } from '../ui/Button';
import { useMutation } from '@tanstack/react-query';
import { AppSdk } from '@/src/utils/AppSdk';
import { toast } from 'sonner';
import { MessageInputProps, MessageWithSender } from '@/src/types';

const MessageInput = ({
  conversationId,
  newMessage,
  onMessageSent,
  setMessages,
  userType,
  setNewMessage,
  messagesEndRef,
  isWithdrawn
}: MessageInputProps) => {

  const sendMutation = useMutation({
    mutationFn: ({ content }: { content: string; tempId: string }) =>
      AppSdk.postData('/api/chat/messages/send', { conversationId, content }),

    onSuccess: (res, variables) => {
      if (res.error) {
        toast.error(res.error);

        setMessages((prev) =>
          prev.filter((m) => m.id !== variables.tempId)
        );

        setNewMessage(variables.content);
        return;
      }

      setMessages((prev) =>
        prev.map((m) =>
          m.id === variables.tempId
            ? { ...res.message, isSending: false }
            : m
        )
      );

      onMessageSent();
    },

    onError: (_error, variables) => {
      toast.error('Failed to send message');

      setMessages((prev) =>
        prev.filter((m) => m.id !== variables.tempId)
      );

      setNewMessage(variables.content);
    },
  });


  const handleSendMessage = async () => {
    if (!newMessage.trim() || !conversationId) return;

    const content = newMessage.trim();
    setNewMessage('');

    const tempId = `temp-${Date.now()}`;

    const optimisticMessage: MessageWithSender & { isSending: boolean } = {
      id: tempId,
      conversationId: conversationId,
      content,
      createdAt: new Date(),
      senderId: 'me',
      senderType: userType === 'company' ? 'COMPANY' : 'JOB_SEEKER',
      isRead: true,
      isSending: true,
      sender: {
        id: 'me',
        name: 'You',
        profile: {
          avatar: null,
          name: 'You'
        }
      }
    };

    setMessages((prev) => [...prev, optimisticMessage]);

    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });

    sendMutation.mutate({ content, tempId });
  };
  return (
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
          placeholder="Type a message... (Enter to send, Shift+Enter for new line), Max 500 characters"
          className={clsx(
            'w-full resize-none rounded-xl border px-4 py-3 text-sm outline-none transition',
            'bg-background text-foreground border-border/60',
            'focus:border-primary/40 focus:ring-1 focus:ring-primary/30',
          )}
          rows={2}
          maxLength={500}
          disabled={isWithdrawn}
        />
        <Button
          onClick={handleSendMessage}
          disabled={!newMessage.trim() || sendMutation.isPending || isWithdrawn}
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
  )
}

export default MessageInput