import { ExperienceLevel, JobStatus } from '@prisma/client';
import { JobSeekerFormInputs } from '../components/job-seeker/profile/form/ProfileWizard';

export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatDateRange(
  startDate: Date | string,
  endDate?: Date | string | null,
  isCurrent?: boolean,
) {
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : null;

  const format = (date: Date) =>
    date.toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric',
    });

  const startFormatted = format(start);

  if (isCurrent) {
    return `${startFormatted} — Present`;
  }

  if (!end) {
    return `${startFormatted}`;
  }

  const endFormatted = format(end);

  return `${startFormatted} — ${endFormatted}`;
}

export function formatRelativeTime(date: Date | string): string {
  const d = new Date(date);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600)
    return `${Math.floor(diffInSeconds / 60)} minute(s) ago`;
  if (diffInSeconds < 86400)
    return `${Math.floor(diffInSeconds / 3600)} hour(s) ago`;
  if (diffInSeconds < 604800)
    return `${Math.floor(diffInSeconds / 86400)} day(s) ago`;
  if (diffInSeconds < 2592000)
    return `${Math.floor(diffInSeconds / 604800)} week(s) ago`;
  if (diffInSeconds < 31536000)
    return `${Math.floor(diffInSeconds / 2592000)} month(s) ago`;
  return `${Math.floor(diffInSeconds / 31536000)} year(s) ago`;
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

export const buildProfileFormData = (data: JobSeekerFormInputs): FormData => {
  const formData = new FormData();

  formData.append('name', data.name);
  formData.append('contactEmail', data.contactEmail);
  formData.append('countryPhoneCode', data.countryPhoneCode || '');
  formData.append('phone', data.phone || '');
  formData.append('country', data.country || '');
  if (data.city) formData.append('city', data.city);

  if (data.avatar?.length > 0) {
    formData.append('avatar', data.avatar[0]);
  }

  if (data.deleteAvatar) {
    formData.append('deleteAvatar', 'true');
  }

  formData.append(
    'preferredWorkMode',
    JSON.stringify(data.preferredWorkMode || []),
  );
  formData.append('willingToRelocate', String(data.willingToRelocate));
  formData.append('workExperience', JSON.stringify(data.workExperience || []));
  formData.append('education', JSON.stringify(data.education || []));
  formData.append('skills', JSON.stringify(data.skills || []));
  formData.append('certifications', JSON.stringify(data.certifications || []));
  formData.append('jobCategories', JSON.stringify(data.jobCategories || []));
  formData.append(
    'preferredLocations',
    JSON.stringify(data.preferredLocations || []),
  );
  formData.append('otherLinks', JSON.stringify(data.otherLinks || []));

  if (data.resume?.length > 0) {
    formData.append('resume', data.resume[0]);
  }

  if (data.professionalTitle)
    formData.append('professionalTitle', data.professionalTitle);
  if (data.bio) formData.append('bio', data.bio);
  if (data.yearsOfExperience)
    formData.append(
      'yearsOfExperience',
      data.yearsOfExperience as ExperienceLevel,
    );
  if (data.currentEmployment)
    formData.append('currentEmployment', data.currentEmployment);
  if (data.portfolioWebsite)
    formData.append('portfolioWebsite', data.portfolioWebsite);
  if (data.githubUrl) formData.append('githubUrl', data.githubUrl);
  if (data.linkedinUrl) formData.append('linkedinUrl', data.linkedinUrl);
  if (data.twitterUrl) formData.append('twitterUrl', data.twitterUrl);
  if (data.expectedSalaryMin)
    formData.append('expectedSalaryMin', String(data.expectedSalaryMin));
  // if (data.expectedSalaryMax)
  //   formData.append('expectedSalaryMax', String(data.expectedSalaryMax));
  if (data.noticePeriod) formData.append('noticePeriod', data.noticePeriod);

  return formData;
};

export function isNewJob(date: Date | string): boolean {
  const created = new Date(date).getTime();
  const now = Date.now();

  const oneDay = 24 * 60 * 60 * 1000;

  return now - created < oneDay;
}

export const JOB_STATUS_UI: Record<
  JobStatus,
  {
    className: string;
    title: string;
    message: (step: number) => string;
  }
> = {
  DRAFT: {
    className: 'bg-warning/10 border-warning/30 text-warning',
    title: 'Draft Job',
    message: (step) =>
      step >= 4
        ? 'All required details look complete. You can publish this job now.'
        : 'This job is saved as a draft. Complete all steps to publish it.',
  },
  ACTIVE: {
    className: 'bg-success/10 border-success/30 text-success',
    title: 'Active Job',
    message: () =>
      'This job is live and visible to candidates. Any changes will update it immediately.',
  },
  CLOSED: {
    className: 'bg-destructive/10 border-destructive/30 text-destructive',
    title: 'Closed Job',
    message: () =>
      'This job is closed and no longer accepting applications. You can reopen it anytime.',
  },
};
