import ChatContainer from '@/src/components/chat/ChatContainer';

export default function CompanyChatPage() {
  return (
    <div className="container py-4">
      <ChatContainer userType="company" />
    </div>
  );
}