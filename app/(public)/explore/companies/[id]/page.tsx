import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import CompanyPublicView from '@/src/components/public/companies-dir/CompanyPublicView'
import prisma from '@/src/lib/prisma'
import { getSignedUrl } from '@/src/lib/fileUpload'

async function getCompany(id: string) {
  try {
    const company = await prisma.company.findUnique({
      where: {
        id,
        status: 'APPROVED'
      },
      include: {
        jobs: {
          where: {
            status: 'ACTIVE'
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    })

    if (!company) {
      return null
    }
    const signedCompanyLogo = await getSignedUrl(
      company?.logo as string,
      604800,
    );


    return { company: { ...company, logo: signedCompanyLogo }, jobs: company.jobs }
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

  if (!data) {
    notFound()
  }

  return <CompanyPublicView company={data.company} jobs={data.jobs} />
}