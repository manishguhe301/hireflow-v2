import { apiAuthGuard } from '@/src/lib/apiAuthGuard';
import prisma from '@/src/lib/prisma';
import { Role } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const guard = await apiAuthGuard([Role.JOB_SEEKER]);
    if (!guard.ok) {
      return guard.response;
    }

    const stats = await prisma.application.groupBy({
      by: ['status'],
      where: {
        userId: guard.session.user.id,
      },
      _count: true,
    });

    const applicationStats = {
      total: stats.reduce((sum, s) => sum + s._count, 0),
      applied: stats.find((s) => s.status === 'APPLIED')?._count || 0,
      reviewing: stats.find((s) => s.status === 'REVIEWING')?._count || 0,
      shortlisted: stats.find((s) => s.status === 'SHORTLISTED')?._count || 0,
      interviewScheduled:
        stats.find((s) => s.status === 'INTERVIEW_SCHEDULED')?._count || 0,
      rejected: stats.find((s) => s.status === 'REJECTED')?._count || 0,
      offered: stats.find((s) => s.status === 'OFFERED')?._count || 0,
      hired: stats.find((s) => s.status === 'HIRED')?._count || 0,
    };

    return NextResponse.json({
      stats: applicationStats,
    });
  } catch (error) {
    console.error('Error fetching applications:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
