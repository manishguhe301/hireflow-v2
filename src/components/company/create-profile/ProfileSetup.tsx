'use client'
import { useState } from 'react'
import FormHeader from './FormHeader'
import Step1BasicInfo from './Step1BasicInfo'
import Step2Contact from './Step2Contact'
import Step3Documents from './Step3Documents'
import Step4Review from './Step4Review'
import { Button } from '../../ui/Button'

const ProfileSetup = () => {
  const [currentStep, setCurrentStep] = useState(0)

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
      <div className="rounded-2xl border border-border/40 bg-card shadow-sm max-sm:rounded-none max-sm:border-0 max-sm:shadow-none">
        <div className="border-b border-border/40 px-6 py-4 max-sm:p-0">
          <FormHeader
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
          />
        </div>

        <div className="px-6 py-6 max-sm:px-0 max-sm:py-4">
          {currentStep === 0 && <Step1BasicInfo />}
          {currentStep === 1 && <Step2Contact />}
          {currentStep === 2 && <Step3Documents />}
          {currentStep === 3 && <Step4Review />}
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-border/40 px-6 py-4">
          {currentStep < 3 ? (
            <Button onClick={() => setCurrentStep(prev => prev + 1)}>
              Next
            </Button>
          ) : (
            <Button variant="primary">
              Submit
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProfileSetup
