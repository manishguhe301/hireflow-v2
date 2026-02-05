'use client'
import { EmploymentType, ExperienceLevel, WorkMode } from '@prisma/client';
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { useForm, useWatch } from 'react-hook-form';

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
  city: string;
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

  return (
    <div>CreateJobForm</div>
  )
}

export default CreateJobForm