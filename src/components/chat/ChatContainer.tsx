'use client';
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { AppSdk } from '@/src/utils/AppSdk';
import { toast } from 'sonner';
import { Spinner } from '../elements/Loader';
import ChatSidebar from './ChatSidebar';
import ChatWindow from './ChatWindow';
import { ConversationCompany, ConversationListItem, ConversationUser } from '@/src/types';
import { useSearchParams } from 'next/navigation';
import clsx from 'clsx';
import { useChatSidebarUpdate } from '@/src/store/hooks/useChatSidebarUpdate';
import useDebounce from '@/src/store/hooks/useDebounce';
import ChatSidebarSkeleton from '../skeletons/ChatSidebarSkeleton';

export default function ChatContainer({ userType }: { userType: 'company' | 'jobseeker' }) {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const observerTarget = useRef<HTMLDivElement>(null);
  const debouncedSearch = useDebounce(searchQuery, 500);
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const conversationFromUrl = searchParams.get('conversation');

  const hasAutoSelectedFromUrl = useRef(false);

  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ['conversations', debouncedSearch],
    queryFn: async ({ pageParam }: { pageParam: number }) => {
      const res = await AppSdk.getData(
        `/api/chat/conversations?page=${pageParam}&limit=20${debouncedSearch ? `&search=${debouncedSearch}` : ''}`,
        null,
      );
      if (res.error) {
        toast.error(res.error);
        throw new Error(res.error);
      }
      return res;
    },
    getNextPageParam: (lastPage, allPages) =>
      lastPage.pagination.hasMore ? allPages.length + 1 : undefined,
    initialPageParam: 1,
  });

  const conversations = useMemo(() => data?.pages.flatMap((p) => p.conversations) ?? [], [data]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 1.0 },
    );
    if (observerTarget.current) observer.observe(observerTarget.current);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  useEffect(() => {
    if (hasAutoSelectedFromUrl.current) return;
    if (conversationFromUrl && conversations.length > 0) {
      const exists = conversations.find((c) => c.id === conversationFromUrl);
      if (exists) {
        //eslint-disable-next-line
        setSelectedConversation(conversationFromUrl);
        hasAutoSelectedFromUrl.current = true;
      }
    }
  }, [conversationFromUrl, conversations]);

  const handleDeleteConversation = useCallback(
    (id: string) => {
      queryClient.setQueryData(['conversations', debouncedSearch],
        //eslint-disable-next-line
        (old: any) => {
          if (!old) return old;
          return {
            ...old,
            //eslint-disable-next-line
            pages: old.pages.map((page: any) => ({
              ...page,
              conversations: page.conversations.filter(
                (c: ConversationListItem) => c.id !== id,
              ),
            })),
          };
        });
      if (selectedConversation === id) setSelectedConversation(null);
    },
    [queryClient, debouncedSearch, selectedConversation],
  );

  const handleSidebarUpdate = useCallback(
    (deletedConversationId?: string) => {
      if (deletedConversationId) {
        handleDeleteConversation(deletedConversationId);
        return;
      }
      refetch();
    },
    [handleDeleteConversation, refetch],
  );

  useChatSidebarUpdate(handleSidebarUpdate);

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-8rem)] border border-border rounded-2xl overflow-hidden m-4">
        <ChatSidebarSkeleton />

        <div className="flex-1 flex items-center justify-center text-muted-foreground">
          Select a conversation
        </div>
      </div>
    );
  }

  const selectedConversationData = conversations.find((c) => c.id === selectedConversation);

  return (
    <div>
      <div className="flex h-[calc(100vh-8rem)] border border-border rounded-2xl overflow-hidden m-4 relative">
        <div className={clsx(
          "w-full sm:w-80 h-full border-r border-border",
          selectedConversation ? "hidden sm:flex" : "flex"
        )}>
          <ChatSidebar
            conversations={conversations}
            selectedConversation={selectedConversation}
            onSelectConversation={setSelectedConversation}
            userType={userType}
            onConversationUpdate={() => refetch()}
            searchQuery={searchQuery}
            hasMore={hasNextPage ?? false}
            setSearchQuery={setSearchQuery}
            onDeleteConversation={handleDeleteConversation}
            observerTarget={observerTarget}
            isLoadingMore={isFetchingNextPage}
          />
        </div>
        <div className={clsx(
          "flex-1 h-full",
          !selectedConversation ? "hidden sm:flex" : "flex"
        )}>
          <ChatWindow
            conversationId={selectedConversation}
            userType={userType}
            onMessageSent={() => refetch()}
            onBack={() => setSelectedConversation(null)}
            chatPartnerName={
              selectedConversationData
                ? (userType === 'company'
                  ? (selectedConversationData.jobSeeker as ConversationUser)?.profile?.name || selectedConversationData.jobSeeker?.name
                  : (selectedConversationData.company as ConversationCompany)?.name)
                : ''
            }
            jobTitle={selectedConversationData?.job?.title}
          />
        </div>
      </div>
    </div>
  );
}