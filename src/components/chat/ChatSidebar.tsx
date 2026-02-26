'use client';
import { formatRelativeTime } from '@/src/utils/helper';
import { MessageCircle } from 'lucide-react';
import clsx from 'clsx';
import { ConversationListItem } from '@/src/types';

interface ChatSidebarProps {
  conversations: ConversationListItem[];
  selectedConversation: string | null;
  onSelectConversation: (id: string) => void;
  userType: 'company' | 'jobseeker';
  onConversationUpdate: () => void;
}

export default function ChatSidebar({
  conversations,
  selectedConversation,
  onSelectConversation,
  userType,
}: ChatSidebarProps) {
  return (
    <div className="w-80 border-r border-border bg-card flex flex-col">
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold">Messages</h2>
        <p className="text-xs text-muted-foreground mt-1">
          {conversations.length} conversation
          {conversations.length !== 1 ? 's' : ''}
        </p>
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
          conversations.map((conv) => {
            const otherUser =
              userType === 'company' ? conv.jobSeeker : conv.company;
            const lastMessage = conv.messages[0];
            const unreadCount = conv._count.messages;

            if (!otherUser) return null;

            let src = '';

            if ('logo' in otherUser) {
              src = otherUser.logo || '';
            } else {
              src = otherUser.profile?.avatar || '';
            }

            return (
              <button
                key={conv.id}
                onClick={() => onSelectConversation(conv.id)}
                className={clsx(
                  'w-full p-4 border-b border-border hover:bg-muted transition text-left',
                  selectedConversation === conv.id && 'bg-muted',
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
                      <p className="font-medium truncate">{otherUser.name}</p>
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

                    {lastMessage && (
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm text-muted-foreground truncate flex-1">
                          {lastMessage.content}
                        </p>
                        {unreadCount > 0 && (
                          <span className="flex-shrink-0 px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-xs font-semibold">
                            {unreadCount}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}