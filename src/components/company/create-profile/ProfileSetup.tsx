'use client'
import { useState } from 'react'
import FormHeader from './FormHeader'
import Step1BasicInfo from './Step1BasicInfo'
import Step2Contact from './Step2Contact'
import Step3Documents from './Step3Documents'
import Step4Review from './Step4Review'
import { Button } from '../../ui/Button'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useSession } from 'next-auth/react'

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

  logo: File | null,
  businessDocument: File | null,
  taxDocument: File | null
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
      logo: null,
      businessDocument: null,
      taxDocument: null, //optional
    }
  })

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

  const handleFormSubmit: SubmitHandler<ProfileFormInputs> = (data) => {
    console.log(data);
    reset()
    setCurrentStep(0)
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
      <div className="rounded-2xl border border-border/40 bg-card shadow-sm max-sm:rounded-none max-sm:border-0 max-sm:shadow-none">
        <div className="border-b border-border/40 px-6 py-4 max-sm:p-0">
          <FormHeader
            currentStep={currentStep}
            handleNext={handleNext}
            handlePrev={handlePrev}
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
              className="max-md:w-1/2"
            >
              Previous
            </Button>
          )}
          {currentStep < 3 ? (
            <Button
              onClick={handleNext}
              className="max-md:w-1/2"
            >
              Next
            </Button>
          ) : (
            <Button onClick={handleSubmit(handleFormSubmit)} variant="primary" className="max-md:w-1/2">
              Submit
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProfileSetup
