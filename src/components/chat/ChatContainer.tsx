'use client';
import { useState, useEffect } from 'react';
import { AppSdk } from '@/src/utils/AppSdk';
import { toast } from 'sonner';
import { Spinner } from '../elements/Loader';
import ChatSidebar from './ChatSidebar';
import ChatWindow from './ChatWindow';
import { ConversationListItem } from '@/src/types';

export default function ChatContainer({ userType }: { userType: 'company' | 'jobseeker' }) {
  const [conversations, setConversations] = useState<ConversationListItem[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchConversations = async () => {
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
  };

  useEffect(() => {
    fetchConversations();
    const interval = setInterval(fetchConversations, 30000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] max-w-[1400px]  border border-border rounded-2xl overflow-hidden m-4">
      <ChatSidebar
        conversations={conversations}
        selectedConversation={selectedConversation}
        onSelectConversation={setSelectedConversation}
        userType={userType}
        onConversationUpdate={fetchConversations}
      />
      <ChatWindow
        conversationId={selectedConversation}
        userType={userType}
        onMessageSent={fetchConversations}
      />
    </div>
  );
}