import { Company } from '@prisma/client';

export const mockCompanies: Company[] = [
  {
    id: '65f1a1a1a1a1a1a1a1a1a1a1',
    userId: '64u1',
    name: 'Acme Technologies',
    logo: null,
    description: 'Enterprise SaaS platform',
    industry: 'Software',
    companySize: '51-200',
    foundedYear: 2018,
    website: 'https://acme.com',
    linkedinProfile: null,
    country: 'Bangalore, India',
    countryPhoneCode: '+91',
    contactEmail: 'hr@acme.com',
    contactPhone: null,
    address: null,
    businessDocument: null,
    taxDocument: null,
    status: 'PENDING',
    rejectionReason: null,
    approvedAt: null,
    approvedBy: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    logoPath: null,
    businessDocPath: null,
    taxDocPath: null,
  },
  {
    id: '65f1b2b2b2b2b2b2b2b2b2b2',
    userId: '64u2',
    name: 'FinStack',
    logo: null,
    description: 'Fintech infrastructure',
    industry: 'FinTech',
    companySize: '11-50',
    foundedYear: 2020,
    website: 'https://finstack.io',
    linkedinProfile: null,
    country: 'Mumbai, India',
    countryPhoneCode: '+91',
    contactEmail: 'careers@finstack.io',
    contactPhone: null,
    address: null,
    businessDocument: null,
    taxDocument: null,
    status: 'APPROVED',
    rejectionReason: null,
    approvedAt: new Date(),
    approvedBy: 'admin_1',
    createdAt: new Date(),
    updatedAt: new Date(),
    logoPath: null,
    businessDocPath: null,
    taxDocPath: null,
  },
  {
    id: '65f1c3c3c3c3c3c3c3c3c3c3',
    userId: '64u3',
    name: 'Healthify',
    logo: null,
    description: 'Healthcare platform',
    industry: 'Healthcare',
    companySize: '201-500',
    foundedYear: 2015,
    website: null,
    linkedinProfile: null,
    country: 'London, UK',
    countryPhoneCode: '+44',
    contactEmail: 'jobs@healthify.com',
    contactPhone: null,
    address: null,
    businessDocument: null,
    taxDocument: null,
    status: 'REJECTED',
    rejectionReason:
      'Invalid documents, Lorem ipsum, dolor sit amet consectetur adipisicing elit. Inventore sunt error ab autem ratione facere, vero debitis deleniti ad odit amet esse ex omnis delectus, id nemo quam! Maxime natus accusamus ducimus expedita cumque nihil eum vero, dolore quae qui culpa nulla harum deleniti eius recusandae sed quasi unde perspiciatis, temporibus tempore officiis repudiandae laborum. Quisquam praesentium iure, exercitationem molestias modi consequuntur quasi? Rerum sequi fuga, suscipit impedit corporis, ullam itaque porro ex magnam, culpa esse corrupti ipsam nesciunt repellat eum. Nemo quis in consequuntur corporis praesentium vitae, doloribus laudantium voluptas eaque perspiciatis amet, sequi quo itaque, repudiandae cumque fugiat.',
    approvedAt: null,
    approvedBy: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    logoPath: null,
    businessDocPath: null,
    taxDocPath: null,
  },
] as const;

export const featuredJobs = [
  {
    id: 1,
    title: 'Frontend Engineer',
    company: 'TechNova',
    location: 'Remote',
    type: 'Full-time',
    tag: 'High Growth',
  },
  {
    id: 2,
    title: 'Backend Developer',
    company: 'CloudCore',
    location: 'Bangalore',
    type: 'Full-time',
    tag: 'Urgent',
  },
  {
    id: 3,
    title: 'UI/UX Designer',
    company: 'Designify',
    location: 'Mumbai',
    type: 'Hybrid',
    tag: 'New',
  },
  {
    id: 4,
    title: 'Product Lead',
    company: 'Aura',
    location: 'Remote',
    type: 'Full-time',
    tag: 'Remote',
  },
];

export const companies = [
  { id: 1, name: 'TechNova' },
  { id: 2, name: 'CloudCore' },
  { id: 3, name: 'Designify' },
  { id: 4, name: 'Aura' },
  { id: 5, name: 'ByteLabs' },
  { id: 6, name: 'NextZen' },
];

export const defaultValues = {
  // STEP 1 – Basic Info
  userId: 'mock-user-id-123',
  phone: '9876543210',
  country: 'India',
  countryPhoneCode: '+91',
  city: 'Pune',
  contactEmail: 'manish@example.com',
  name: 'Manish Guhe',

  // STEP 2 – Professional Info
  preferredWorkMode: ['REMOTE', 'HYBRID'],
  willingToRelocate: true,
  professionalTitle: 'Frontend Developer',
  bio: 'Passionate frontend developer specializing in Next.js, TypeScript, and modern UI systems.',
  yearsOfExperience: 'MID',
  currentEmployment: 'EMPLOYED',

  // STEP 3 – Experience
  workExperience: [
    {
      company: 'TechNova Solutions',
      title: 'Frontend Developer',
      location: 'Mumbai',
      workMode: 'HYBRID',
      startDate: new Date('2022-01-01'),
      endDate: null,
      description:
        'Worked on scalable SaaS dashboard using Next.js and Tailwind.',
      isCurrent: true,
    },
    {
      company: 'WebCraft Pvt Ltd',
      title: 'Junior Developer',
      location: 'Pune',
      workMode: 'ON_SITE',
      startDate: new Date('2020-06-01'),
      endDate: new Date('2021-12-31'),
      description:
        'Built responsive UI components and improved performance by 25%.',
      isCurrent: false,
    },
  ],

  // STEP 4 – Education
  education: [
    {
      institution: 'Savitribai Phule Pune University',
      degree: 'BTECH_BE',
      fieldOfStudy: 'COMPUTER_SCIENCE',
      startYear: 2016,
      endYear: 2020,
      grade: '8.5 CGPA',
      isCurrent: false,
    },
  ],

  // STEP 5 – Skills
  skills: ['Next.js', 'TypeScript', 'React', 'Tailwind CSS', 'Prisma'],

  // STEP 7 – Certifications
  certifications: [
    {
      name: 'React Developer Certification',
      organization: 'Meta',
      issueDate: new Date('2023-03-01'),
      expiryDate: null,
      credentialUrl: 'https://example.com/certificate',
      credentialId: 'META-REACT-12345',
    },
  ],

  // STEP 8 – Additional Info
  portfolioWebsite: 'https://manishdev.com',
  githubUrl: 'https://github.com/manish',
  linkedinUrl: 'https://www.linkedin.com/in/manish-guhe-4860711b3/',
  twitterUrl: 'https://x.com/manishdev',
  otherLinks: ['https://medium.com/@manish', 'https://dev.to/manish'],

  jobCategories: [
    'SOFTWARE_DEVELOPMENT',
    'BACKEND_DEVELOPMENT',
    'FRONTEND_DEVELOPMENT',
  ],
  preferredLocations: ['India', 'United States'],
  expectedSalaryMin: 12,
  expectedSalaryMax: 18,
  noticePeriod: '15_DAYS',
};
