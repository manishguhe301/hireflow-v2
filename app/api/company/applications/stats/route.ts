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

    const groupedStats = await prisma.application.groupBy({
      by: ['status'],
      where: {
        jobId: { in: jobIds },
      },
      _count: true,
    });

    const totalApplications = groupedStats.reduce(
      (sum, s) => sum + s._count,
      0,
    );
    if (jobIds.length === 0) {
      return NextResponse.json({
        stats: {
          total: 0,
          reviewing: 0,
          shortlisted: 0,
          interviewScheduled: 0,
          rejected: 0,
          hired: 0,
        },
      });
    }

    const stats = {
      total: totalApplications,
      reviewing:
        groupedStats.find((s) => s.status === 'REVIEWING')?._count || 0,
      shortlisted:
        groupedStats.find((s) => s.status === 'SHORTLISTED')?._count || 0,
      interviewScheduled:
        groupedStats.find((s) => s.status === 'INTERVIEW_SCHEDULED')?._count ||
        0,
      rejected: groupedStats.find((s) => s.status === 'REJECTED')?._count || 0,
      hired: groupedStats.find((s) => s.status === 'HIRED')?._count || 0,
    };

    return NextResponse.json({
      stats,
    });
  } catch (error) {
    console.error('Error fetching applications stats:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
