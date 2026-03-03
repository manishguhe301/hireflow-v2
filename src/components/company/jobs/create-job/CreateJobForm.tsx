'use client'
import { EmploymentType, ExperienceLevel, Job, JobStatus, WorkMode } from '@prisma/client';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
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
import { Spinner } from '@/src/components/elements/Loader';
import { AppSdk } from '@/src/utils/AppSdk';
import clsx from 'clsx';

export type JobFormInputs = {
  jobId?: string;
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
  // currency?: string;
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

const JOB_STATUS_UI: Record<JobStatus, {
  className: string
  title: string
  message: (step: number) => string
}> = {
  DRAFT: {
    className: 'bg-warning/10 border-warning/30 text-warning',
    title: 'Draft Job',
    message: (step) =>
      step >= 4
        ? 'All required details look complete. You can publish this job now.'
        : 'This job is saved as a draft. Complete all steps to publish it.',
  },
  ACTIVE: {
    className: 'bg-success/10 border-success/30 text-success',
    title: 'Active Job',
    message: () =>
      'This job is live and visible to candidates. Any changes will update it immediately.',
  },
  CLOSED: {
    className: 'bg-destructive/10 border-destructive/30 text-destructive',
    title: 'Closed Job',
    message: () =>
      'This job is closed and no longer accepting applications. You can reopen it anytime.',
  },
}


const CreateJobForm = () => {
  const [currentStep, setCurrentStep] = useState(0)
  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
    trigger,
    reset,
    setValue,
    control,
    getValues
  } = useForm<JobFormInputs>({
    defaultValues: {
      //step 1
      jobId: undefined,
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
      city: undefined,

      // Step 4 
      // salaryMin: 0, //optional
      // salaryMax: 0, //optional
      hideSalary: false,
      // currency: '',
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
  const [isSavingDraft, setIsSavingDraft] = useState(false)
  const params = useParams();
  const slug = params.slug as string | undefined
  const isEditMode = !!slug
  const [jobLoading, setJobLoading] = useState(false)
  const [job, setJob] = useState<Job | null>(null)
  const [jobStatus, setJobStatus] = useState<JobStatus | null>(null)

  const fetchJobDetails = async () => {
    setJobLoading(true)
    try {
      const res = await AppSdk.getData(`/api/company/jobs/${slug}`, null)
      const job = res.job
      if (job) {
        setJob(job)
        reset({
          jobId: job.id,
          title: job.title,
          description: job.description,
          requirements: job.requirements,
          responsibilities: job.responsibilities ?? '',
          skills: job.skills,
          experienceLevel: job.experienceLevel,
          employmentType: job.employmentType,
          workMode: job.workMode,
          country: job.country,
          city: job.city,
          salaryMin: job.salaryMin,
          salaryMax: job.salaryMax,
          hideSalary: job.hideSalary,
          numberOfOpenings: job.numberOfOpenings,
          applicationDeadline: job.applicationDeadline
            ? new Date(job.applicationDeadline)
            : undefined,
          category: job.category,
        })
        setJobStatus(job.status)
      }
    } catch (error) {
      console.log(error);
      toast.error('Failed to fetch job details, please try again.')
    } finally {
      setJobLoading(false)
    }
  }

  useEffect(() => {
    if (!slug) return;
    fetchJobDetails()
  }, [slug])

  if (jobLoading) {
    return (
      <div className="flex items-center text-sm justify-center gap-2 h-[90%]">
        Loading job details... <Spinner className='w-6 h-6' />
      </div>
    )
  }

  //validations for fields in which we cannot inline validate
  register('description', {
    validate: (value) =>
      !isRichTextEmpty(value) || 'Job description is required',
  })

  register('requirements', {
    validate: (value) =>
      !isRichTextEmpty(value) || 'requirements is required',
  })

  register('skills', {
    validate: (value) =>
      value.length > 0 || 'At least one skill is required',
  })

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
    console.log(getValues());
  }

  const handlePrev = () => setCurrentStep((prev) => prev - 1)

  const hasAnyDraftData = (data: JobFormInputs) => {
    return (
      !!data.title ||
      !isRichTextEmpty(data.description) ||
      !!data.category ||
      !isRichTextEmpty(data.requirements) ||
      (data.responsibilities && !isRichTextEmpty(data.responsibilities)) ||
      data.skills.length > 0 ||
      !!data.country ||
      !!data.city ||
      typeof data.salaryMin === 'number' ||
      typeof data.salaryMax === 'number'
    )
  }

  const handleFormSubmit =
    (isDraft: boolean): SubmitHandler<JobFormInputs> =>
      async (data) => {
        if (isDraft && !hasAnyDraftData(data)) {
          toast.error('Add at least one field before saving as draft')
          return
        }

        if (isDraft) {
          setIsSavingDraft(true)
        } else {
          setIsSubmitting(true)
        }

        console.log(data);
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
          formData.append('status', isDraft ? 'DRAFT' : 'ACTIVE')

          if (isEditMode && data.jobId) {
            formData.append('jobId', data.jobId)
          }

          const method = isEditMode ? 'PATCH' : 'POST'

          const response = await fetch('/api/company/jobs', {
            method,
            body: formData,
          })

          const result = await response.json()

          if (!response.ok) {
            toast.error(result.error || 'Failed to create job')
            return
          }
          const successMessage = isEditMode
            ? isDraft
              ? 'Draft updated successfully'
              : 'Job updated successfully'
            : isDraft
              ? 'Draft saved successfully'
              : 'Job created successfully'

          toast.success(successMessage)
          reset()
          setTimeout(() => router.push('/company/jobs'), 100)
        } catch (error) {
          console.error('Submit error:', error)
          toast.error('Something went wrong. Please try again.')
        } finally {
          if (isDraft) {
            setIsSavingDraft(false)
          } else {
            setIsSubmitting(false)
          }
        }
      }

  const handleDraftSave = async () => {
    const data = getValues()

    if (!hasAnyDraftData(data)) {
      toast.error('Add at least one field before saving as draft')
      return
    }

    if (currentStep === 4) {
      const confirmed = window.confirm(
        'You are on the review page. Do you want to save as draft instead of publishing?'
      )
      if (!confirmed) return
    }

    await handleFormSubmit(true)(data)
  }

  const isAnyActionInProgress = isSubmitting || isSavingDraft

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
      {jobStatus && (
        <div
          className={clsx(
            'mb-6 rounded-2xl border p-4',
            JOB_STATUS_UI[jobStatus].className
          )}
        >
          <p className="text-sm font-semibold">
            {JOB_STATUS_UI[jobStatus].title}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {JOB_STATUS_UI[jobStatus].message(currentStep)}
          </p>
        </div>
      )}

      <div className="rounded-2xl border border-border/40 bg-card shadow-sm max-sm:rounded-none max-sm:border-0 max-sm:shadow-none">
        <div className="border-b border-border/40 px-6 py-4 max-sm:p-0">
          <FormHeader
            currentStep={currentStep}
            handleNext={handleNext}
            handlePrev={handlePrev}
            disabled={isAnyActionInProgress}
            steps={jobFormSteps}
          />
        </div>
        <form className="px-6 py-6 max-sm:px-0 max-sm:py-4">
          {currentStep === 0 &&
            <Step1BasicJobDetails
              register={register}
              errors={errors}
              watch={watch}
              setValue={setValue}
              disabled={isAnyActionInProgress}
            />
          }
          {currentStep === 1 &&
            <Step2JobRequirements
              register={register}
              errors={errors}
              watch={watch}
              setValue={setValue}
              isEditMode={isEditMode}
              disabled={isAnyActionInProgress}
            />
          }
          {currentStep === 2 &&
            <Step3JobLocation
              register={register}
              errors={errors}
              watch={watch}
              isEditMode={isEditMode}
              disabled={isAnyActionInProgress}
            />
          }
          {
            currentStep === 3 &&
            <Step4JobSalary
              register={register}
              errors={errors}
              watch={watch}
              disabled={isAnyActionInProgress}
              isEditMode={isEditMode}
              setValue={setValue}
            />
          }
          {currentStep === 4 &&
            <Step5JobReview
              setCurrentStep={setCurrentStep}
              watch={watch}
              disabled={isAnyActionInProgress}
            />
          }
        </form>

        <div className={clsx(
          "flex items-center justify-between gap-3 border-t border-border/40 px-6 py-4 max-md:flex-col max-md:gap-2 max-sm:p-0",
          (!isEditMode || jobStatus === 'DRAFT') && currentStep !== 4 ? '' : 'justify-end!'
        )}>
          {(!isEditMode || jobStatus === 'DRAFT') && currentStep !== 4 ? <Button
            type="button"
            variant="ghost"
            onClick={handleDraftSave}
            disabled={isAnyActionInProgress}
            className="max-md:w-full"
          >
            {isSavingDraft ?
              <span className="flex items-center gap-2">
                <Spinner className="h-4 w-4" />
                Saving...
              </span>
              : 'Save as Draft'}
          </Button> : null
          }
          <div className={clsx("flex gap-3 items-center max-md:flex-col max-md:w-full",)}>
            {currentStep > 0 && (
              <Button
                onClick={handlePrev}
                variant="outline"
                disabled={isAnyActionInProgress}
                className="max-md:w-1/2 max-sm:w-full"
              >
                Previous
              </Button>
            )}
            {currentStep < 4 ? (
              <>
                <Button
                  disabled={isAnyActionInProgress}
                  onClick={handleNext}
                  className="max-md:w-1/2 max-sm:w-full"
                >
                  Next
                </Button>

                {isEditMode && jobStatus === 'ACTIVE' && (
                  <Button
                    disabled={isAnyActionInProgress}
                    onClick={handleSubmit(handleFormSubmit(false))}
                    variant="primary"
                    className="max-md:w-1/2 max-sm:w-full"
                  >
                    Save Changes
                  </Button>
                )}

                {isEditMode && jobStatus === 'CLOSED' && (
                  <Button
                    disabled={isAnyActionInProgress}
                    onClick={handleSubmit(handleFormSubmit(false))}
                    variant="primary"
                    className="max-md:w-1/2"
                  >
                    Reopen Job
                  </Button>
                )}
              </>
            ) : (
              <>
                {isEditMode && jobStatus === 'DRAFT' ? (
                  <>
                    <Button
                      disabled={isAnyActionInProgress}
                      onClick={handleSubmit(handleFormSubmit(true))}
                      variant="outline"
                      className="max-md:w-1/2"
                    >
                      {isSavingDraft ? (
                        <span className="flex items-center gap-2">
                          <Spinner className="h-4 w-4" />
                          Saving...
                        </span>
                      ) : (
                        'Update Draft'
                      )}
                    </Button>

                    <Button
                      disabled={isAnyActionInProgress}
                      onClick={handleSubmit(handleFormSubmit(false))}
                      variant="primary"
                      className="max-md:w-1/2"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center gap-2">
                          <Spinner className="h-4 w-4" />
                          Publishing...
                        </span>
                      ) : (
                        'Publish Job'
                      )}
                    </Button>
                  </>
                ) : (
                  <Button
                    disabled={isAnyActionInProgress}
                    onClick={handleSubmit(handleFormSubmit(false))}
                    variant="primary"
                    className="max-md:w-1/2 max-sm:w-full"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <Spinner className="h-4 w-4" />
                        {isEditMode ? 'Saving...' : 'Publishing...'}
                      </span>
                    ) : (
                      isEditMode
                        ? jobStatus === 'CLOSED'
                          ? 'Reopen Job'
                          : 'Save Changes'
                        : 'Publish Job'
                    )}
                  </Button>
                )}
              </>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateJobForm