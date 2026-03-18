'use client'
import { JobStatus } from '@prisma/client';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react'
import { SubmitHandler, useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';
import FormHeader from '../../../ui/FormHeader';
import Step1BasicJobDetails from './Step1BasicJobDetails';
import Step2JobRequirements from './Step2JobRequirements';
import Step3JobLocation from './Step3JobLocation';
import Step4JobSalary from './Step4JobSalary';
import Step5JobReview from './Step5JobReview';
import { Button } from '@/src/components/ui/Button';
import { hasAnyDraftData, isRichTextEmpty, JOB_STATUS_UI } from '@/src/utils/helper';
import { Spinner } from '@/src/components/elements/Loader';
import { AppSdk } from '@/src/utils/AppSdk';
import clsx from 'clsx';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import PageLoader from '@/src/components/ui/PageLoader';
import MobileTabs from '@/src/components/layout/MobileTabs';
import StepSidebar from '@/src/components/layout/StepSidebar';
import { signOut } from 'next-auth/react';
import BackButton from '@/src/components/shared/BackButton';
import { JobFormInputs } from '@/src/types';
import { jobFormSteps, STEP_FIELDS } from '@/src/utils/constants';

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
  const [jobStatus, setJobStatus] = useState<JobStatus | null>(null)
  const queryClient = useQueryClient()

  const { data, isLoading: jobLoading } = useQuery({
    queryKey: ['company-job', slug],
    queryFn: async () => {
      const res = await AppSdk.getData(`/api/company/jobs/${slug}`, null)

      if (!res?.job) {
        throw new Error('Job not found')
      }

      return res.job
    },
    enabled: !!slug,
    staleTime: 0,
    refetchOnMount: 'always'
  })

  useEffect(() => {
    if (!data) return

    const job = data

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

  }, [data, reset])

  if (jobLoading) {
    return (
      <PageLoader title='Loading job details' subtitle='Preparing the job editor' />
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
  }

  const handlePrev = () => setCurrentStep((prev) => prev - 1)

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

          if (response.status === 401 || response.status === 403) {
            signOut({ callbackUrl: '/login' })
            return
          }

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
          queryClient.invalidateQueries({ queryKey: ['company-dashboard'] })
          queryClient.invalidateQueries({ queryKey: ['company-jobs'] })
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

  const stepComponents = [
    <Step1BasicJobDetails
      register={register}
      errors={errors}
      watch={watch}
      setValue={setValue}
      disabled={isAnyActionInProgress}
      key={1}
    />,
    <Step2JobRequirements
      register={register}
      errors={errors}
      watch={watch}
      setValue={setValue}
      isEditMode={isEditMode}
      disabled={isAnyActionInProgress}
      key={2}
    />,
    <Step3JobLocation
      register={register}
      errors={errors}
      watch={watch}
      isEditMode={isEditMode}
      disabled={isAnyActionInProgress}
      key={3}
    />,
    <Step4JobSalary
      register={register}
      errors={errors}
      watch={watch}
      disabled={isAnyActionInProgress}
      isEditMode={isEditMode}
      setValue={setValue}
      key={4}
    />,
    <Step5JobReview
      setCurrentStep={setCurrentStep}
      watch={watch}
      disabled={isAnyActionInProgress}
      key={5}
    />
  ]

  const isLastStep = currentStep === stepComponents.length - 1;
  const isFirstStep = currentStep === 0;
  const canShowDraft =
    (!isEditMode || jobStatus === 'DRAFT') && !isLastStep;

  const renderStatusBanner = () => {
    if (!jobStatus) return null;
    return (
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
    )
  }

  const renderDraftButton = () => {
    if (!canShowDraft) return null
    return (
      <Button
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
      </Button>
    )
  }

  const renderPrimaryActions = () => {
    const submitBtn = (
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
        ) : isEditMode ? (
          jobStatus === 'CLOSED'
            ? 'Reopen Job'
            : jobStatus === 'ACTIVE' ? 'Save Changes' :
              'Publish Job'
        ) : (
          'Publish Job'
        )}
      </Button>
    );

    if (!isLastStep) {
      return (
        <>
          <Button
            disabled={isAnyActionInProgress}
            onClick={handleNext}
            className="max-md:w-1/2 max-sm:w-full"
          >
            Next
          </Button>

          {isEditMode && jobStatus !== 'DRAFT' && submitBtn}
        </>
      );
    }

    if (isEditMode && jobStatus === 'DRAFT') {
      return (
        <>
          <Button
            disabled={isAnyActionInProgress}
            onClick={handleDraftSave}
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

          {submitBtn}
        </>
      );
    }

    return submitBtn;
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
      <BackButton disabled={isAnyActionInProgress} />
      {renderStatusBanner()}

      {isEditMode && (
        <MobileTabs
          steps={jobFormSteps}
          currentStep={currentStep}
          onStepClick={setCurrentStep}
          isEditMode={isEditMode}
        />
      )}

      <div className="flex gap-6 items-start w-full">
        {isEditMode && (
          <div className="hidden lg:block sticky top-24">
            <StepSidebar
              steps={jobFormSteps}
              currentStep={currentStep}
              onStepClick={setCurrentStep}
              isEditMode={isEditMode}
            />
          </div>
        )}

        <div className=" w-full rounded-2xl border border-border/40 bg-card shadow-sm max-sm:rounded-none max-sm:border-0 max-sm:shadow-none">
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
            {stepComponents[currentStep]}
          </form>

          <div className={clsx(
            "flex items-center justify-between gap-3 border-t border-border/40 px-6 py-4 max-md:flex-col max-md:gap-2 max-sm:p-0",
            (!isEditMode || jobStatus === 'DRAFT') && currentStep !== 4 ? '' : 'justify-end!'
          )}>
            {renderDraftButton()}
            <div className={clsx("flex gap-3 items-center max-md:flex-col max-md:w-full",)}>
              {!isFirstStep && (
                <Button
                  onClick={handlePrev}
                  variant="outline"
                  disabled={isAnyActionInProgress}
                  className="max-md:w-1/2 max-sm:w-full"
                >
                  Previous
                </Button>
              )}
              {renderPrimaryActions()}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateJobForm