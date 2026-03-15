'use client';
import { MessageCircle, } from 'lucide-react';
import { ChatSidebarProps, ConversationCompany, ConversationUser } from '@/src/types';
import { useMemo, useState } from 'react';
import { Spinner } from '../elements/Loader';
import Skeleton from '../ui/Skeleton';
import ChatSidebarTopSection from './ChatSidebarTopSection';
import SidebarChatItem from './SidebarChatItem';

const ChatSidebarSkeleton = () => {
  return (
    <div className="w-full overflow-hidden h-full border-r border-border p-3 space-y-3">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-2">
          <Skeleton variant="circle" width={40} height={40} animation="wave" />
          <div className="flex-1 space-y-2">
            <Skeleton width="70%" height={12} animation="wave" />
            <Skeleton width="50%" height={10} animation="wave" />
          </div>

        </div>
      ))}
    </div>
  )
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
  isFetching
}: ChatSidebarProps) {

  const [isRefreshing, setIsRefreshing] = useState(false);

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

  const noConversationUI = () => {
    return <div className="flex flex-col items-center justify-center py-12 text-muted-foreground px-4">
      <MessageCircle className="h-12 w-12 mb-4 opacity-50" />
      <p className="text-sm text-center">No conversations yet</p>
      {userType === 'company' && (
        <p className="text-xs text-center mt-2">
          Start a conversation from the applications page
        </p>
      )}
    </div>
  }

  return (
    <div className="w-80 border-r border-border bg-card flex flex-col max-sm:w-full">
      <ChatSidebarTopSection
        isRefreshing={isRefreshing}
        setIsRefreshing={setIsRefreshing}
        onConversationUpdate={onConversationUpdate}
        conversations={conversations}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <div className="overflow-y-auto flex-1">
        {
          isFetching && searchQuery ?
            <ChatSidebarSkeleton /> :
            conversations.length === 0 ? (
              noConversationUI()
            ) : (
              <>
                {renderedConversations.map((item) => {
                  if (!item) return null;

                  const { conv, otherUser, lastMessage, unreadCount, src, name } = item;

                  if (!otherUser) return null;

                  return (
                    <SidebarChatItem
                      key={conv.id}
                      conv={conv}
                      otherUser={otherUser}
                      src={src}
                      name={name}
                      unreadCount={unreadCount}
                      lastMessage={lastMessage}
                      selectedConversation={selectedConversation}
                      userType={userType}
                      onSelectConversation={onSelectConversation}
                      onDeleteConversation={onDeleteConversation}
                      onConversationUpdate={onConversationUpdate}
                    />
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
    </div >
  );
}