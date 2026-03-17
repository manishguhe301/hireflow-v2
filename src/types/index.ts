import {
  Company,
  CurrentEmployment,
  EmploymentType,
  ExperienceLevel,
  Job,
  User,
  WorkMode,
} from '@prisma/client';
import { Dispatch, RefObject, SetStateAction } from 'react';

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

export interface ChatSidebarProps {
  conversations: ConversationListItem[];
  selectedConversation: string | null;
  onSelectConversation: (id: string) => void;
  userType: 'company' | 'jobseeker';
  onConversationUpdate: () => void;
  searchQuery: string;
  hasMore: boolean;
  observerTarget: RefObject<HTMLDivElement | null>;
  isLoadingMore: boolean;
  setSearchQuery: Dispatch<SetStateAction<string>>;
  onDeleteConversation: (id: string) => void;
  isFetching: boolean;
}

export interface ChatSidebarTopSectionProps {
  conversations: ConversationListItem[];
  isRefreshing: boolean;
  onConversationUpdate: () => void;
  setIsRefreshing: Dispatch<SetStateAction<boolean>>;
  setSearchQuery: Dispatch<SetStateAction<string>>;
  searchQuery: string;
}

export interface ChatWindowProps {
  conversationId: string | null;
  userType: 'company' | 'jobseeker';
  onMessageSent: () => void;
  chatPartnerName?: string;
  chatPartnerAvatar?: string | null;
  jobTitle?: string;
  onBack?: () => void;
}

export interface MessageInputProps {
  conversationId: string | null;
  setMessages: Dispatch<SetStateAction<MessageWithSender[]>>;
  onMessageSent: () => void;
  newMessage: string;
  setNewMessage: Dispatch<SetStateAction<string>>;
  userType: 'company' | 'jobseeker';
  messagesEndRef: RefObject<HTMLDivElement | null>;
}

export interface ChatItemProps {
  conv: ConversationListItem;
  otherUser: ConversationUser | ConversationCompany;
  src: string;
  name: string;
  unreadCount: number;
  lastMessage: ConversationMessage;
  userType: 'company' | 'jobseeker';
  onDeleteConversation: (id: string) => void;
  onConversationUpdate: () => void;
  onSelectConversation: (id: string) => void;
  selectedConversation: string | null;
}

export type JobFormInputs = {
  jobId?: string;
  title: string;
  description: string;
  requirements: string;
  responsibilities?: string;
  skills: string[];
  experienceLevel: ExperienceLevel;
  employmentType: EmploymentType;
  workMode: WorkMode;
  country: string;
  city?: string;
  salaryMin?: number;
  salaryMax?: number;
  // currency?: string;
  hideSalary: boolean;
  numberOfOpenings: number;
  applicationDeadline?: Date;
  category: string;
};

export interface CompanyDashboardStats {
  totalJobs: number;
  activeJobs: number;
  totalApplications: number;
  totalViews: number;
  statusBreakdown: {
    applied: number;
    reviewing: number;
    shortlisted: number;
    interview: number;
    rejected: number;
    offered: number;
    hired: number;
  };
}

export interface TimeSeriesData {
  date: string;
  applications: number;
}

export interface RecentApplication {
  id: string;
  status: string;
  createdAt: string;
  user: {
    profile: {
      name: string;
      avatar: string | null;
    } | null;
  };
  job: {
    title: string;
    slug: string;
  };
}

export interface AnalyticsData {
  applicationsPerJob: {
    jobTitle: string;
    applications: number;
    views: number;
  }[];
  funnel: {
    stage: string;
    count: number;
    percentage: number;
  }[];
}

export interface JobDetails extends Job {
  _count: {
    applications: number;
    savedJobs: number;
  };
  applications: {
    id: string;
    status: string;
    createdAt: Date;
  }[];
  company: Company;
}

export type ApplyFormInputs = {
  coverLetter: string;
  customResume: FileList;
};

export type ApplyModalProps = {
  open: boolean;
  onClose: () => void;
  job: {
    id: string;
    title: string;
    slug: string;
    workMode: string;
    employmentType: string;
    company: {
      name: string;
      logo: string | null;
    };
    country: string;
    city: string | null;
  };
  onSuccess: () => void;
};

export type WorkExperienceInput = {
  id?: string;
  company: string;
  title: string;
  location?: string | null;
  workMode: WorkMode;
  startDate: Date;
  endDate?: Date | null;
  description?: string | null;
  isCurrent: boolean;
  isPartTime: boolean;
};

export type EducationInput = {
  id?: string;
  institution: string;
  degree: string;
  fieldOfStudy: string | null;
  startYear: number | null;
  endYear: number | null;
  grade: string | null;
  isCurrent: boolean;
};

export type CertificationInput = {
  id?: string;
  name: string;
  organization: string;
  issueDate: Date;
  expiryDate: Date | null;
  credentialUrl: string | null;
  credentialId: string | null;
};

export type JobSeekerFormInputs = {
  userId: string;
  avatar: FileList;
  phone: string;
  country: string;
  countryPhoneCode: string;
  city: string;
  contactEmail: string;
  name: string;

  preferredWorkMode: WorkMode[];
  willingToRelocate: boolean;
  professionalTitle: string;
  bio: string;
  yearsOfExperience?: ExperienceLevel | null;
  currentEmployment?: CurrentEmployment | null;

  resume: FileList;

  skills: string[];
  workExperience: WorkExperienceInput[];
  education: EducationInput[];
  certifications: CertificationInput[];

  portfolioWebsite: string;
  githubUrl: string;
  linkedinUrl: string;
  twitterUrl: string;
  otherLinks: string[];
  jobCategories: string[];
  preferredLocations: string[];
  expectedSalaryMin: number;
  // expectedSalaryMax: number
  noticePeriod: string;
  deleteAvatar?: boolean;
};
