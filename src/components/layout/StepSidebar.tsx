import clsx from "clsx";

const StepSidebar = ({
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
    <div className="w-48 shrink-0 flex flex-col gap-1">
      {steps.map((step, index) => (
        <button
          key={step.number}
          onClick={() => {
            if (isEditMode) {
              onStepClick(index)
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }
          }}
          className={clsx(
            'text-left px-3 py-2.5 rounded-xl text-sm transition flex items-center gap-2.5',
            currentStep === index
              ? 'bg-primary text-primary-foreground font-medium'
              : 'text-muted-foreground hover:bg-muted/60',
            !isEditMode && index !== currentStep && 'opacity-40 cursor-not-allowed pointer-events-none'
          )}
        >
          <span className={clsx(
            'h-5 w-5 rounded-full text-xs flex items-center justify-center shrink-0 font-semibold',
            currentStep === index
              ? 'bg-primary-foreground text-primary'
              : 'bg-muted text-muted-foreground'
          )}>
            {step.number}
          </span>
          {step.label}
        </button>
      ))}
    </div>
  )
}

export default StepSidebar