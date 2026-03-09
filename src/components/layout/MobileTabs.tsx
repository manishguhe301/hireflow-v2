import clsx from "clsx";

const MobileTabs = ({
  steps,
  currentStep,
  onStepClick,
  isEditMode,
}: {
  steps: { number: number; label: string }[]
  currentStep: number
  onStepClick: (index: number) => void
  isEditMode: boolean
}) => {
  return (
    <div className="max-w-[calc(100vw-2rem)] flex gap-2 overflow-x-auto pb-2 mb-4 lg:hidden scrollbar-hide">
      {steps.map((step, index) => (
        <button
          key={step.number}
          onClick={() => isEditMode && onStepClick(index)}
          className={clsx(
            'shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition',
            currentStep === index
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-muted-foreground hover:bg-muted/80'
          )}
        >
          {step.number}. {step.label}
        </button>
      ))}
    </div>
  )
}

export default MobileTabs