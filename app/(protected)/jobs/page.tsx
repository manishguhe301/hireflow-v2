import DashboardProfileGuard from "@/src/components/job-seeker/DashboardProfileGuard";
import JobsDirectory from "@/src/components/public/jobs-dir/JobsDirectory";

export default function BrowseJobs() {
  return (
    <DashboardProfileGuard>
      <div className="p-8">
        <JobsDirectory />
      </div>
    </DashboardProfileGuard>
  )
}