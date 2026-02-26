export interface ConversationUser {
  id: string;
  name: string;
  email: string;
  profile: {
    avatar: string | null;
    name: string;
  } | null;
}

export interface ConversationCompany {
  id: string;
  name: string;
  logo: string | null;
}

export interface ConversationJob {
  id: string;
  title: string;
  slug: string;
}

export interface ConversationMessage {
  id: string;
  content: string | null;
  isRead: boolean;
  createdAt: Date;
  senderType: 'COMPANY' | 'JOB_SEEKER';
}

export interface ConversationListItem {
  id: string;
  lastMessageAt: Date;
  jobSeeker?: ConversationUser;
  company?: ConversationCompany;
  job: ConversationJob | null;
  messages: ConversationMessage[];
  _count: {
    messages: number;
  };
}

export interface MessageWithSender {
  id: string;
  conversationId: string;
  senderId: string;
  senderType: 'COMPANY' | 'JOB_SEEKER';
  content: string | null;
  isRead: boolean;
  createdAt: Date;
  sender: {
    id: string;
    name: string;
    profile: {
      avatar: string | null;
      name: string;
    } | null;
  };
}
