'use client'

import { StateWrapper } from '@/src/components/company/CompanyProfileGuard'
import { Spinner } from '@/src/components/elements/Loader'
import FormHeader from '@/src/components/ui/FormHeader'
import { useProfile } from '@/src/store/hooks/useProfile'
import { Certification, Education, WorkExperience, WorkMode } from '@prisma/client'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import Step1BasicFormInfo from './Step1BasicFormInfo'
import Step2Professional from './Step2Professional'
import Step3Experience from './Step3Experience'
import Step4Education from './Step4Education'
import Step5Skills from './Step5Skills'
import Step6Resume from './Step6Resume'
import Step7Certifications from './Step7Certifications'
import Step8AdditionalInfo from './Step8AdditionalInfo'
import Step9Review from './Step9Review'
import clsx from 'clsx'
import { Button } from '@/src/components/ui/Button'

export type JobSeekerFormInputs = {
  userId: string
  avatar: string
  phone: string
  country: string
  countryPhoneCode: string
  city: string
  contactEmail: string
  name: string

  preferredWorkMode: WorkMode
  willingToRelocate: boolean
  professionalTitle: string
  bio: string
  yearsOfExperience: number
  currentEmployment: string

  resume: FileList

  skills: string[]
  workExperience: WorkExperience[]
  education: Education[]
  certifications: Certification[]

  portfolioWebsite: string
  githubUrl: string
  linkedinUrl: string
  twitterUrl: string
  otherLinks: string[]

  jobCategories: string[]
  preferredLocations: string[]
  expectedSalaryMin: number
  expectedSalaryMax: number
  noticePeriod: string
}


const STEP_FIELDS: Record<number, (keyof JobSeekerFormInputs)[]> = {
  0: ['phone', 'country', 'countryPhoneCode', 'contactEmail', 'name'],
  1: ['preferredWorkMode', 'willingToRelocate'],
  2: ['workExperience'],
  3: ['education'],
  4: ['skills'],
  5: ['resume'],
  6: [],
  7: ['jobCategories', 'preferredLocations'],
}


const steps = [
  { number: 1, label: 'Basic Info' },
  { number: 2, label: 'Professional Info' },
  { number: 3, label: 'Experience' },
  { number: 4, label: 'Education' },
  { number: 5, label: 'Skills' },
  {
    number: 6,
    label: 'Resume',
  },
  {
    number: 7,
    label: 'Certifications',
  },
  {
    number: 8,
    label: 'Additional Info',
  },
  {
    number: 9,
    label: 'Review & Publish',
  }
]

