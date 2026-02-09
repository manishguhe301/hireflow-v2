import { apiAuthGuard } from '@/src/lib/apiAuthGuard';
import prisma from '@/src/lib/prisma';
import { Role } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const guard = await apiAuthGuard([Role.COMPANY_ADMIN]);
    if (!guard.ok) {
      return guard.response;
    }

    const companyExists = await prisma.company.findUnique({
      where: { userId: guard.session.user.id },
    });

    if (!companyExists) {
      return NextResponse.json(
        {
          error: 'Company profile not found. ',
        },
        { status: 404 },
      );
    }

    const { searchParams } = new URL(req.url);

    const company = searchParams.get('company') === 'true';
    const savedJobs = searchParams.get('savedJobs') === 'true';
    const applications = searchParams.get('applications') === 'true';
    const counts = searchParams.get('counts') === 'true';

    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    const include: any = {};

    if (company) {
      include.company = true;
    }

    if (counts) {
      include._count = {
        select: {
          applications: true,
          ...(savedJobs && { savedJobs: true }),
        },
      };
    }

    if (applications) {
      include.applications = {
        select: {
          id: true,
          status: true,
          createdAt: true,
        },
      };
    }

    const { slug } = await params;

    if (!slug) {
      return NextResponse.json({ error: 'Slug not found' }, { status: 404 });
    }

    const job = await prisma.job.findUnique({
      where: {
        slug,
      },
      include,
    });

    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    return NextResponse.json({ job: job });
  } catch (error) {
    console.error('Error fetching company:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
