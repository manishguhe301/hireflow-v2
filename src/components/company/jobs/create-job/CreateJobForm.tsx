'use client'
import { EmploymentType, ExperienceLevel, WorkMode } from '@prisma/client';
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { SubmitHandler, useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';
import FormHeader from '../../../ui/FormHeader';
import Step1BasicJobDetails from './Step1BasicJobDetails';
import Step2JobRequirements from './Step2JobRequirements';
import Step3JobLocation from './Step3JobLocation';
import Step4JobSalary from './Step4JobSalary';
import Step5JobReview from './Step5JobReview';
import { Button } from '@/src/components/ui/Button';
import { isRichTextEmpty } from '@/src/utils/helper';

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

const jobFormSteps = [
  { number: 1, label: 'Basic Details' },
  { number: 2, label: 'Requirements' },
  { number: 3, label: 'Location & Work Mode' },
  { number: 4, label: 'Salary & Openings' },
  { number: 5, label: 'Review & Publish' },
]

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

  register('description', {
    validate: (value) =>
      !isRichTextEmpty(value) || 'Job description is required',
  })

  const handleNext = async () => {
    const fields = STEP_FIELDS[currentStep]

    if (!fields) {
      setCurrentStep((prev) => prev + 1)
      return
    }

    const isValid = await trigger(fields)

    if (!isValid) return;

    // if (currentStep === 0) {
    //   const description = watch('description');

    //   if (isRichTextEmpty(description)) {
    //     setValue('description', description, {
    //       shouldValidate: true,
    //     });
    //     toast.error('Job description is required');
    //     return;
    //   }
    // }


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
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
      <div className="rounded-2xl border border-border/40 bg-card shadow-sm max-sm:rounded-none max-sm:border-0 max-sm:shadow-none">
        <div className="border-b border-border/40 px-6 py-4 max-sm:p-0">
          <FormHeader
            currentStep={currentStep}
            handleNext={handleNext}
            handlePrev={handlePrev}
            disabled={isSubmitting}
            steps={jobFormSteps}
          />

          <form className="px-6 py-6 max-sm:px-0 max-sm:py-4">
            {currentStep === 0 &&
              <Step1BasicJobDetails
                register={register}
                errors={errors}
                watch={watch}
                setValue={setValue}
              />
            }
            {currentStep === 1 &&
              <Step2JobRequirements register={register} errors={errors} />
            }
            {currentStep === 2 &&
              <Step3JobLocation register={register} errors={errors} />
            }
            {
              currentStep === 3 &&
              <Step4JobSalary
                register={register}
                errors={errors}
              />
            }
            {currentStep === 4 &&
              <Step5JobReview
                setCurrentStep={setCurrentStep}
              />
            }
          </form>

          <div className="flex items-center justify-end gap-3 border-t border-border/40 px-6 py-4 max-md:justify-center max-md:w-full max-sm:p-0">
            {currentStep > 0 && (
              <Button
                onClick={handlePrev}
                variant="outline"
                disabled={isSubmitting}
                className="max-md:w-1/2"
              >
                Previous
              </Button>
            )}
            {currentStep < 4 ? (
              <Button
                disabled={isSubmitting}
                onClick={handleNext}
                className="max-md:w-1/2"
              >
                Next
              </Button>
            ) : (
              <Button
                disabled={isSubmitting}
                onClick={handleSubmit(handleFormSubmit)}
                variant="primary"
                className="max-md:w-1/2"
              >
                {isSubmitting ?
                  'Submitting...' : 'Submit'
                }
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateJobForm