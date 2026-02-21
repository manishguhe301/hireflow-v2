import { apiAuthGuard } from '@/src/lib/apiAuthGuard';
import prisma from '@/src/lib/prisma';
import { CompanyStatus, Role } from '@prisma/client';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const guard = await apiAuthGuard([Role.PLATFORM_ADMIN]);
    if (!guard.ok) {
      return guard.response;
    }

    const [
      totalCompanies,
      totalUsers,
      totalPendingCompanies,
      totalRejectedCompanies,
      totalApprovedCompanies,
      totalJobSeekers,
      totalPlatformAdminsCount,
      totalJobs,
      totalApplications,
    ] = await Promise.all([
      prisma.company.count(),
      prisma.user.count(),
      prisma.company.count({ where: { status: CompanyStatus.PENDING } }),
      prisma.company.count({ where: { status: CompanyStatus.REJECTED } }),
      prisma.company.count({ where: { status: CompanyStatus.APPROVED } }),
      prisma.user.count({ where: { role: Role.JOB_SEEKER } }),
      prisma.user.count({ where: { role: Role.PLATFORM_ADMIN } }),
      prisma.job.count(),
      prisma.application.count(),
    ]);

    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

    const userGrowth = await prisma.user.groupBy({
      by: ['createdAt'],
      where: { createdAt: { gte: twelveMonthsAgo } },
      _count: true,
    });

    const usersByMonth: { [key: string]: number } = {};
    userGrowth.forEach((user) => {
      const month = new Date(user.createdAt).toISOString().slice(0, 7); // YYYY-MM
      usersByMonth[month] = (usersByMonth[month] || 0) + user._count;
    });

    const userGrowthData = Object.entries(usersByMonth)
      .map(([month, count]) => ({ month, users: count }))
      .sort((a, b) => a.month.localeCompare(b.month));

    const jobTrends = await prisma.job.groupBy({
      by: ['createdAt'],
      where: { createdAt: { gte: twelveMonthsAgo } },
      _count: true,
    });

    const jobsByMonth: { [key: string]: number } = {};
    jobTrends.forEach((job) => {
      const month = new Date(job.createdAt).toISOString().slice(0, 7);
      jobsByMonth[month] = (jobsByMonth[month] || 0) + job._count;
    });

    const jobTrendsData = Object.entries(jobsByMonth)
      .map(([month, count]) => ({ month, jobs: count }))
      .sort((a, b) => a.month.localeCompare(b.month));

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentApprovals = await prisma.company.count({
      where: {
        status: CompanyStatus.APPROVED,
        approvedAt: { gte: thirtyDaysAgo },
      },
    });

    const recentRejections = await prisma.company.count({
      where: {
        status: CompanyStatus.REJECTED,
        updatedAt: { gte: thirtyDaysAgo },
      },
    });

    const topCompanies = await prisma.company.findMany({
      where: { status: CompanyStatus.APPROVED },
      select: {
        name: true,
        _count: {
          select: { jobs: true },
        },
      },
      orderBy: {
        jobs: {
          _count: 'desc',
        },
      },
      take: 5,
    });

    const topCompaniesData = topCompanies.map((company) => ({
      name: company.name,
      jobs: company._count.jobs,
    }));

    const [recentUsers, recentCompanies, recentJobs] = await Promise.all([
      prisma.user.findMany({
        where: { createdAt: { gte: thirtyDaysAgo } },
        select: {
          name: true,
          role: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
      prisma.company.findMany({
        where: { createdAt: { gte: thirtyDaysAgo } },
        select: {
          name: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
      prisma.job.findMany({
        where: { createdAt: { gte: thirtyDaysAgo } },
        select: {
          title: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
    ]);

    const recentActivity = [
      ...recentUsers.map((u) => ({
        action: 'User Joined',
        timestamp: u.createdAt,
        details: `${u.name} (${u.role})`,
      })),
      ...recentCompanies.map((c) => ({
        action: 'Company Registered',
        timestamp: c.createdAt,
        details: c.name,
      })),
      ...recentJobs.map((j) => ({
        action: 'Job Posted',
        timestamp: j.createdAt,
        details: j.title,
      })),
    ]
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 10);

    return NextResponse.json({
      companies: {
        total: totalCompanies,
        pending: totalPendingCompanies,
        rejected: totalRejectedCompanies,
        approved: totalApprovedCompanies,
      },
      users: {
        total: totalUsers,
        jobSeekers: totalJobSeekers,
        admins: totalPlatformAdminsCount,
      },
      platform: {
        totalJobs,
        totalApplications,
        recentApprovals,
        recentRejections,
      },
      analytics: {
        userGrowth: userGrowthData,
        jobTrends: jobTrendsData,
        topCompanies: topCompaniesData,
        recentActivity,
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 },
    );
  }
}
