'use client'
import { AppSdk } from '@/src/utils/AppSdk'
import { EmploymentType, ExperienceLevel, WorkMode } from '@prisma/client'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Spinner } from '../elements/Loader'
import { Briefcase } from 'lucide-react'

type SimilarJob = {
  company: {
    id: string;
    name: string;
    logo: string | null;
  };
  id: string;
  slug: string;
  title: string;
  experienceLevel: ExperienceLevel;
  employmentType: EmploymentType;
  workMode: WorkMode;
  country: string;
  city: string | null;
  salaryMin: number | null;
  salaryMax: number | null;
  numberOfOpenings: number;
  applicationDeadline: Date | null;
  category: string;
  createdAt: Date;
}

interface JobDetails {
  job: {
    id: string,
    title: string,
    description: string,
    requirements: string,
    responsibilities: string,
    skills: string[],
    experienceLevel: ExperienceLevel,
    employmentType: EmploymentType,
    workMode: WorkMode,
    country: string,
    city?: string,
    salaryMin?: string,
    salaryMax?: string,
    hideSalary: string,
    numberOfOpenings: string,
    applicationDeadline?: string,
    category: string,
    slug: string,
    views: string,
    createdAt: string,
    updatedAt: string,
    company: {
      id: string,
      name: string,
      logo: string,
      description: string,
      industry: string,
      companySize: string,
      foundedYear?: number,
      website?: string,
      linkedinProfile?: true,
      country: string,
      city: string,
      activeJobsCount: 5
    }
  },
  similarJobs: SimilarJob[]
}

const JobDetailsForApplicant = () => {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string
  const [loading, setLoading] = useState(true)
  const [job, setJob] = useState<JobDetails | null>(null)

  const fetchJobDetails = async () => {
    try {
      const res = await AppSdk.getData(
        `/api/jobs/${slug}`,
        null,
      )
      if (res.job) setJob(res.job)
    } catch (error) {
      console.error(error)
      toast.error('Failed to fetch job details')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!slug) return
    console.log(slug);

    fetchJobDetails()
  }, [slug])


  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 h-screen text-sm">
        <Spinner className="h-6 w-6" />
      </div>
    )
  }

  if (!job) {
    return (
      <div className="flex flex-col items-center justify-center h-screen py-24 text-center w-full">
        <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
          <Briefcase className="h-10 w-10 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold mb-1">Job Not Found</h3>
        <p className="text-sm text-muted-foreground mb-6 max-w-sm">
          The job you are looking for does not exist, or has been removed.
        </p>
      </div>
    )
  }

  return (
    <div>JobDetailsForApplicant</div>
  )
}

export default JobDetailsForApplicant