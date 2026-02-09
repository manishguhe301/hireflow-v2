import { CompanyStatus, Role, Job, JobStatus } from '@prisma/client';

export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatRelativeTime(date: Date | string): string {
  const d = new Date(date);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600)
    return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400)
    return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 604800)
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  if (diffInSeconds < 2592000)
    return `${Math.floor(diffInSeconds / 604800)} weeks ago`;
  if (diffInSeconds < 31536000)
    return `${Math.floor(diffInSeconds / 2592000)} months ago`;
  return `${Math.floor(diffInSeconds / 31536000)} years ago`;
}

export function formatSalary(min?: number | null, max?: number | null): string {
  if (!min && !max) return 'Not disclosed';
  if (min && !max) return `₹${min.toLocaleString()}L+`;
  if (!min && max) return `Up to ₹${max.toLocaleString()}L`;
  return `₹${min?.toLocaleString()}L - ₹${max?.toLocaleString()}L`;
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

//eslint-disable-next-line @typescript-eslint/no-explicit-any
export function calculateProfileCompletion(profile: any): number {
  const fields = [
    profile.photo,
    profile.phone,
    profile.location,
    profile.professionalTitle,
    profile.bio,
    profile.resumeUrl,
    profile.skills?.length > 0,
    profile.workExperience?.length > 0,
    profile.education?.length > 0,
  ];

  const completed = fields.filter(Boolean).length;
  return Math.round((completed / fields.length) * 100);
}

//eslint-disable-next-line @typescript-eslint/no-explicit-any
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return function (...args: Parameters<T>) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(email: string): boolean {
  return emailRegex.test(email);
}

export function isPasswordValid(password: string): boolean {
  return password.length >= 8;
}

export const showError = (
  message: string,
  setError: React.Dispatch<React.SetStateAction<string>>,
) => {
  setError(message);
  setTimeout(() => setError(''), 3000);
};

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

export function validateFileType(file: File, accept: string): boolean {
  const allowedTypes = accept.split(',').map((t) => t.trim());
  return allowedTypes.some((type) => {
    if (type.endsWith('/*')) {
      return file.type.startsWith(type.replace('/*', ''));
    }
    return file.type === type;
  });
}

export function validateFileSize(file: File, maxSizeMB: number): boolean {
  return file.size <= maxSizeMB * 1024 * 1024;
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

export const getFileNameFromPath = (path?: string | null) => {
  if (!path) return null;
  return path.split('/').pop()?.replace(/^\d+-/, '');
};

export const isRichTextEmpty = (value: string) => {
  if (!value) return true;
  const text = value
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, '')
    .trim();
  return text.length === 0;
};

export const getLabel = (
  options: { label: string; value: string }[],
  value?: string,
) => options.find((o) => o.value === value)?.label || value;