const ProfileWizard = () => {
  const { jobSeekerProfile, isLoading, error } = useProfile()
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { data: session } = useSession()
  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
    trigger,
    reset,
    setValue
  } = useForm<JobSeekerFormInputs>({
    defaultValues: {
      // STEP 1 – Basic Info
      userId: session?.user.id || '',
      avatar: '', // Optional
      phone: '',
      country: '',
      city: '',
      countryPhoneCode: '',
      contactEmail: session?.user.email || '',
      name: '',

      // STEP 2 – Professional Info
      preferredWorkMode: WorkMode.REMOTE,
      willingToRelocate: false,
      professionalTitle: '', //optional
      bio: '', //optional;
      yearsOfExperience: undefined, //optional
      currentEmployment: '', //optional

      // STEP 3 – Experience
      workExperience: [],

      // STEP 4 – Education
      education: [],

      // STEP 5 – Skills
      skills: [],

      // STEP 6 – Resume
      // resume: undefined as unknown as FileList,

      //step 7
      certifications: [],

      // STEP 8 – Additional Info
      portfolioWebsite: '',//optional
      githubUrl: '',//optional
      linkedinUrl: '', //optional
      twitterUrl: '', //optional
      otherLinks: [], //optional
      jobCategories: [],
      preferredLocations: [],
      expectedSalaryMin: undefined, //optional
      expectedSalaryMax: undefined, //optional
      noticePeriod: '', //optional
    }

  })
  const router = useRouter()
  const dispatch = useDispatch()
  const isEditMode = jobSeekerProfile ? true : false
  console.log(isEditMode);
  const selectedCountry = watch('country')

  if (isLoading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <Spinner className="h-8 w-8" />
      </div>
    )
  }

  if (error) {
    return (
      <StateWrapper>
        <h3 className="text-lg font-semibold text-destructive">
          Something went wrong
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          {error}
        </p>
      </StateWrapper>
    )
  }

  const handleNext = async () => {
    const fields = STEP_FIELDS[currentStep]

    if (!fields || fields.length === 0) {
      setCurrentStep((prev) => prev + 1)
      return
    }

    const isValid = await trigger(fields)

    if (isValid) {
      setCurrentStep((prev) => prev + 1)
    }
  }

  const handlePrev = () => setCurrentStep((prev) => prev - 1)

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
      {jobSeekerProfile && (
        <div className="mb-6 rounded-2xl border border-primary/30 bg-primary/5 p-4">
          <p className="text-sm text-primary font-medium">
            Editing an profile
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Please review all steps before saving changes to ensure your profile
            remains accurate and up to date.
          </p>
        </div>
      )}
      <div className="rounded-2xl border border-border/40 bg-card shadow-sm max-sm:rounded-none max-sm:border-0 max-sm:shadow-none">
        <div className="border-b border-border/40 px-6 py-4 max-sm:p-0">
          <FormHeader
            currentStep={currentStep}
            handleNext={handleNext}
            handlePrev={handlePrev}
            disabled={isSubmitting}
            steps={steps}
          />
        </div>
        <form className="px-6 py-6 max-sm:px-0 max-sm:py-4">
          {currentStep === 0 &&
            <Step1BasicFormInfo
              register={register}
              errors={errors}
              watch={watch}
              setValue={setValue}
              selectedCountry={selectedCountry}
            />
          }
          {currentStep === 1 &&
            <Step2Professional
              register={register}
              errors={errors}
              watch={watch}
              setValue={setValue}
            />
          }
          {currentStep === 2 &&
            <Step3Experience
              register={register}
              errors={errors}
              watch={watch}
              setValue={setValue}
            />
          }
          {currentStep === 3 &&
            <Step4Education
              register={register}
              errors={errors}
              watch={watch}
              setValue={setValue}
            />
          }
          {currentStep === 4 &&
            <Step5Skills
              register={register}
              errors={errors}
              watch={watch}
              setValue={setValue}
            />
          }
          {currentStep === 5 &&
            <Step6Resume
              register={register}
              errors={errors}
              watch={watch}
              setValue={setValue}
            />
          }
          {currentStep === 6 &&
            <Step7Certifications
              register={register}
              errors={errors}
              watch={watch}
              setValue={setValue}
            />
          }
          {currentStep === 7 &&
            <Step8AdditionalInfo
              register={register}
              errors={errors}
              watch={watch}
              setValue={setValue}
            />
          }
          {currentStep === 8 &&
            <Step9Review
              register={register}
              errors={errors}
              watch={watch}
              setValue={setValue}
            />
          }
        </form>


        <div
          className={clsx(
            "flex items-center justify-between gap-3 border-t border-border/40 px-6 py-4 max-md:flex-col max-md:gap-2 max-sm:p-0",
            currentStep === 0 && "justify-end"
          )}
        >
          {currentStep > 0 && (
            <Button
              type="button"
              onClick={handlePrev}
              variant="outline"
              disabled={isSubmitting}
              className="max-md:w-full"
            >
              Previous
            </Button>
          )}

          <div className="flex items-center gap-3 max-md:flex-col max-md:w-full">
            {currentStep !== 8 && < Button
              type="button"
              disabled={isSubmitting}
              // onClick={handleSubmit(handleSaveDraft)}  <-- your draft handler
              variant="outline"
              className="max-md:w-full"
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>}

            {currentStep < 8 && (
              <Button
                type="button"
                disabled={isSubmitting}
                onClick={handleNext}
                className="max-md:w-full"
              >
                Next
              </Button>
            )}

            {currentStep === 8 && (
              <Button
                type="button"
                disabled={isSubmitting}
                // onClick={handleSubmit(handleFinalSubmit)}
                variant="primary"
                className="max-md:w-full"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <Spinner className="h-4 w-4" />
                    {isEditMode ? "Updating..." : "Publishing..."}
                  </span>
                ) : isEditMode ? (
                  "Update Profile"
                ) : (
                  "Publish Profile"
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div >
  )
}

export default ProfileWizard
