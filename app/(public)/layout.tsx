import PublicHeader from '@/src/components/public/PublicHeader'
import PublicFooter from '@/src/components/public/PublicFooter'
import { ThemeToggle } from '@/src/components/theme/theme-toggle'

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main className="min-h-screen flex flex-col">
      <PublicHeader />
      {children}
      <ThemeToggle />
      <PublicFooter />
    </main>
  )
}
