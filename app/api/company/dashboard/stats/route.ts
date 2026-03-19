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

    const [
      totalJobs,
      activeJobs,
      totalApplications,
      totalViews,
      recentApplications,
    ] = await Promise.all([
      prisma.job.count({
        where: { companyId: company.id },
      }),
      prisma.job.count({
        where: { companyId: company.id, status: 'ACTIVE' },
      }),
      prisma.application.count({
        where: { job: { companyId: company.id } },
      }),
      prisma.job.aggregate({
        where: { companyId: company.id },
        _sum: { views: true },
      }),
      prisma.application.findMany({
        where: { job: { companyId: company.id } },
        select: {
          id: true,
          status: true,
          createdAt: true,
          user: {
            select: {
              profile: {
                select: {
                  name: true,
                  avatar: true,
                },
              },
            },
          },
          job: {
            select: {
              title: true,
              slug: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
    ]);

    const applicationsByStatus = await prisma.application.groupBy({
      by: ['status'],
      where: { job: { companyId: company.id } },
      _count: true,
    });

    const statusBreakdown = {
      applied:
        applicationsByStatus.find((s) => s.status === 'APPLIED')?._count || 0,
      reviewing:
        applicationsByStatus.find((s) => s.status === 'REVIEWING')?._count || 0,
      shortlisted:
        applicationsByStatus.find((s) => s.status === 'SHORTLISTED')?._count ||
        0,
      interview:
        applicationsByStatus.find((s) => s.status === 'INTERVIEW_SCHEDULED')
          ?._count || 0,
      rejected:
        applicationsByStatus.find((s) => s.status === 'REJECTED')?._count || 0,
      offered:
        applicationsByStatus.find((s) => s.status === 'OFFERED')?._count || 0,
      hired:
        applicationsByStatus.find((s) => s.status === 'HIRED')?._count || 0,
    };

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const applicationsOverTime = await prisma.application.findMany({
      where: {
        job: { companyId: company.id },
        createdAt: { gte: thirtyDaysAgo },
      },
      select: {
        createdAt: true,
      },
    });
    const applicationsByDate: { [key: string]: number } = {};

    applicationsOverTime.forEach((app) => {
      const date = new Date(app.createdAt).toISOString().split('T')[0];
      applicationsByDate[date] = (applicationsByDate[date] || 0) + 1;
    });

    const timeSeriesData = Object.entries(applicationsByDate)
      .map(([date, count]) => ({ date, applications: count }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return NextResponse.json({
      stats: {
        totalJobs,
        activeJobs,
        totalApplications,
        totalViews: totalViews._sum.views || 0,
        statusBreakdown,
      },
      timeSeriesData,
      recentApplications,
    });
  } catch (error) {
    console.error('Error fetching company dashboard stats:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
