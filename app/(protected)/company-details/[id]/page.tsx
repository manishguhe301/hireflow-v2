import React from 'react'

import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import CompanyPublicView from '@/src/components/public/companies-dir/CompanyPublicView'
import prisma from '@/src/lib/prisma'
import { apiAuthGuard } from '@/src/lib/apiAuthGuard'
import { Role } from '@prisma/client'

async function getCompany(id: string) {
  try {
    const guard = await apiAuthGuard([Role.JOB_SEEKER])

    let appliedJobIds: string[] = []

    if (guard.ok) {
      const applications = await prisma.application.findMany({
        where: {
          userId: guard.session.user.id
        },
        select: {
          jobId: true
        }
      })

      appliedJobIds = applications.map(a => a.jobId)
    }

    const company = await prisma.company.findUnique({
      where: {
        id,
        status: 'APPROVED'
      },
      include: {
        jobs: {
          where: {
            status: 'ACTIVE',
            ...(guard.ok && {
              id: {
                notIn: appliedJobIds
              }
            })
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
    return { company, jobs: company.jobs }
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

export default async function AuthCompanyDetailsForJobSeekers({
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
