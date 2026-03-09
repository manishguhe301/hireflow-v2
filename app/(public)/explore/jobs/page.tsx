import { Spinner } from "@/src/components/elements/Loader"
import JobsDirectory from "@/src/components/public/jobs-dir/JobsDirectory"
import { Suspense } from "react"

const PublicJobsPage = () => {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <Spinner className="h-8 w-8 mb-3" />
          <p className="text-sm text-muted-foreground">
            Loading jobs...
          </p>
        </div>
      }
    >
      <JobsDirectory />
    </Suspense>
  )
}

export default PublicJobsPage