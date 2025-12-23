import { ApplicationStatus, CompanyStatus, EmploymentType, ExperienceLevel, JobStatus, Role, WorkMode } from "@prisma/client";


export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkExperience {
  company: string;
  title: string;
  startDate: string;
  endDate?: string;
  description: string;
  current: boolean;
}

export interface Education {
  institution: string;
  degree: string;
  field: string;
  startYear: number;
  endYear?: number;
  grade?: string;
  current: boolean;
}

export interface Certification {
  name: string;
  organization: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
  credentialUrl?: string;
}

export interface Profile {
  id: string;
  userId: string;
  photo?: string;
  phone?: string;
  location?: string;
  preferredWorkMode: string[];
  willingToRelocate: boolean;
  professionalTitle?: string;
  bio?: string;
  yearsOfExperience?: number;
  currentEmployment?: string;
  resumeUrl?: string;
  resumeName?: string;
  skills: string[];
  workExperience?: WorkExperience[];
  education?: Education[];
  certifications?: Certification[];
  portfolioWebsite?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
  otherLinks: string[];
  jobCategories: string[];
  preferredLocations: string[];
  expectedSalaryMin?: number;
  expectedSalaryMax?: number;
  noticePeriod?: string;
  profileCompleted: number;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Company {
  id: string;
  userId: string;
  name: string;
  logo?: string;
  description: string;
  industry: string;
  companySize: string;
  foundedYear?: number;
  website?: string;
  linkedinProfile?: string;
  location: string;
  contactEmail: string;
  contactPhone?: string;
  address?: string;
  businessDocument?: string;
  taxDocument?: string;
  status: CompanyStatus;
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Job {
  id: string;
  companyId: string;
  title: string;
  description: string;
  requirements: string;
  responsibilities?: string;
  skills: string[];
  experienceLevel: ExperienceLevel;
  employmentType: EmploymentType;
  workMode: WorkMode;
  location: string;
  salaryMin?: number;
  salaryMax?: number;
  hideSalary: boolean;
  numberOfOpenings: number;
  applicationDeadline?: Date;
  category: string;
  status: JobStatus;
  views: number;
  createdAt: Date;
  updatedAt: Date;
  company?: Company;
}

export interface StatusHistoryItem {
  status: ApplicationStatus;
  date: string;
}

export interface Application {
  id: string;
  userId: string;
  jobId: string;
  resumeUrl: string;
  coverLetter?: string;
  status: ApplicationStatus;
  internalNotes?: string;
  statusHistory?: StatusHistoryItem[];
  createdAt: Date;
  updatedAt: Date;
  user?: User;
  job?: Job;
}

//eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface SignupFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: Role;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface CompanyFormData {
  name: string;
  description: string;
  industry: string;
  companySize: string;
  foundedYear?: number;
  website?: string;
  linkedinProfile?: string;
  location: string;
  contactEmail: string;
  contactPhone?: string;
  address?: string;
}

export interface JobFormData {
  title: string;
  description: string;
  requirements: string;
  responsibilities?: string;
  skills: string[];
  experienceLevel: ExperienceLevel;
  employmentType: EmploymentType;
  workMode: WorkMode;
  location: string;
  salaryMin?: number;
  salaryMax?: number;
  hideSalary: boolean;
  numberOfOpenings: number;
  applicationDeadline?: Date;
  category: string;
}

export interface JobFilters {
  search?: string;
  category?: string[];
  location?: string[];
  workMode?: WorkMode[];
  employmentType?: EmploymentType[];
  experienceLevel?: ExperienceLevel[];
  salaryMin?: number;
  salaryMax?: number;
  companyId?: string;
  datePosted?: 'today' | 'week' | 'month' | 'any';
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
}
