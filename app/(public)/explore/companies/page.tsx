import CompaniesDirectory from '@/src/components/public/CompaniesDirectory'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Companies - Find Your Next Employer | HireFlow',
  description: 'Browse companies hiring on HireFlow. Discover top employers and explore job opportunities.',
}

export default function CompaniesPage() {
  return <CompaniesDirectory />
}