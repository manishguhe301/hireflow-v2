'use client'
import { EmploymentType, ExperienceLevel, WorkMode } from '@prisma/client';
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { SubmitHandler, useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';

export type JobFormInputs = {
  title: string;
  description: string;
  requirements: string;
  responsibilities?: string;
  skills: string[];
  experienceLevel: ExperienceLevel;
  employmentType: EmploymentType;
  workMode: WorkMode;
  country: string;
  city?: string;
  salaryMin?: number;
  salaryMax?: number;
  hideSalary: boolean;
  numberOfOpenings: number;
  applicationDeadline?: Date;
  category: string;
}

const STEP_FIELDS: Record<number, (keyof JobFormInputs)[]> = {
  0: [
    'title',
    'description',
    'category',
  ],
  1: [
    'requirements',
    'skills',
    'experienceLevel',
    'employmentType',
  ],
  2: [
    'workMode',
    'country',
  ],
  3: [
    'hideSalary',
    'numberOfOpenings',
  ]
}

const CreateJobForm = () => {
  const [currentStep, setCurrentStep] = useState(0)
  const { data: session } = useSession()
  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
    trigger,
    reset,
    setValue,
    control
  } = useForm<JobFormInputs>({
    defaultValues: {
      //step 1
      title: '',
      description: '',
      responsibilities: '', //optional
      category: '',

      // Step 2 
      requirements: '',
      skills: [],
      experienceLevel: 'ENTRY',
      employmentType: 'FULL_TIME',

      //step 3
      workMode: 'REMOTE',
      country: '',
      city: '',

      // Step 4 
      salaryMin: 0, //optional
      salaryMax: 0, //optional
      hideSalary: false,
      numberOfOpenings: 1,
      applicationDeadline: new Date(), //optional
    }
  })
  const workMode = useWatch({
    control,
    name: 'workMode'
  })
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleNext = async () => {
    const fields = STEP_FIELDS[currentStep]

    if (!fields) {
      setCurrentStep((prev) => prev + 1)
      return
    }

    const isValid = await trigger(fields)

    if (!isValid) return;

    if (currentStep === 2 && workMode !== 'REMOTE') {
      const validCity = await trigger('city')
      if (!validCity) return
    }

    setCurrentStep((prev) => prev + 1)
  }

  const handlePrev = () => setCurrentStep((prev) => prev - 1)

  const handleFormSubmit: SubmitHandler<JobFormInputs> = async (data) => {
    setIsSubmitting(true)
    try {
      const formData = new FormData()

      formData.append('title', data.title)
      formData.append('description', data.description)
      formData.append('requirements', data.requirements)

      if (data.responsibilities) {
        formData.append('responsibilities', data.responsibilities)
      }

      formData.append('skills', JSON.stringify(data.skills))
      formData.append('experienceLevel', data.experienceLevel)
      formData.append('employmentType', data.employmentType)
      formData.append('workMode', data.workMode)
      formData.append('country', data.country)


      if (data.city) {
        formData.append('city', data.city)
      }

      if (typeof data.salaryMin === 'number') {
        formData.append('salaryMin', String(data.salaryMin))
      }

      if (typeof data.salaryMax === 'number') {
        formData.append('salaryMax', String(data.salaryMax))
      }

      formData.append('hideSalary', String(data.hideSalary))
      formData.append('numberOfOpenings', String(data.numberOfOpenings))

      if (data.applicationDeadline) {
        formData.append(
          'applicationDeadline',
          data.applicationDeadline.toISOString()
        )
      }
      formData.append('category', data.category)


      const method = 'POST'

      const response = await fetch('/api/company/job', {
        method,
        body: formData,
      })

      const result = await response.json()

      if (!response.ok) {
        toast.error(result.error || 'Failed to create job')
        return
      }
      toast.success('Job created successfully')
      reset()
      router.push('/company/jobs')
    } catch (error) {
      console.error('Submit error:', error)
      toast.error('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>CreateJobForm</div>
  )
}

export default CreateJobForm