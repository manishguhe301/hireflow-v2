const StepHeader = ({
  heading,
  description,
}: {
  heading: string
  description: string
}) => {
  return (
    <div className="space-y-1">
      <h2 className="text-xl font-semibold tracking-tight">
        {heading}
      </h2>
      <p className="text-sm text-muted-foreground">
        {description}
      </p>
    </div>
  )
}

export default StepHeader