import { Metadata } from 'next'
import CompanyPublicView from '@/src/components/public/companies-dir/CompanyPublicView'
import prisma from '@/src/lib/prisma'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params

  const company = await prisma.company.findUnique({
    where: { id, status: 'APPROVED' },
    select: { name: true, description: true, logo: true },
  })

  if (!company) return { title: 'Company Not Found' }

  return {
    title: `${company.name} - Jobs & Company Info | HireFlow`,
    description: company.description.substring(0, 160),
    openGraph: {
      title: company.name,
      description: company.description,
      images: company.logo ? [company.logo] : [],
    },
  }
}

export default async function CompanyPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <CompanyPublicView id={id} />
}