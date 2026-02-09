import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import CompanyPublicView from '@/src/components/public/CompanyPublicView'

async function getCompany(id: string) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

  try {
    const res = await fetch(`${baseUrl}/api/companies/${id}`, {
      cache: 'no-store',
    })

    if (!res.ok) {
      return null
    }

    return res.json()
  } catch (error) {
    console.error('Error fetching company:', error)
    return null
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const data = await getCompany(id)

  if (!data) {
    return {
      title: 'Company Not Found',
    }
  }

  const { company } = data

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
  const data = await getCompany(id)
  console.log(data);

  if (!data) {
    notFound()
  }

  return <CompanyPublicView company={data.company} jobs={data.jobs} />
}