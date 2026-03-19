'use client'
import { ArrowLeft } from 'lucide-react'
import { Button } from '../ui/Button'
import { useRouter } from 'next/navigation'

const BackButton = ({ disabled }: { disabled?: boolean }) => {
  const router = useRouter()
  return (
    <Button
      variant="ghost"
      onClick={() => router.back()}
      className="inline-flex items-center gap-2 py-2 mb-6 p-0!"
      disabled={disabled}
    >
      <ArrowLeft className="h-4 w-4" />
      Back
    </Button>
  )
}

export default BackButton