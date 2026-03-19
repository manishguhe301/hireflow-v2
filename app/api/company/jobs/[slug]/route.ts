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
      select: { id: true },
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

    if (job.companyId !== companyExists.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    return NextResponse.json({ job });
  } catch (error) {
    console.error('Error fetching company:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
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
      return NextResponse.json(
        { error: 'Company profile not found' },
        { status: 404 },
      );
    }

    const { slug } = await params;

    if (!slug) {
      return NextResponse.json({ error: 'Slug not found' }, { status: 404 });
    }

    const existingJob = await prisma.job.findUnique({
      where: { slug },
      include: {
        _count: { select: { applications: true } },
      },
    });

    if (!existingJob) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    if (existingJob.companyId !== company.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    if (existingJob._count.applications > 0) {
      await prisma.job.update({
        where: { slug },
        data: { status: 'CLOSED' },
      });

      return NextResponse.json({
        success: true,
        message: `Job closed successfully. Cannot delete jobs with ${existingJob._count.applications} application(s).`,
        action: 'closed',
        jobStatus: 'CLOSED',
      });
    } else {
      await prisma.job.delete({
        where: {
          id: existingJob.id,
          slug,
        },
      });

      return NextResponse.json({
        success: true,
        message: 'Job deleted successfully',
        action: 'deleted',
      });
    }
  } catch (error) {
    console.error('Error deleting job:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
