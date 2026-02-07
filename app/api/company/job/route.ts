import { apiAuthGuard } from '@/src/lib/apiAuthGuard';
import prisma from '@/src/lib/prisma';
import { JobStatus, Role } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const guard = await apiAuthGuard([Role.COMPANY_ADMIN]);
    if (!guard.ok) {
      return guard.response;
    }

    const company = await prisma.company.findUnique({
      where: { userId: guard.session.user.id },
    });

    if (!company) {
      return NextResponse.json(
        {
          error:
            'Company profile not found. Please create your company profile first.',
        },
        { status: 404 },
      );
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') as JobStatus | null;

    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {
      companyId: company.id,
    };

    if (status) {
      where.status = status;
    }

    const jobs = await prisma.job.findMany({
      where,
      include: {
        _count: {
          select: {
            applications: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({
      success: true,
      jobs,
      total: jobs.length,
    });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
