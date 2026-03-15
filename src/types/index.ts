import { Company, User } from '@prisma/client';

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

export type ProfileFormInputs = {
  name: string;
  description: string;
  industry: string;
  companySize: string;
  foundedYear: string;
  website: string;
  linkedinProfile: string;

  contactEmail: string;
  contactPhone: string;
  country: string;
  city: string;
  countryPhoneCode: string;
  address: string;

  logo: FileList;
  businessDocument: FileList;
  taxDocument: FileList;

  deleteLogo?: boolean;
};

export type PaginationType = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export interface AdminDashboardStats {
  companies: {
    total: number;
    pending: number;
    rejected: number;
    approved: number;
  };
  users: {
    total: number;
    jobSeekers: number;
    admins: number;
  };
  platform: {
    totalJobs: number;
    totalApplications: number;
    recentApprovals: number;
    recentRejections: number;
  };
  analytics: {
    userGrowth: { month: string; users: number }[];
    jobTrends: { month: string; jobs: number }[];
    topCompanies: { name: string; jobs: number }[];
    recentActivity: {
      action: string;
      timestamp: Date;
      details: string;
    }[];
  };
}

export type AdminCompaniesTableProps = {
  filteredCompanies: Company[];
  handleApprove: (id: string) => Promise<void>;
  loadingAction: string | null;
  rejectCompanyId: string | null;
  setDeleteCompanyId: React.Dispatch<React.SetStateAction<string | null>>;
  setRejectCompanyId: React.Dispatch<React.SetStateAction<string | null>>;
  disabled?: boolean;
};

export type DeleteCompanyModalProps = {
  deleteCompanyId: string | null;
  setDeleteCompanyId: React.Dispatch<React.SetStateAction<string | null>>;
  handleDelete: () => Promise<void>;
  loadingAction: string | null;
  companyName: string;
};

export type RejectCompanyModalProps = {
  rejectCompanyId: string | null;
  setRejectCompanyId: React.Dispatch<React.SetStateAction<string | null>>;
  rejectReason: string;
  setRejectReason: React.Dispatch<React.SetStateAction<string>>;
  onReject: (id: string, reason: string) => Promise<void>;
  loadingAction: string | null;
};

export type UserDeleteModalProps = {
  deleteUserId: string | null;
  setDeleteUserId: React.Dispatch<React.SetStateAction<string | null>>;
  handleDelete: () => Promise<void>;
  loadingAction: string | null;
  deleteUserName: string;
};

export type UsersTableProps = {
  filteredUsers: User[];
  loadingAction: string | null;
  setDeleteUserId: React.Dispatch<React.SetStateAction<string | null>>;
  disabled?: boolean;
};
