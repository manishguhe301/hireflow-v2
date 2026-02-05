import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const jobCategories = [
  { label: 'Software Development', value: 'SOFTWARE_DEVELOPMENT' },
  { label: 'Frontend Development', value: 'FRONTEND_DEVELOPMENT' },
  { label: 'Backend Development', value: 'BACKEND_DEVELOPMENT' },
  { label: 'Full Stack Development', value: 'FULLSTACK_DEVELOPMENT' },

  { label: 'Mobile App Development', value: 'MOBILE_DEVELOPMENT' },
  { label: 'DevOps / Cloud', value: 'DEVOPS_CLOUD' },
  { label: 'Data Science & Analytics', value: 'DATA_SCIENCE' },
  { label: 'AI / Machine Learning', value: 'AI_ML' },

  { label: 'Quality Assurance (QA)', value: 'QA_TESTING' },
  { label: 'Cyber Security', value: 'CYBER_SECURITY' },

  { label: 'UI / UX Design', value: 'UI_UX_DESIGN' },
  { label: 'Product Management', value: 'PRODUCT_MANAGEMENT' },
  { label: 'Project Management', value: 'PROJECT_MANAGEMENT' },

  { label: 'Sales', value: 'SALES' },
  { label: 'Marketing', value: 'MARKETING' },
  { label: 'Growth & SEO', value: 'GROWTH_SEO' },

  { label: 'Customer Support', value: 'CUSTOMER_SUPPORT' },
  { label: 'Operations', value: 'OPERATIONS' },

  { label: 'Human Resources (HR)', value: 'HR' },
  { label: 'Recruitment / Talent Acquisition', value: 'RECRUITMENT' },

  { label: 'Finance & Accounting', value: 'FINANCE' },
  { label: 'Legal & Compliance', value: 'LEGAL' },

  { label: 'Internship', value: 'INTERNSHIP' },
  { label: 'Other', value: 'OTHER' },
];

export const links = [
  {
    label: 'Jobs',
    href: '#jobs',
  },
  {
    label: 'Companies',
    href: '#companies',
  },
  {
    label: 'How it works',
    href: '#how-it-works',
  },
];

export const companySizes = [
  { label: '1–10', value: '1-10' },
  { label: '11–50', value: '11-50' },
  { label: '51–200', value: '51-200' },
  { label: '201–500', value: '201-500' },
];

export const companyIndustries = [
  { label: 'Technology', value: 'technology' },
  { label: 'Finance', value: 'finance' },
  { label: 'Healthcare', value: 'healthcare' },
  { label: 'Education', value: 'education' },
  { label: 'Retail', value: 'retail' },
  { label: 'Manufacturing', value: 'manufacturing' },
  { label: 'Other', value: 'other' },
];
