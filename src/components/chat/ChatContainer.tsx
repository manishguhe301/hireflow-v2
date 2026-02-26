'use client';
import { useState, useEffect, useCallback } from 'react';
import { AppSdk } from '@/src/utils/AppSdk';
import { toast } from 'sonner';
import { Spinner } from '../elements/Loader';
import ChatSidebar from './ChatSidebar';
import ChatWindow from './ChatWindow';
import { ConversationCompany, ConversationListItem, ConversationUser } from '@/src/types';
import { useSearchParams } from 'next/navigation';
import clsx from 'clsx';

export default function ChatContainer({ userType }: { userType: 'company' | 'jobseeker' }) {
  const [conversations, setConversations] = useState<ConversationListItem[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const searchParams = useSearchParams();
  const conversationFromUrl = searchParams.get('conversation');

  const fetchConversations = useCallback(async () => {
    try {
      const res = await AppSdk.getData('/api/chat/conversations', null);
      if (res.error) {
        toast.error(res.error);
        return;
      }
      setConversations(res.conversations);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [])

  useEffect(() => {
    fetchConversations();
  }, []);

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
            onConversationUpdate={fetchConversations}
          />
        </div>
        <div className={clsx(
          "flex-1 h-full",
          !selectedConversation ? "hidden sm:flex" : "flex"
        )}>
          <ChatWindow
            conversationId={selectedConversation}
            userType={userType}
            onMessageSent={fetchConversations}
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