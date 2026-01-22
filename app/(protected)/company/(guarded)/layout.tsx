
import CompanyProfileGuard from '@/src/components/company/CompanyProfileGuard'

export default function CompanyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <CompanyProfileGuard>
      {children}
    </CompanyProfileGuard>
  )
}
