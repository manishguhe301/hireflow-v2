import Navbar from "@/src/components/layout/Navbar"

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      <Navbar />
      <main>
        {children}
      </main>
    </div>
  )
}