'use client'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { JobWithCount } from '../company/jobs/dashboard/JobsTable'
import { Spinner } from '../elements/Loader'
import { toast } from 'sonner'
import { AppSdk } from '@/src/utils/AppSdk'

const JobDetails = () => {
  const params = useParams()
  const slug = params.slug as string | undefined
  const [loading, setLoading] = useState(true)
  const [job, setJob] = useState<JobWithCount | null>(null)

  const fetchJobDetails = async () => {
    try {
      const res = await AppSdk.getData(`/api/company/jobs/${slug}?company=true&counts=true&applications=true&savedJobs=true
`, null)
      if (res.job) { setJob(res.job) }
    } catch (error) {
      console.log(error);
      toast.error('Failed to fetch job details, please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!slug) return;
    fetchJobDetails()
  }, [slug])

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 h-[90%] text-sm">
        Loading job details... <Spinner className='h-6 w-6' />
      </div>
    )
  }

  return (
    <div>JobDetails</div>
  )
}

export default JobDetails