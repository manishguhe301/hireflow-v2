import { apiAuthGuard } from '@/src/lib/apiAuthGuard';
import prisma from '@/src/lib/prisma';
import { generateSlug } from '@/src/utils/helper';
import {
  EmploymentType,
  ExperienceLevel,
  JobStatus,
  Role,
  WorkMode,
} from '@prisma/client';
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

async function generateUniqueSlug(title: string): Promise<string> {
  const baseSlug = generateSlug(title).substring(0, 50);

  const randomString = Math.random().toString(36).substring(2, 8);
  const slug = `${baseSlug}-${randomString}`;

  const existing = await prisma.job.findUnique({ where: { slug } });
  if (existing) {
    return generateUniqueSlug(title);
  }

  return slug;
}



export async function DELETE(req: NextRequest) {
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
        { error: 'Company profile not found' },
        { status: 404 },
      );
    }

    const { searchParams } = new URL(req.url);
    const jobId = searchParams.get('jobId');

    if (!jobId) {
      return NextResponse.json(
        { error: 'Job ID is required' },
        { status: 400 },
      );
    }

    const existingJob = await prisma.job.findUnique({
      where: { id: jobId },
      include: {
        _count: {
          select: {
            applications: true,
          },
        },
      },
    });

    if (!existingJob) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    if (existingJob.companyId !== company.id) {
      return NextResponse.json(
        { error: 'Unauthorized: This job does not belong to your company' },
        { status: 403 },
      );
    }

    if (existingJob._count.applications > 0) {
      return NextResponse.json(
        {
          error: `Cannot delete job with ${existingJob._count.applications} application(s). Consider closing the job instead.`,
        },
        { status: 400 },
      );
    }

    await prisma.job.delete({
      where: { id: jobId },
    });

    return NextResponse.json({
      success: true,
      message: 'Job deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting job:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
