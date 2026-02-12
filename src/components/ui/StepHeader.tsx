const StepHeader = ({
  heading,
  description,
  descClassName
}: {
  heading: string
  description: string,
  descClassName?: string
}) => {
  return (
    <div className="space-y-1">
      <h2 className="text-xl font-semibold tracking-tight">
        {heading}
      </h2>
      <p className={`text-sm text-muted-foreground ${descClassName}`}>
        {description}
      </p>
    </div>
  )
}

export default StepHeader