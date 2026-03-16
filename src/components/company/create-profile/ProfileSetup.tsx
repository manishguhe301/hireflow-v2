'use client'
import { useEffect, useRef, useState } from 'react'
import FormHeader from '../../ui/FormHeader'
import Step1BasicInfo from './Step1BasicInfo'
import Step2Contact from './Step2Contact'
import Step3Documents from './Step3Documents'
import Step4Review from './Step4Review'
import { Button } from '../../ui/Button'
import { SubmitHandler, useForm } from 'react-hook-form'
import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useDispatch } from 'react-redux'
import { toast } from 'sonner'
import { setCompany } from '@/src/store/slices/companySlice'
import { useCompany } from '@/src/store/hooks/useCompany'
import { CompanyStatus } from '@prisma/client'
import clsx from 'clsx'
import MobileTabs from '../../layout/MobileTabs'
import StepSidebar from '../../layout/StepSidebar'
import { Spinner } from '../../elements/Loader'
import { PROFILE_SETUP_STEP_FIELDS, profileSetupSteps } from '@/src/utils/constants'
import { ProfileFormInputs } from '@/src/types'
import BackButton from '../../shared/BackButton'


const ProfileSetup = () => {
  const [currentStep, setCurrentStep] = useState(0)
  const { data: session } = useSession()
  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
    trigger,
    reset,
    setValue
  } = useForm<ProfileFormInputs>({
    defaultValues: {
      //step 1
      name: '',
      description: '',
      industry: '',
      companySize: '',
      foundedYear: '',
      website: '',
      linkedinProfile: '', //Optional

      // Step 2 
      contactEmail: session?.user?.email || '',
      contactPhone: '', //optional
      country: '',
      city: '',
      countryPhoneCode: '',
      address: '', //optional

      // Step 3 
      // logo: null,
      // businessDocument: null,
      // taxDocument: null, //optional

      deleteLogo: false
    }
  })
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const dispatch = useDispatch()
  const { company, isLoading } = useCompany();
  const isEditMode = company ? true : false
  const hasCheckedRedirect = useRef(false)
  const selectedCountry = watch('country')

  useEffect(() => {
    if (hasCheckedRedirect.current) return

    if (
      company?.status === CompanyStatus.PENDING
    ) {
      router.replace('/company')
      hasCheckedRedirect.current = true
    }
  }, [company, router])

  useEffect(() => {
    if (company && (company.status === CompanyStatus.REJECTED || company.status === CompanyStatus.APPROVED)) {
      setValue('name', company.name)
      setValue('description', company.description)
      setValue('industry', company.industry)
      setValue('companySize', company.companySize)
      setValue('foundedYear', company.foundedYear?.toString() || '')
      setValue('website', company.website || '')
      setValue('linkedinProfile', company.linkedinProfile || '')
      setValue('contactEmail', company.contactEmail)
      setValue('contactPhone', company.contactPhone || '')
      setValue('country', company.country)
      setValue('city', company.city || '')
      setValue('countryPhoneCode', company?.countryPhoneCode || '')
      setValue('address', company.address || '')
    }
  }, [company, setValue])


  const handleNext = async () => {
    const fields = PROFILE_SETUP_STEP_FIELDS[currentStep]

    if (!fields) {
      setCurrentStep((prev) => prev + 1)
      return
    }

    const isValid = await trigger(fields)

    if (isValid) {
      setCurrentStep((prev) => prev + 1)
    }
  }

  const handlePrev = () => setCurrentStep((prev) => prev - 1)

  const handleFormSubmit: SubmitHandler<ProfileFormInputs> = async (data) => {
    setIsSubmitting(true)
    try {
      const formData = new FormData()

      formData.append('name', data.name)
      formData.append('description', data.description)
      formData.append('industry', data.industry)
      formData.append('companySize', data.companySize)
      formData.append('foundedYear', data.foundedYear)
      formData.append('website', data.website)
      formData.append('linkedinProfile', data.linkedinProfile || '')
      formData.append('contactEmail', data.contactEmail)
      formData.append('contactPhone', data.contactPhone || '')
      formData.append('country', data.country)
      formData.append('city', data.city || '')
      formData.append('countryPhoneCode', data.countryPhoneCode)
      formData.append('address', data.address || '')

      if (data.logo?.[0]) {
        formData.append('logo', data.logo[0])
      }

      if (data.deleteLogo) {
        formData.append('deleteLogo', 'true')
      }

      if (data.businessDocument?.[0]) {
        formData.append('businessDocument', data.businessDocument[0])
      }
      if (data.taxDocument?.[0]) {
        formData.append('taxDocument', data.taxDocument[0])
      }

      const isUpdate = company && (
        company.status === CompanyStatus.REJECTED ||
        company.status === CompanyStatus.APPROVED
      )
      const method = isUpdate ? 'PATCH' : 'POST'

      const response = await fetch('/api/company/profile', {
        method,
        body: formData,
      })

      if (response.status === 401 || response.status === 403) {
        signOut({ callbackUrl: '/login' })
        return
      }

      const result = await response.json()

      if (!response.ok) {
        toast.error(result.error || 'Failed to create profile')
        return
      }

      dispatch(setCompany({ company: result.company }))

      if (company?.status === CompanyStatus.REJECTED) {
        toast.success('Profile resubmitted for approval!')
      } else if (company?.status === CompanyStatus.APPROVED) {
        toast.success('Profile updated successfully!')
      } else {
        toast.success('Profile submitted for approval!')
      }

      reset()

      if (company?.status === CompanyStatus.APPROVED) { router.push('/company/profile') }
      else { router.push('/company') }

    } catch (error) {
      console.error('Submit error:', error)
      toast.error('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) return <div className='flex items-center justify-center h-full'>
    <Spinner className='h-8 w-8' />
  </div>

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
      <BackButton disabled={isSubmitting} />
      {company?.status === CompanyStatus.REJECTED && company.rejectionReason && (
        <div className="mb-6 rounded-2xl border border-destructive/40 bg-destructive/10 p-4">
          <h3 className="text-sm font-semibold text-destructive mb-1">
            Profile Rejected
          </h3>
          <p className="text-sm text-destructive/90">
            {company.rejectionReason}
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Please update your information and resubmit for approval.
          </p>
        </div>
      )}

      {company?.status === CompanyStatus.APPROVED && (
        <div className="mb-6 rounded-2xl border border-primary/30 bg-primary/5 p-4">
          <p className="text-sm text-primary font-medium">
            Editing an approved profile
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Please review all steps before saving changes to ensure your profile
            remains accurate and up to date.
          </p>
        </div>
      )}

      {isEditMode && (
        <MobileTabs
          steps={profileSetupSteps}
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
              steps={profileSetupSteps}
              currentStep={currentStep}
              onStepClick={setCurrentStep}
              isEditMode={isEditMode}
              disabled={isSubmitting}
            />
          </div>
        )}

        <div className=" w-full rounded-2xl border border-border/40 bg-card shadow-sm max-sm:rounded-none max-sm:border-0 max-sm:shadow-none">
          <div className="border-b border-border/40 px-6 py-4 max-sm:p-0">
            <FormHeader
              currentStep={currentStep}
              handleNext={handleNext}
              handlePrev={handlePrev}
              disabled={isSubmitting}
              steps={profileSetupSteps}
            />
          </div>

          <form className="px-6 py-6 max-sm:px-0 max-sm:py-4">
            {currentStep === 0 &&
              <Step1BasicInfo
                register={register}
                errors={errors}
                isLoading={isSubmitting}
              />}
            {currentStep === 1 &&
              <Step2Contact
                register={register}
                errors={errors}
                selectedCountry={selectedCountry}
                watch={watch}
                setValue={setValue}
                isLoading={isSubmitting}
              />}
            {currentStep === 2 &&
              <Step3Documents
                register={register}
                errors={errors}
                isLoading={isSubmitting}
                watch={watch}
                setValue={setValue}
              />}
            {currentStep === 3 &&
              <Step4Review
                setCurrentStep={setCurrentStep}
                watch={watch}
                isLoading={isSubmitting}
              />
            }
          </form>

          <div className={clsx("flex items-center justify-between gap-3 border-t border-border/40 px-6 py-4 max-md:justify-center max-md:w-full max-sm:p-0 max-md:flex-col max-md:gap-4",
            currentStep === 0 && 'justify-end'
          )}>
            {currentStep > 0 && (
              <Button
                onClick={handlePrev}
                variant="outline"
                disabled={isSubmitting}
                className="max-md:w-1/2 max-sm:w-full"
              >
                Previous
              </Button>
            )}
            <div className="flex items-center gap-3 max-md:flex-col max-md:w-full">

              {currentStep !== 3 && isEditMode && company?.status === CompanyStatus.APPROVED && < Button
                type="button"
                disabled={isSubmitting}
                onClick={handleSubmit(handleFormSubmit)}
                variant="outline"
                className="max-md:w-1/2 text-primary border border-primary max-sm:w-full"
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
              }

              {currentStep < 3 ? (
                <Button
                  disabled={isSubmitting}
                  onClick={handleNext}
                  className="max-md:w-1/2 max-sm:w-full"
                >
                  Next
                </Button>
              ) : (
                <Button
                  disabled={isSubmitting}
                  onClick={handleSubmit(handleFormSubmit)}
                  variant="primary"
                  className="max-md:w-1/2 max-sm:w-full"
                >
                  {isSubmitting
                    ? 'Submitting...'
                    : company?.status === CompanyStatus.REJECTED
                      ? 'Resubmit for Approval'
                      : company?.status === CompanyStatus.APPROVED
                        ? 'Save Changes'
                        : 'Submit for Approval'
                  }
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfileSetup
