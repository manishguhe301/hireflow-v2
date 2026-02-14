import DashboardProfileGuard from "@/src/components/job-seeker/DashboardProfileGuard";

export default function BrowseJobs() {
  return (
    <DashboardProfileGuard>
      <div className="p-8">
        <h1 className="text-3xl font-bold">Browse Jobs</h1>
        <p className="mt-4 text-muted-foreground">
          Discover and apply to relevant job opportunities
        </p>
      </div>
    </DashboardProfileGuard>
  )
}