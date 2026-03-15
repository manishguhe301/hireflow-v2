import React from 'react'
import { Spinner } from '../elements/Loader';
import { Trash2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { formatRelativeTime } from '@/src/utils/helper';
import clsx from 'clsx';
import { ConversationCompany, ConversationListItem, ConversationMessage, ConversationUser } from '@/src/types';
import { useMutation } from '@tanstack/react-query';
import { AppSdk } from '@/src/utils/AppSdk';
import { toast } from 'sonner';

const SidebarChatItem = ({ src,
  conv,
  onSelectConversation,
  selectedConversation,
  otherUser,
  lastMessage,
  unreadCount,
  name,
  userType,
  onDeleteConversation,
  onConversationUpdate
}: {
  conv: ConversationListItem
  otherUser: ConversationUser | ConversationCompany
  src: string
  name: string
  unreadCount: number
  lastMessage: ConversationMessage
  userType: "company" | "jobseeker"
  onDeleteConversation: (id: string) => void
  onConversationUpdate: () => void
  onSelectConversation: (id: string) => void;
  selectedConversation: string | null;
}) => {

  const deleteMutation = useMutation({
    mutationFn: (id: string) => AppSdk.deleteData(`/api/chat/conversations/${id}`, null),
    onSuccess: (res, id) => {
      if (res.error) {
        toast.error(res.error);
        return;
      }
      toast.success('Conversation deleted');
      onDeleteConversation(id);
      if (selectedConversation === id) onSelectConversation('');
      onConversationUpdate();
    },
    onError: () => {
      toast.error('Failed to delete');
    },
  });
  return (
    <div
      onClick={() => onSelectConversation(conv.id)}
      className={clsx(
        'w-full p-4 border-b border-border hover:bg-muted/30 hover:shadow-sm transition text-left cursor-pointer',
        selectedConversation === conv.id &&
        'bg-muted/50 border-l-2 border-primary'
      )}
    >
      <div className=" flex items-start gap-3">
        {('logo' in otherUser && otherUser.logo) ||
          (!('logo' in otherUser) && otherUser.profile?.avatar) ? (

          <div className='relative'>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={
                src
              }
              loading='lazy'
              alt={otherUser.name}
              // className="h-10 w-10 rounded-full object-cover flex-shrink-0"
              className={clsx(
                "h-10 w-10 object-cover rounded-full shrink-0 transition-opacity duration-300",
              )}
            />
          </div>
        ) : (
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <span className="text-primary font-semibold">
              {otherUser.name[0].toUpperCase()}
            </span>
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <p className="font-medium truncate">{name}</p>
            {lastMessage && (
              <span className="text-xs text-muted-foreground flex-shrink-0 ml-2">
                {formatRelativeTime(lastMessage.createdAt)}
              </span>
            )}
          </div>

          {conv.job && (
            <p className="text-xs text-muted-foreground mb-1 truncate">
              Re: {conv.job.title}
            </p>
          )}

          <div className={clsx('flex flex-row items-center gap-2 ',
            lastMessage ? 'justify-between' : 'justify-end',
            'max-sm:justify-end'
          )}>
            {lastMessage && (
              <div className="flex items-center justify-between gap-2 w-1/2 max-sm:hidden">
                <p className="text-xs text-muted-foreground truncate flex-1">
                  {lastMessage.content}
                </p>
              </div>
            )}
            <div className="flex items-center justify-end gap-2 self-end">
              {unreadCount > 0 && (
                <span className="flex-shrink-0 px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-xs font-semibold">
                  {unreadCount}
                </span>
              )}
              {userType === 'company' &&
                <Button
                  disabled={deleteMutation.isPending &&
                    deleteMutation.variables === conv.id}
                  variant='ghost'
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteMutation.mutate(conv.id);
                  }
                  }
                  aria-label='Delete conversation'
                  className='p-0!'>
                  {deleteMutation.isPending &&
                    deleteMutation.variables === conv.id ? (
                    <Spinner className="h-4 w-4" />
                  ) : (
                    <Trash2 className="text-destructive h-4 w-4 cursor-pointer" />
                  )}
                </Button>}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SidebarChatItem