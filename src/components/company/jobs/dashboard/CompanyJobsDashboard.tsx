import Link from 'next/link'
import { Plus } from 'lucide-react'
import ManageJobs from './ManageJobs'

const CompanyJobsDashboard = () => {
  return (
    <div className="p-4 md:p-8 md:px-8 space-y-8 w-full md:max-w-[1400px] md:mx-auto animate-in fade-in duration-500 max-sm:max-w-screen">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">
            Manage Jobs
          </h1>
          <p className="mt-2 text-muted-foreground">
            Create, manage, and track all your job postings in one place
          </p>
        </div>

        <Link
          href="/company/jobs/create"
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-medium text-primary-foreground shadow-md transition hover:opacity-90 max-md:w-full max-md:justify-center"
        >
          <Plus className="h-4 w-4" />
          Create Job
        </Link>
      </div>
      <ManageJobs />
    </div>
  )
}

export default CompanyJobsDashboard
