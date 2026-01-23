'use client'
import React from 'react'
import { Button } from '../../ui/Button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import clsx from 'clsx'

const steps = [
  { number: 1, label: 'Basic Info' },
  { number: 2, label: 'Contact' },
  { number: 3, label: 'Documents' },
  { number: 4, label: 'Review' },
]

const FormHeader = ({
  currentStep,
  setCurrentStep,
}: {
  currentStep: number
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>
}) => {
  const totalSteps = steps.length

  return (
    <div className="flex  gap-4 flex-row items-center justify-between">
      <div>
        <h2 className="text-xl font-semibold">
          {steps[currentStep].label}
        </h2>
        <p className="text-sm text-muted-foreground">
          Step {steps[currentStep].number} of {totalSteps}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCurrentStep(prev => prev - 1)}
          disabled={currentStep === 0}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div className="flex items-center gap-1">
          {steps.map((_, index) => (
            <span
              key={index}
              className={clsx(
                'h-2 w-2 rounded-full transition',
                index <= currentStep
                  ? 'bg-primary'
                  : 'bg-warning/40'
              )}
            />
          ))}
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCurrentStep(prev => prev + 1)}
          disabled={currentStep === totalSteps - 1}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

export default FormHeader
