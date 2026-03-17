'use client'

import { StateWrapper } from '@/src/components/company/CompanyProfileGuard'
import { Spinner } from '@/src/components/elements/Loader'
import FormHeader from '@/src/components/ui/FormHeader'
import { useProfile } from '@/src/store/hooks/useProfile'
import { CurrentEmployment, ExperienceLevel, WorkMode } from '@prisma/client'
import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
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
import { toast } from 'sonner'
import { buildProfileFormData } from '@/src/utils/helper'
import { setProfile } from '@/src/store/slices/job-seeker/userProfileSlice'
import PageLoader from '@/src/components/ui/PageLoader'
import StepSidebar from '@/src/components/layout/StepSidebar'
import MobileTabs from '@/src/components/layout/MobileTabs'
import { AppSdk } from '@/src/utils/AppSdk'
import BackButton from '@/src/components/shared/BackButton'
import { JobSeekerFormInputs } from '@/src/types'
import { PROFILE_WIZARD_STEP_FIELDS, profileWizardSteps } from '@/src/utils/constants'

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
    setValue,
    getValues
  } = useForm<JobSeekerFormInputs>({
    defaultValues: {
      // STEP 1 – Basic Info
      userId: session?.user.id || '',
      // avatar: '', // Optional
      name: session?.user?.name || '',
      contactEmail: session?.user.email || '',
      countryPhoneCode: '',
      phone: '',
      country: '',
      city: '',

      // STEP 2 – Professional Info
      preferredWorkMode: [],
      willingToRelocate: true,
      professionalTitle: '', //optional
      bio: '', //optional;
      yearsOfExperience: null, //optional
      currentEmployment: null, //optional

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
      // expectedSalaryMax: undefined, //optional
      noticePeriod: '', //optional

      deleteAvatar: false
    }
  })
  const router = useRouter()
  const dispatch = useDispatch()
  const isEditMode = jobSeekerProfile ? true : false
  const selectedCountry = watch('country')

  useEffect(() => {
    if (jobSeekerProfile && isEditMode) {
      setValue('userId', jobSeekerProfile.userId)
      //eslint-disable-next-line
      // setValue('avatar', jobSeekerProfile.avatar as any)
      setValue('name', jobSeekerProfile.name)
      setValue('contactEmail', jobSeekerProfile.contactEmail)
      setValue('countryPhoneCode', jobSeekerProfile.countryPhoneCode)
      setValue('phone', jobSeekerProfile.phone)
      setValue('country', jobSeekerProfile.country)
      setValue('city', jobSeekerProfile.city as string)

      setValue('preferredWorkMode', jobSeekerProfile.preferredWorkMode)
      setValue('willingToRelocate', jobSeekerProfile.willingToRelocate)
      setValue('professionalTitle', jobSeekerProfile.professionalTitle as string)
      setValue('bio', jobSeekerProfile.bio as string)
      setValue('currentEmployment', jobSeekerProfile.currentEmployment)
      setValue('yearsOfExperience', jobSeekerProfile.yearsOfExperience)

      setValue('workExperience', jobSeekerProfile.workExperience)
      setValue('education', jobSeekerProfile.education)
      setValue('skills', jobSeekerProfile.skills)
      setValue('certifications', jobSeekerProfile.certifications)

      setValue('portfolioWebsite', jobSeekerProfile.portfolioWebsite as string)
      setValue('githubUrl', jobSeekerProfile.githubUrl as string)
      setValue('linkedinUrl', jobSeekerProfile.linkedinUrl as string)
      setValue('twitterUrl', jobSeekerProfile.twitterUrl as string)
      setValue('otherLinks', jobSeekerProfile.otherLinks)
      setValue('jobCategories', jobSeekerProfile.jobCategories)
      setValue('preferredLocations', jobSeekerProfile.preferredLocations)
      setValue('expectedSalaryMin', jobSeekerProfile.expectedSalaryMin as number)
      // setValue('expectedSalaryMax', jobSeekerProfile.expectedSalaryMax as number)
      setValue('noticePeriod', jobSeekerProfile.noticePeriod as string)
    }
  }, [jobSeekerProfile, setValue])


  useEffect(() => {
    register('preferredWorkMode', {
      validate: (value) =>
        value.length > 0 || 'At least one work mode is required',
    })
  }, [register])

  useEffect(() => {
    register('skills', {
      validate: (value) =>
        value.length > 0 || 'Please add at least one skill',
    })
  }, [register])


  useEffect(() => {
    register('jobCategories', {
      validate: (value) =>
        value.length > 0 || 'Please add at least one job category',
    })
  }, [register])

  useEffect(() => {
    register('preferredLocations', {
      validate: (value) =>
        value.length > 0 || 'Please add at least one preferred location',
    })
  }, [register])

  if (isLoading) {
    return (
      <PageLoader title="Loading your profile" subtitle="Preparing the profile editor" />
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

  const refetchProfile = async () => {
    try {
      const res = await AppSdk.getData('/api/profile/me', null)
      if (res.error) {
        toast.error(res.error || 'Error in re-fetching profile, please refresh the page')
        return
      }

      if (!res.error && res.profile) {
        dispatch(setProfile({ profile: res.profile }))
      }
    } catch (error) {
      toast.error('Error in re-fetching profile, please refresh the page')
      console.error(error)
    }
  }

  const handleNext = async () => {
    const fields = PROFILE_WIZARD_STEP_FIELDS[currentStep]

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

  const handleDraftSave = async () => {
    const data = getValues();

    if (!data.name || !data.contactEmail) {
      toast.error('Name and Email are required to save profile');
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = buildProfileFormData(data);
      if (isEditMode) {
        formData.delete('workExperience')
        formData.delete('education')
        formData.delete('certifications')
      }
      formData.append('isDraft', 'true');

      const response = await fetch('/api/profile', {
        method: isEditMode ? 'PATCH' : 'POST',
        body: formData,
      });

      if (response.status === 401 || response.status === 403) {
        signOut({ callbackUrl: '/login' })
        return
      }

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.error || 'Failed to save profile');
        return;
      }

      dispatch(setProfile({ profile: result.profile }))

      if (!isEditMode) { toast.success('Draft saved successfully') } else {
        toast.success('Profile updated successfully')
      }
      router.push('/dashboard/profile')
    } catch (err) {
      console.log(err);
      toast.error('Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };


  const handleFormSubmit: SubmitHandler<JobSeekerFormInputs> = async (data) => {
    const hasAnyData =
      data.name ||
      data.contactEmail ||
      data.phone ||
      data.country ||
      data.preferredWorkMode.length > 0 ||
      data.workExperience.length > 0 ||
      data.education.length > 0 ||
      data.skills.length > 0 ||
      data.certifications.length > 0 ||
      data.jobCategories.length > 0 ||
      data.preferredLocations.length > 0;

    if (!hasAnyData && !isEditMode) {
      toast.error('Please fill at least one field before saving');
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = buildProfileFormData(data);
      if (isEditMode) {
        formData.delete('workExperience')
        formData.delete('education')
        formData.delete('certifications')
      }
      formData.append('isDraft', 'false');

      const method = isEditMode ? 'PATCH' : 'POST';

      const response = await fetch('/api/profile', {
        method,
        body: formData,
      });

      if (response.status === 401 || response.status === 403) {
        signOut({ callbackUrl: '/login' })
        return
      }

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.error || 'Failed to save profile');
        return;
      }

      const successMessage = isEditMode
        ? 'Profile updated successfully'
        : 'Profile created successfully';

      toast.success(successMessage);
      dispatch(setProfile({ profile: result.profile }))
      reset();
      setTimeout(() => router.push('/dashboard/profile'), 100);
    } catch (error) {
      console.error('Submit error:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };



  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
      <BackButton disabled={isSubmitting} />
      {jobSeekerProfile && (
        <div className="my-6 rounded-2xl border border-primary/30 bg-primary/5 p-4">
          <p className="text-sm text-primary font-medium">
            Editing a profile
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Please review all steps before saving changes to ensure your profile
            remains accurate and up to date.
          </p>
        </div>
      )}
      {isEditMode && (
        <MobileTabs
          steps={profileWizardSteps}
          currentStep={currentStep}
          onStepClick={setCurrentStep}
          isEditMode={isEditMode}
          disabled={isSubmitting}
        />
      )}

      <div className="flex gap-6 items-start w-full">

        {isEditMode && (
          <div className="hidden lg:block sticky top-24">
            <StepSidebar
              steps={profileWizardSteps}
              currentStep={currentStep}
              onStepClick={setCurrentStep}
              isEditMode={isEditMode}
              disabled={isSubmitting}
            />
          </div>
        )}


        <div className="rounded-2xl border border-border/40 bg-card shadow-sm max-sm:rounded-none max-sm:border-0 max-sm:shadow-none w-full">
          <div className="border-b border-border/40 px-6 py-4 max-sm:p-0">
            <FormHeader
              currentStep={currentStep}
              handleNext={handleNext}
              handlePrev={handlePrev}
              disabled={isSubmitting}
              steps={profileWizardSteps}
            />
          </div>
          <div className="px-6 py-6 max-sm:px-0 max-sm:py-4">
            {currentStep === 0 &&
              <Step1BasicFormInfo
                register={register}
                errors={errors}
                watch={watch}
                setValue={setValue}
                selectedCountry={selectedCountry}
                disabled={isSubmitting}
              />
            }
            {currentStep === 1 &&
              <Step2Professional
                register={register}
                errors={errors}
                watch={watch}
                disabled={isSubmitting}
                setValue={setValue}
              />
            }
            {currentStep === 2 &&
              <Step3Experience
                register={register}
                errors={errors}
                watch={watch}
                setValue={setValue}
                disabled={isSubmitting}
                isEditMode={isEditMode}
                refetchProfile={refetchProfile}
              />
            }
            {currentStep === 3 &&
              <Step4Education
                register={register}
                errors={errors}
                watch={watch}
                setValue={setValue}
                disabled={isSubmitting}
                isEditMode={isEditMode}
                refetchProfile={refetchProfile}
              />
            }
            {currentStep === 4 &&
              <Step5Skills
                register={register}
                errors={errors}
                watch={watch}
                setValue={setValue}
                disabled={isSubmitting}
              />
            }
            {currentStep === 5 &&
              <Step6Resume
                register={register}
                errors={errors}
                watch={watch}
                setValue={setValue}
                disabled={isSubmitting}
              />
            }
            {currentStep === 6 &&
              <Step7Certifications
                register={register}
                errors={errors}
                watch={watch}
                setValue={setValue}
                disabled={isSubmitting}
                isEditMode={isEditMode}
                refetchProfile={refetchProfile}
              />
            }
            {currentStep === 7 &&
              <Step8AdditionalInfo
                register={register}
                errors={errors}
                watch={watch}
                disabled={isSubmitting}
                setValue={setValue}
              />
            }
            {currentStep === 8 &&
              <Step9Review
                watch={watch}
                setCurrentStep={setCurrentStep}
                disabled={isSubmitting}
              />
            }
          </div>


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
                onClick={handleDraftSave}
                variant="outline"
                className="max-md:w-full"
              >
                {isSubmitting ? "Saving..." : jobSeekerProfile ? "Save Changes" : "Save as Draft"}
              </Button>
              }

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
                  onClick={handleSubmit(handleFormSubmit)}
                  variant="primary"
                  className="max-md:w-full flex items-center justify-center"
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
      </div>
    </div >
  )
}

export default ProfileWizard
