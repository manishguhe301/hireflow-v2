'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { AppSdk } from '@/src/utils/AppSdk';
import { toast } from 'sonner';
import { Spinner } from '../elements/Loader';
import ChatSidebar, { useDebounce } from './ChatSidebar';
import ChatWindow from './ChatWindow';
import { ConversationCompany, ConversationListItem, ConversationUser } from '@/src/types';
import { useSearchParams } from 'next/navigation';
import clsx from 'clsx';
import { useChatSidebarUpdate } from '@/src/store/hooks/useChatSidebarUpdate';

export default function ChatContainer({ userType }: { userType: 'company' | 'jobseeker' }) {
  const [conversations, setConversations] = useState<ConversationListItem[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const observerTarget = useRef<HTMLDivElement>(null);
  const debouncedSearch = useDebounce(searchQuery, 500);

  const searchParams = useSearchParams();
  const conversationFromUrl = searchParams.get('conversation');


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
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    setPage(1);
    setHasMore(true);
    fetchConversations(1, debouncedSearch);
  }, [debouncedSearch, fetchConversations]);

  const handleSidebarUpdate = useCallback(
    (deletedConversationId?: string) => {
      if (deletedConversationId) {
        setConversations((prev) =>
          prev.filter((c) => c.id !== deletedConversationId),
        );

        if (selectedConversation === deletedConversationId) {
          setSelectedConversation(null);
        }

        toast.success('Conversation deleted');

        return;
      }

      fetchConversations(1, debouncedSearch);
    },
    [fetchConversations, debouncedSearch, selectedConversation],
  );

  useChatSidebarUpdate(handleSidebarUpdate);

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

  useEffect(() => {
    if (conversationFromUrl && conversations.length > 0) {
      const exists = conversations.find((c) => c.id === conversationFromUrl);
      if (exists) {
        setSelectedConversation(conversationFromUrl);
      }
    }
  }, [conversationFromUrl, conversations]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  const selectedConversationData = conversations.find
    (c => c.id === selectedConversation);

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
            onConversationUpdate={() => {
              setPage(1);
              fetchConversations(1, debouncedSearch);
            }} searchQuery={searchQuery}
            hasMore={hasMore}
            setSearchQuery={setSearchQuery}
            setConversations={setConversations}
            observerTarget={observerTarget}
            isLoadingMore={isLoadingMore}
          />

        </div>
        <div className={clsx(
          "flex-1 h-full",
          !selectedConversation ? "hidden sm:flex" : "flex"
        )}>
          <ChatWindow
            conversationId={selectedConversation}
            userType={userType}
            onMessageSent={() => {
              setPage(1);
              fetchConversations(1, debouncedSearch);
            }} onBack={() => setSelectedConversation(null)}
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