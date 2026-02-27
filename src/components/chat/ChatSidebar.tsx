'use client';
import { formatRelativeTime } from '@/src/utils/helper';
import { MessageCircle, Trash2 } from 'lucide-react';
import clsx from 'clsx';
import { ConversationCompany, ConversationListItem, ConversationUser } from '@/src/types';
import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '../ui/Button';
import { AppSdk } from '@/src/utils/AppSdk';
import { Spinner } from '../elements/Loader';

interface ChatSidebarProps {
  conversations: ConversationListItem[];
  selectedConversation: string | null;
  onSelectConversation: (id: string) => void;
  userType: 'company' | 'jobseeker';
  onConversationUpdate: () => void;
}

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

export default function ChatSidebar({
  conversations: initialConversations,
  selectedConversation,
  onSelectConversation,
  userType,
  onConversationUpdate
}: ChatSidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [conversations, setConversations] = useState(initialConversations);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);
  const observerTarget = useRef<HTMLDivElement>(null);
  const debouncedSearch = useDebounce(searchQuery, 500);

  const fetchConversations = useCallback(async (pageNum: number, search: string) => {
    try {
      setIsLoadingMore(true);
      const res = await AppSdk.getData(
        `/api/chat/conversations?page=${pageNum}&limit=20${search ? `&search=${search}` : ''}`,
        null,
      );
      if (res.error) {
        toast.error(res.error);
        return;
      }

      if (pageNum === 1) {
        setConversations(res.conversations);
      } else {
        setConversations((prev) => [...prev, ...res.conversations]);
      }
      setHasMore(res.pagination.hasMore);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    setPage(1);
    fetchConversations(1, debouncedSearch);
  }, [debouncedSearch, fetchConversations]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 1.0 },
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [hasMore, isLoadingMore]);

  useEffect(() => {
    if (page > 1) {
      fetchConversations(page, debouncedSearch);
    }
  }, [page, debouncedSearch, fetchConversations]);

  const handleDeleteConversation = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setIsDeletingId(id);
    try {
      const res = await AppSdk.deleteData(`/api/chat/conversations/${id}`, null);
      if (res.error) {
        toast.error(res.error);
        return;
      }
      toast.success('Conversation deleted');
      setConversations((prev) => prev.filter((c) => c.id !== id));
      if (selectedConversation === id) {
        onSelectConversation('');
      }
      onConversationUpdate();
    } catch (error) {
      console.log(error);
      toast.error('Failed to delete');
    } finally {
      setIsDeletingId(null);
    }
  };

  return (
    <div className="w-80 border-r border-border bg-card flex flex-col max-sm:w-full">
      <div className="p-4 border-b border-border">
        <div className='flex flex-row items-center justify-between gap-2'>
          <h2 className="text-lg font-semibold">Messages</h2>
          <p className="text-xs text-muted-foreground mt-1">
            {conversations.length} conversation
            {conversations.length !== 1 ? 's' : ''}
          </p>
        </div>

        <input
          type="text"
          placeholder="Search conversations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={
            clsx(
              ' mt-2 w-full rounded-xl border px-2 py-2 text-sm outline-none transition',
              'bg-background text-foreground border-border/60 focus:border-primary/40 focus:ring-1 focus:ring-primary/30',
              'appearance-none',)
          }
        />
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
            {conversations.map((conv) => {
              const otherUser =
                userType === 'company' ? conv.jobSeeker as ConversationUser : conv.company as ConversationCompany;
              const lastMessage = conv.messages[0];
              const unreadCount = conv._count.messages;

              if (!otherUser) return null;

              let src = '';

              if ('logo' in otherUser) {
                src = otherUser.logo || '';
              } else {
                src = otherUser.profile?.avatar || '';
              }

              const name = (otherUser as ConversationUser)?.profile?.name || otherUser.name;

              return (
                <div
                  key={conv.id}
                  onClick={() => onSelectConversation(conv.id)}
                  className={clsx(
                    'w-full p-4 border-b border-border hover:bg-muted/30 transition text-left cursor-pointer',
                    selectedConversation === conv.id && 'bg-muted/50',
                  )}
                >
                  <div className="flex items-start gap-3">
                    {('logo' in otherUser && otherUser.logo) ||
                      (!('logo' in otherUser) && otherUser.profile?.avatar) ? (
                      //eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={
                          src
                        }
                        alt={otherUser.name}
                        className="h-10 w-10 rounded-full object-cover flex-shrink-0"
                      />
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
                          <div className="flex items-center justify-between gap-2">
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
                          <Button
                            disabled={isDeletingId === conv.id}
                            variant='ghost'
                            onClick={(e) => handleDeleteConversation
                              (e, conv.id)
                            }
                            className='p-0!'>
                            <Trash2 className='text-destructive h-4 w-4 cursor-pointer' />
                          </Button>
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