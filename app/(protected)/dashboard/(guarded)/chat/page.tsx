import ChatContainer from '@/src/components/chat/ChatContainer';

export default function JobSeekerChatPage() {
  return (
    <div className="container py-4">
      <ChatContainer userType="jobseeker" />
    </div>
  );
}