'use client'
import { useEffect, useRef, useState } from 'react'
import FormHeader from './FormHeader'
import Step1BasicInfo from './Step1BasicInfo'
import Step2Contact from './Step2Contact'
import Step3Documents from './Step3Documents'
import Step4Review from './Step4Review'
import { Button } from '../../ui/Button'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useDispatch } from 'react-redux'
import { toast } from 'sonner'
import { setCompany } from '@/src/store/slices/companySlice'
import { useCompany } from '@/src/store/hooks/useCompany'
import { CompanyStatus } from '@prisma/client'

export type ProfileFormInputs = {
  name: string,
  description: string,
  industry: string,
  companySize: string,
  foundedYear: string,
  website: string,
  linkedinProfile: string,

  contactEmail: string,
  contactPhone: string,
  location: string,
  address: string,

  logo: FileList,
  businessDocument: FileList,
  taxDocument: FileList
}

const STEP_FIELDS: Record<number, (keyof ProfileFormInputs)[]> = {
  0: [
    'name',
    'description',
    'industry',
    'companySize',
    'foundedYear',
    'website',
  ],
  1: [
    'contactEmail',
    'location',
  ],
  2: [
    'logo',
    'businessDocument',
  ],
}


const ProfileSetup = () => {
  const [currentStep, setCurrentStep] = useState(0)
  const { data: session } = useSession()
  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
    trigger,
    reset
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
      contactPhone: '',//optional
      location: '',
      address: '', //optional

      // Step 3 
      // logo: null,
      // businessDocument: null,
      // taxDocument: null, //optional
    }
  })
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const dispatch = useDispatch()
  const { company } = useCompany();
  const hasCheckedRedirect = useRef(false)

  useEffect(() => {
    if (hasCheckedRedirect.current) return

    if (
      company &&
      (company.status === CompanyStatus.APPROVED ||
        company.status === CompanyStatus.PENDING)
    ) {
      router.replace('/company')
      hasCheckedRedirect.current = true
    }
  }, [company, router])


  const handleNext = async () => {
    const fields = STEP_FIELDS[currentStep]

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
      formData.append('location', data.location)
      formData.append('address', data.address || '')

      if (data.logo?.[0]) {
        formData.append('logo', data.logo[0])
      }
      if (data.businessDocument?.[0]) {
        formData.append('businessDocument', data.businessDocument[0])
      }
      if (data.taxDocument?.[0]) {
        formData.append('taxDocument', data.taxDocument[0])
      }

      const response = await fetch('/api/company/profile', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()

      if (!response.ok) {
        toast.error(result.error || 'Failed to create profile')
        return
      }

      dispatch(setCompany({ company: result.company }))

      toast.success('Profile submitted for approval!')
      reset()
      router.push('/company')
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
          />
        </div>

        <form className="px-6 py-6 max-sm:px-0 max-sm:py-4">
          {currentStep === 0 && <Step1BasicInfo register={register} errors={errors} />}
          {currentStep === 1 && <Step2Contact register={register} errors={errors} />}
          {currentStep === 2 && <Step3Documents register={register} errors={errors} />}
          {currentStep === 3 &&
            <Step4Review
              setCurrentStep={setCurrentStep}
              watch={watch}
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
          {currentStep < 3 ? (
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
              {isSubmitting ? 'Submitting...' : 'Submit for Approval'}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProfileSetup
