import { apiAuthGuard } from '@/src/lib/apiAuthGuard';
import prisma from '@/src/lib/prisma';
import { Role } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const guard = await apiAuthGuard([Role.COMPANY_ADMIN]);
    if (!guard.ok) {
      return guard.response;
    }

    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    const company = await prisma.company.findUnique({
      where: { userId: guard.session.user.id },
      select: { id: true },
    });

    if (!company) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 });
    }

    const companyJobs = await prisma.job.findMany({
      where: { companyId: company.id },
      select: { id: true },
    });

    const jobIds = companyJobs.map((job) => job.id);

    if (jobIds.length === 0) {
      return NextResponse.json({
        jobs: [],
        pagination: {
          total: 0,
          page,
          limit,
          totalPages: 0,
        },
      });
    }

    const [jobs, totalJobs] = await Promise.all([
      prisma.job.findMany({
        where: {
          companyId: company.id,
        },
        select: {
          id: true,
          title: true,
          slug: true,
          status: true,
          createdAt: true,
          _count: {
            select: {
              applications: true,
            },
          },
          applications: {
            orderBy: { createdAt: 'desc' },
            take: 1,
            select: {
              createdAt: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      prisma.job.count({
        where: { companyId: company.id },
      }),
    ]);

    const formattedJobs = jobs.map((job) => ({
      id: job.id,
      title: job.title,
      slug: job.slug,
      status: job.status,
      createdAt: job.createdAt,
      applicationsCount: job._count.applications,
      lastApplicationAt:
        job.applications.length > 0 ? job.applications[0].createdAt : null,
    }));

    return NextResponse.json({
      jobs: formattedJobs,
      pagination: {
        total: totalJobs,
        page,
        limit,
        totalPages: Math.ceil(totalJobs / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching company applications:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
