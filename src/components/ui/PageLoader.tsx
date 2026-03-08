import { Spinner } from "../elements/Loader"

export default function PageLoader({
  title,
  subtitle,
}: {
  title: string
  subtitle?: string
}) {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center text-center px-4">
      <Spinner className="h-8 w-8 mb-4" />

      <p className="text-sm font-medium">{title}</p>

      {subtitle && (
        <p className="text-xs text-muted-foreground mt-1">
          {subtitle}
        </p>
      )}
    </div>
  )
}