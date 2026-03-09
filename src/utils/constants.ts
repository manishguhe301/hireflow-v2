import {
  ApplicationStatus,
  CompanyStatus,
  JobStatus,
  Role,
} from '@prisma/client';
import { Briefcase, ShieldCheck, UserCircle, Workflow } from 'lucide-react';

export const STATUS_STYLE: Record<CompanyStatus, string> = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  APPROVED: 'bg-green-100 text-green-700',
  REJECTED: 'bg-red-100 text-red-700',
};

export const JOB_STATUS_STYLE: Record<JobStatus, string> = {
  ACTIVE: 'bg-green-100 text-green-700',
  CLOSED: 'bg-red-100 text-red-700',
  DRAFT: 'bg-yellow-100 text-yellow-700',
};

export const JOB_STATUSES: { value: JobStatus; label: string }[] = [
  { value: 'ACTIVE', label: 'Active' },
  { value: 'CLOSED', label: 'Closed' },
  { value: 'DRAFT', label: 'Draft' },
];

export const TABS: { label: string; value: CompanyStatus | 'ALL' }[] = [
  { label: 'All', value: 'ALL' },
  { label: 'Pending', value: 'PENDING' },
  { label: 'Approved', value: 'APPROVED' },
  { label: 'Rejected', value: 'REJECTED' },
];

export const JOB_TABS: { label: string; value: JobStatus | 'ALL' }[] = [
  { label: 'All', value: 'ALL' },
  { label: 'Active', value: 'ACTIVE' },
  { label: 'Closed', value: 'CLOSED' },
  { label: 'Draft', value: 'DRAFT' },
];

export const ADMIN_USERS_TABS: {
  label: string;
  value: Role | 'ALL';
}[] = [
  { label: 'All', value: 'ALL' },
  { label: 'Company Admins', value: Role.COMPANY_ADMIN },
  { label: 'Job Seekers', value: Role.JOB_SEEKER },
  { label: 'Platform Admins', value: Role.PLATFORM_ADMIN },
];

export const ROLE_STYLE: Record<Role, string> = {
  JOB_SEEKER: 'bg-blue-100 text-blue-700',
  COMPANY_ADMIN: 'bg-purple-100 text-purple-700',
  PLATFORM_ADMIN: 'bg-gray-200 text-gray-800',
};

export const labels = {
  JOB_SEEKER: 'Job Seeker',
  COMPANY_ADMIN: 'Company Admin',
  PLATFORM_ADMIN: 'Platform Admin',
};

export const APPLICATION_STATUS_STYLES = {
  REJECTED: 'bg-destructive/10 text-destructive',
  APPLIED: 'bg-primary/10 text-primary',
  REVIEWING: 'bg-blue-500/10 text-blue-500',
  SHORTLISTED: 'bg-yellow-500/10 text-yellow-500',
  INTERVIEW_SCHEDULED: 'bg-purple-500/10 text-purple-500',
  OFFERED: 'bg-green-500/10 text-green-500',
  HIRED: 'bg-emerald-500/10 text-emerald-500',
};

export const APPLICATIONS_TABS: {
  label: string;
  value: ApplicationStatus | 'ALL';
}[] = [
  { label: 'All', value: 'ALL' },
  { label: 'Applied', value: ApplicationStatus.APPLIED },
  { label: 'Reviewing', value: ApplicationStatus.REVIEWING },
  { label: 'Shortlisted', value: ApplicationStatus.SHORTLISTED },
  {
    label: 'Interview Scheduled',
    value: ApplicationStatus.INTERVIEW_SCHEDULED,
  },
  { label: 'Offered', value: ApplicationStatus.OFFERED },
  { label: 'Rejected', value: ApplicationStatus.REJECTED },
  { label: 'Hired', value: ApplicationStatus.HIRED },
];

export const APPLICATION_TABS_WITH_SORT: {
  label: string;
  value: string;
}[] = [
  ...APPLICATIONS_TABS.map((tab) => ({ label: tab.label, value: tab.value })),
  { label: 'Sort by Name ', value: 'name' },
  { label: 'Sort by Newest', value: 'recent' },
  { label: 'Sort by Oldest', value: 'oldest' },
];

export const features = [
  {
    icon: Briefcase,
    title: 'Quality Jobs',
    desc: 'Curated opportunities from verified companies only.',
  },
  {
    icon: ShieldCheck,
    title: 'Verified Companies',
    desc: 'Every employer is manually approved.',
  },
  {
    icon: Workflow,
    title: 'Application Tracking',
    desc: 'Track your hiring progress in real-time.',
  },
  {
    icon: UserCircle,
    title: 'Complete Profiles',
    desc: 'Build detailed and professional profiles.',
  },
];

export const STATUS_STYLES: Record<ApplicationStatus, string> = {
  APPLIED: 'bg-blue-500/10 text-blue-600',
  REVIEWING: 'bg-yellow-500/10 text-yellow-600',
  SHORTLISTED: 'bg-purple-500/10 text-purple-600',
  INTERVIEW_SCHEDULED: 'bg-indigo-500/10 text-indigo-600',
  OFFERED: 'bg-green-500/10 text-green-600',
  HIRED: 'bg-emerald-500/10 text-emerald-600',
  REJECTED: 'bg-red-500/10 text-red-600',
};
