import { ExperienceLevel } from '@prisma/client';
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
  { label: 'Remote', value: 'REMOTE' },
  { label: 'Hybrid', value: 'HYBRID' },
  { label: 'Onsite', value: 'ON_SITE' },
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
