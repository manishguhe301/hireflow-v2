import prisma from '@/src/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } },
) {
  try {
    const { slug } = params;

    const job = await prisma.job.findUnique({
      where: {
        slug,
        status: 'ACTIVE',
      },
      select: {
        id: true,
        title: true,
        description: true,
        requirements: true,
        responsibilities: true,
        skills: true,
        experienceLevel: true,
        employmentType: true,
        workMode: true,
        country: true,
        city: true,
        salaryMin: true,
        salaryMax: true,
        hideSalary: true,
        numberOfOpenings: true,
        applicationDeadline: true,
        category: true,
        slug: true,
        views: true,
        createdAt: true,
        updatedAt: true,
        company: {
          select: {
            id: true,
            name: true,
            logo: true,
            description: true,
            industry: true,
            companySize: true,
            foundedYear: true,
            website: true,
            linkedinProfile: true,
            country: true,
            city: true,
            _count: {
              select: {
                jobs: {
                  where: {
                    status: 'ACTIVE',
                  },
                },
              },
            },
          },
        },
        _count: {
          select: {
            applications: true,
            savedJobs: true,
          },
        },
      },
    });

    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    return NextResponse.json({
      job: {
        ...job,
        applicationsCount: job._count.applications,
        savedCount: job._count.savedJobs,
        company: {
          ...job.company,
          activeJobsCount: job.company._count.jobs,
        },
      },
    });
  } catch (error) {
    console.error('Error fetching job:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
