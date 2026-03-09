import {
  ApplicationStatus,
  CompanyStatus,
  JobStatus,
  Role,
  CurrentEmployment,
  ExperienceLevel,
  WorkMode,
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
    href: '/explore/jobs',
  },
  {
    label: 'Companies',
    href: '/explore/companies',
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

export const experienceLevels = [
  { label: 'Entry Level', value: ExperienceLevel.ENTRY },
  { label: 'Mid Level', value: ExperienceLevel.MID },
  { label: 'Senior Level', value: ExperienceLevel.SENIOR },
  { label: 'Lead Level', value: ExperienceLevel.LEAD },
];

export const employmentTypes = [
  { label: 'Full Time', value: 'FULL_TIME' },
  { label: 'Part Time', value: 'PART_TIME' },
  { label: 'Contract', value: 'CONTRACT' },
  { label: 'Internship', value: 'INTERNSHIP' },
];

export type SelectOption = {
  label: string;
  value: string;
};

export const jobSkills: SelectOption[] = [
  { label: 'HTML', value: 'html' },
  { label: 'CSS', value: 'css' },
  { label: 'JavaScript', value: 'javascript' },
  { label: 'TypeScript', value: 'typescript' },
  { label: 'React', value: 'react' },
  { label: 'Next.js', value: 'nextjs' },
  { label: 'Vue.js', value: 'vuejs' },
  { label: 'Angular', value: 'angular' },
  { label: 'Tailwind CSS', value: 'tailwindcss' },
  { label: 'Bootstrap', value: 'bootstrap' },

  { label: 'Node.js', value: 'nodejs' },
  { label: 'Express.js', value: 'expressjs' },
  { label: 'NestJS', value: 'nestjs' },
  { label: 'Java', value: 'java' },
  { label: 'Spring Boot', value: 'springboot' },
  { label: 'Python', value: 'python' },
  { label: 'Django', value: 'django' },
  { label: 'Flask', value: 'flask' },
  { label: 'PHP', value: 'php' },
  { label: 'Laravel', value: 'laravel' },

  { label: 'MongoDB', value: 'mongodb' },
  { label: 'PostgreSQL', value: 'postgresql' },
  { label: 'MySQL', value: 'mysql' },
  { label: 'SQLite', value: 'sqlite' },
  { label: 'Redis', value: 'redis' },

  { label: 'Docker', value: 'docker' },
  { label: 'Kubernetes', value: 'kubernetes' },
  { label: 'AWS', value: 'aws' },
  { label: 'Azure', value: 'azure' },
  { label: 'Google Cloud', value: 'gcp' },
  { label: 'CI/CD', value: 'cicd' },
  { label: 'Linux', value: 'linux' },
  { label: 'Nginx', value: 'nginx' },

  { label: 'React Native', value: 'react-native' },
  { label: 'Flutter', value: 'flutter' },
  { label: 'Swift', value: 'swift' },
  { label: 'Kotlin', value: 'kotlin' },

  { label: 'Jest', value: 'jest' },
  { label: 'Cypress', value: 'cypress' },
  { label: 'Playwright', value: 'playwright' },
  { label: 'Unit Testing', value: 'unit-testing' },

  { label: 'Git', value: 'git' },
  { label: 'GitHub', value: 'github' },
  { label: 'GitLab', value: 'gitlab' },
  { label: 'Bitbucket', value: 'bitbucket' },

  { label: 'Figma', value: 'figma' },
  { label: 'Adobe XD', value: 'adobe-xd' },
  { label: 'UI/UX Design', value: 'ui-ux' },

  { label: 'REST APIs', value: 'rest-api' },
  { label: 'GraphQL', value: 'graphql' },
  { label: 'Microservices', value: 'microservices' },
  { label: 'Agile / Scrum', value: 'agile' },
  { label: 'Problem Solving', value: 'problem-solving' },
  { label: 'Communication', value: 'communication' },
];

export const workModes = [
  { label: 'Remote', value: WorkMode.REMOTE },
  { label: 'Hybrid', value: WorkMode.HYBRID },
  { label: 'Onsite', value: WorkMode.ON_SITE },
];

export const currencyOptions = [
  { label: 'Indian Rupee (₹)', value: 'INR' },
  { label: 'US Dollar ($)', value: 'USD' },
  { label: 'Euro (€)', value: 'EUR' },
  { label: 'British Pound (£)', value: 'GBP' },
  { label: 'Australian Dollar (A$)', value: 'AUD' },
  { label: 'Canadian Dollar (C$)', value: 'CAD' },
  { label: 'Singapore Dollar (S$)', value: 'SGD' },
  { label: 'UAE Dirham (د.إ)', value: 'AED' },
];

export const currentEmploymentStatuses = [
  { label: 'Employed', value: CurrentEmployment.EMPLOYED },
  { label: 'Unemployed', value: CurrentEmployment.UNEMPLOYED },
  { label: 'Self-employed', value: CurrentEmployment.SELF_EMPLOYED },
  { label: 'Freelancer', value: CurrentEmployment.FREELANCER },
  { label: 'Retired', value: CurrentEmployment.RETIRED },
  { label: 'Student', value: CurrentEmployment.STUDENT },
];

export const yearsOfExperiences: { label: string; value: ExperienceLevel }[] = [
  { label: '0 - 1 years (Entry Level)', value: ExperienceLevel.ENTRY },
  { label: '1 - 3 years (Mid Level)', value: ExperienceLevel.MID },
  { label: '3 - 5 years (Senior Level)', value: ExperienceLevel.SENIOR },
  { label: '5+ years (Lead Level)', value: ExperienceLevel.LEAD },
];

export const degrees: SelectOption[] = [
  { label: 'High School', value: 'HIGH_SCHOOL' },
  { label: 'Diploma', value: 'DIPLOMA' },
  { label: 'Associate Degree', value: 'ASSOCIATE' },
  { label: "Bachelor's Degree", value: 'BACHELOR' },
  { label: "Master's Degree", value: 'MASTER' },
  { label: 'MBA', value: 'MBA' },
  { label: 'MCA', value: 'MCA' },
  { label: 'B.Tech / BE', value: 'BTECH_BE' },
  { label: 'M.Tech / ME', value: 'MTECH_ME' },
  { label: 'PhD / Doctorate', value: 'PHD' },
  { label: 'Professional Certification', value: 'CERTIFICATION' },
  { label: 'Other', value: 'OTHER' },
];

export const fieldOfStudies: SelectOption[] = [
  { label: 'Computer Science', value: 'COMPUTER_SCIENCE' },
  { label: 'Information Technology', value: 'INFORMATION_TECHNOLOGY' },
  { label: 'Software Engineering', value: 'SOFTWARE_ENGINEERING' },
  { label: 'Electronics & Communication', value: 'ECE' },
  { label: 'Electrical Engineering', value: 'ELECTRICAL' },
  { label: 'Mechanical Engineering', value: 'MECHANICAL' },
  { label: 'Civil Engineering', value: 'CIVIL' },
  { label: 'Data Science', value: 'DATA_SCIENCE' },
  { label: 'Artificial Intelligence', value: 'AI' },
  { label: 'Cybersecurity', value: 'CYBER_SECURITY' },
  { label: 'Business Administration', value: 'BUSINESS_ADMIN' },
  { label: 'Finance', value: 'FINANCE' },
  { label: 'Marketing', value: 'MARKETING' },
  { label: 'Human Resources', value: 'HR' },
  { label: 'Economics', value: 'ECONOMICS' },
  { label: 'Mathematics', value: 'MATHEMATICS' },
  { label: 'Physics', value: 'PHYSICS' },
  { label: 'Chemistry', value: 'CHEMISTRY' },
  { label: 'Biotechnology', value: 'BIOTECHNOLOGY' },
  { label: 'Design', value: 'DESIGN' },
  { label: 'Architecture', value: 'ARCHITECTURE' },
  { label: 'Law', value: 'LAW' },
  { label: 'Medicine', value: 'MEDICINE' },
  { label: 'Psychology', value: 'PSYCHOLOGY' },
  { label: 'Other', value: 'OTHER' },
];

export const noticePeriods: SelectOption[] = [
  { label: 'Immediate', value: 'IMMEDIATE' },
  { label: '15 days', value: '15_DAYS' },
  { label: '1 month', value: '1_MONTH' },
  { label: '2 months', value: '2_MONTHS' },
  { label: '3 months', value: '3_MONTHS' },
];
