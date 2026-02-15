import { Spinner } from "@/src/components/elements/Loader"
import JobsDirectory from "@/src/components/public/jobs-dir/JobsDirectory"
import { Suspense } from "react"

const PublicJobsPage = () => {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-24">
          <Spinner className="h-8 w-8" />
        </div>
      }
    >
      <JobsDirectory />
    </Suspense>
  )
}

export default PublicJobsPage