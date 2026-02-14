import { CurrentEmployment, ExperienceLevel, WorkMode } from '@prisma/client';
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
