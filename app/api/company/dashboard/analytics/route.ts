import { apiAuthGuard } from '@/src/lib/apiAuthGuard';
import prisma from '@/src/lib/prisma';
import { Role } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const guard = await apiAuthGuard([Role.COMPANY_ADMIN]);
    if (!guard.ok) return guard.response;

    const company = await prisma.company.findUnique({
      where: { userId: guard.session.user.id },
      select: { id: true },
    });

    if (!company) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 });
    }

    const jobsWithApplications = await prisma.job.findMany({
      where: { companyId: company.id },
      select: {
        id: true,
        title: true,
        views: true,
        _count: {
          select: { applications: true },
        },
      },
      orderBy: {
        applications: {
          _count: 'desc',
        },
      },
      take: 10,
    });

    const applicationsPerJob = jobsWithApplications.map((job) => ({
      jobTitle: job.title,
      applications: job._count.applications,
      views: job.views,
    }));

    const totalApps = await prisma.application.count({
      where: { job: { companyId: company.id } },
    });

    const funnelData = await prisma.application.groupBy({
      by: ['status'],
      where: { job: { companyId: company.id } },
      _count: true,
    });

    const funnel = [
      {
        stage: 'Applied',
        count: funnelData.find((s) => s.status === 'APPLIED')?._count || 0,
        percentage: 100,
      },
      {
        stage: 'Reviewing',
        count: funnelData.find((s) => s.status === 'REVIEWING')?._count || 0,
        percentage:
          totalApps > 0
            ? ((funnelData.find((s) => s.status === 'REVIEWING')?._count || 0) /
                totalApps) *
              100
            : 0,
      },
      {
        stage: 'Shortlisted',
        count: funnelData.find((s) => s.status === 'SHORTLISTED')?._count || 0,
        percentage:
          totalApps > 0
            ? ((funnelData.find((s) => s.status === 'SHORTLISTED')?._count ||
                0) /
                totalApps) *
              100
            : 0,
      },
      {
        stage: 'Interview',
        count:
          funnelData.find((s) => s.status === 'INTERVIEW_SCHEDULED')?._count ||
          0,
        percentage:
          totalApps > 0
            ? ((funnelData.find((s) => s.status === 'INTERVIEW_SCHEDULED')
                ?._count || 0) /
                totalApps) *
              100
            : 0,
      },
      {
        stage: 'Offered',
        count: funnelData.find((s) => s.status === 'OFFERED')?._count || 0,
        percentage:
          totalApps > 0
            ? ((funnelData.find((s) => s.status === 'OFFERED')?._count || 0) /
                totalApps) *
              100
            : 0,
      },
      {
        stage: 'Hired',
        count: funnelData.find((s) => s.status === 'HIRED')?._count || 0,
        percentage:
          totalApps > 0
            ? ((funnelData.find((s) => s.status === 'HIRED')?._count || 0) /
                totalApps) *
              100
            : 0,
      },
    ];

    return NextResponse.json({
      applicationsPerJob,
      funnel,
    });
  } catch (error) {
    console.error('Error fetching company analytics:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
