import { authOptions } from '@/src/lib/auth';
import prisma from '@/src/lib/prisma';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;

    if (!slug)
      return NextResponse.json({ error: 'Slug not found' }, { status: 404 });
    const session = await getServerSession(authOptions);

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

    let hasApplied = false;
    let existingApplication = null;

    if (session?.user?.id) {
      existingApplication = await prisma.application.findUnique({
        where: {
          userId_jobId: {
            userId: session.user.id,
            jobId: job.id,
          },
        },
        select: {
          id: true,
          status: true,
          createdAt: true,
        },
      });
      hasApplied = !!existingApplication;
    }

    prisma.job
      .update({
        where: { id: job.id },
        data: { views: { increment: 1 } },
      })
      .catch((err) => console.error('Failed to increment views:', err));

    const similarJobs = await prisma.job.findMany({
      where: {
        status: 'ACTIVE',
        id: { not: job.id },
        OR: [{ category: job.category }, { companyId: job.company.id }],
      },
      select: {
        id: true,
        title: true,
        category: true,
        slug: true,
        workMode: true,
        employmentType: true,
        experienceLevel: true,
        country: true,
        city: true,
        salaryMin: true,
        salaryMax: true,
        numberOfOpenings: true,
        applicationDeadline: true,
        createdAt: true,
        company: {
          select: {
            name: true,
            logo: true,
            id: true,
          },
        },
      },
      take: 6,
      orderBy: {
        createdAt: 'desc',
      },
    });

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
      similarJobs,
      hasApplied,
      application: existingApplication,
    });
  } catch (error) {
    console.error('Error fetching job:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
