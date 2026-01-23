'use client'
import { useState } from 'react'
import FormHeader from './FormHeader'
import Step1BasicInfo from './Step1BasicInfo'
import Step2Contact from './Step2Contact'
import Step3Documents from './Step3Documents'
import Step4Review from './Step4Review'
import { Button } from '../../ui/Button'
import { useForm } from 'react-hook-form'
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

const ProfileSetup = () => {
  const [currentStep, setCurrentStep] = useState(0)
  const { data: session } = useSession()
  const {
    register,
    formState: { errors },
    // handleSubmit,
    // watch,
    // reset
  } = useForm<ProfileFormInputs>({
    defaultValues: {
      //step 1
      name: '',
      description: '',
      industry: '',
      companySize: '',
      foundedYear: '',
      website: '',
      linkedinProfile: '',

      // Step 2 
      contactEmail: session?.user?.email || '',
      contactPhone: '',
      location: '',
      address: '',

      // Step 3 
      logo: null,
      businessDocument: null,
      taxDocument: null,
    }
  })

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
      <div className="rounded-2xl border border-border/40 bg-card shadow-sm max-sm:rounded-none max-sm:border-0 max-sm:shadow-none">
        <div className="border-b border-border/40 px-6 py-4 max-sm:p-0">
          <FormHeader
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
          />
        </div>

        <form className="px-6 py-6 max-sm:px-0 max-sm:py-4">
          {currentStep === 0 && <Step1BasicInfo register={register} errors={errors} />}
          {currentStep === 1 && <Step2Contact register={register} errors={errors} />}
          {currentStep === 2 && <Step3Documents register={register} errors={errors} />}
          {currentStep === 3 && <Step4Review register={register} errors={errors} />}
        </form>

        <div className="flex items-center justify-end gap-3 border-t border-border/40 px-6 py-4 max-md:justify-center max-md:w-full max-sm:p-0">
          {currentStep < 3 ? (
            <Button onClick={() => setCurrentStep(prev => prev + 1)} className='max-md:w-1/2'>
              Next
            </Button>
          ) : (
            <Button variant="primary" className='max-md:w-1/2'>
              Submit
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProfileSetup
