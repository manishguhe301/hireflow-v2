import DashboardProfileGuard from "@/src/components/job-seeker/DashboardProfileGuard"


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <DashboardProfileGuard>
      {children}
    </DashboardProfileGuard>
  )
}
