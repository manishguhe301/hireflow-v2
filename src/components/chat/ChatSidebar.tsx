'use client';
import { formatRelativeTime } from '@/src/utils/helper';
import { MessageCircle, RefreshCw, Trash2 } from 'lucide-react';
import clsx from 'clsx';
import { ConversationCompany, ConversationListItem, ConversationUser } from '@/src/types';
import { Dispatch, RefObject, SetStateAction, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '../ui/Button';
import { AppSdk } from '@/src/utils/AppSdk';
import { Spinner } from '../elements/Loader';
import { useMutation } from '@tanstack/react-query';

interface ChatSidebarProps {
  conversations: ConversationListItem[];
  selectedConversation: string | null;
  onSelectConversation: (id: string) => void;
  userType: 'company' | 'jobseeker';
  onConversationUpdate: () => void;
  searchQuery: string;
  hasMore: boolean
  observerTarget: RefObject<HTMLDivElement | null>
  isLoadingMore: boolean
  setSearchQuery: Dispatch<SetStateAction<string>>
  onDeleteConversation: (id: string) => void;
}

export default function ChatSidebar({
  conversations,
  selectedConversation,
  onSelectConversation,
  userType,
  onConversationUpdate,
  searchQuery,
  hasMore,
  observerTarget,
  isLoadingMore,
  setSearchQuery,
  // setConversations
  onDeleteConversation,
}: ChatSidebarProps) {

  const [isRefreshing, setIsRefreshing] = useState(false);

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

  const renderedConversations = useMemo(() => {
    return conversations.map((conv) => {
      const otherUser =
        userType === 'company'
          ? (conv.jobSeeker as ConversationUser)
          : (conv.company as ConversationCompany);

      if (!otherUser) return null;

      const lastMessage = conv.messages[0];
      const unreadCount = conv._count.messages;

      let src = '';

      if ('logo' in otherUser) {
        src = otherUser.logo || '';
      } else {
        src = otherUser.profile?.avatar || '';
      }

      const name =
        (otherUser as ConversationUser)?.profile?.name || otherUser.name;

      return { conv, otherUser, lastMessage, unreadCount, src, name };
    });
  }, [conversations, userType]);

  return (
    <div className="w-80 border-r border-border bg-card flex flex-col max-sm:w-full">
      <div className="p-4 border-b border-border">
        <div className='flex flex-row items-center justify-between gap-2'>
          <h2 className="text-lg font-semibold">Messages</h2>
          <p className="text-xs text-muted-foreground mt-1 flex flex-row items-center gap-2">
            {conversations.length.toLocaleString()} conversation
            {conversations.length !== 1 && 's'}
            <RefreshCw
              onClick={() => {
                if (isRefreshing) return;

                setIsRefreshing(true);
                onConversationUpdate();

                setTimeout(() => setIsRefreshing(false), 1000);
              }}
              size={16}
              className={clsx(
                'transition',
                isRefreshing && 'animate-spin opacity-50 cursor-not-allowed'
              )}
            />
          </p>
        </div>

        <div className="relative mt-2">

          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
            }}
            aria-label="Search conversations"
            className={
              clsx(
                ' mt-2 w-full rounded-xl border px-2 py-2 text-sm outline-none transition',
                'bg-background text-foreground border-border/60 focus:border-primary/40 focus:ring-1 focus:ring-primary/30',
                'appearance-none',)
            }
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-[60%] -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      <div className="overflow-y-auto flex-1">
        {conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground px-4">
            <MessageCircle className="h-12 w-12 mb-4 opacity-50" />
            <p className="text-sm text-center">No conversations yet</p>
            {userType === 'company' && (
              <p className="text-xs text-center mt-2">
                Start a conversation from the applications page
              </p>
            )}
          </div>
        ) : (
          <>
            {renderedConversations.map((item) => {
              if (!item) return null;

              const { conv, otherUser, lastMessage, unreadCount, src, name } = item;

              if (!otherUser) return null;

              return (
                <div
                  key={conv.id}
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
                        lastMessage ? 'justify-between' : 'justify-end'
                      )}>
                        {lastMessage && (
                          <div className="flex items-center justify-between gap-2 w-1/2">
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
              );
            })}

            {hasMore && (
              <div ref={observerTarget} className="p-4 text-center">
                {isLoadingMore && <Spinner className="h-6 w-6 mx-auto" />}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}