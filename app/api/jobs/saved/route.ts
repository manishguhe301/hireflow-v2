import { apiAuthGuard } from '@/src/lib/apiAuthGuard';
import prisma from '@/src/lib/prisma';
import { Role } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const guard = await apiAuthGuard([Role.JOB_SEEKER]);
    if (!guard.ok) return guard.response;

    const { jobId } = await req.json();

    if (!jobId) {
      return NextResponse.json({ error: 'Job ID required' }, { status: 400 });
    }

    const job = await prisma.job.findFirst({
      where: {
        id: jobId,
        status: 'ACTIVE',
        OR: [
          { applicationDeadline: null },
          { applicationDeadline: { gte: new Date() } },
        ],
      },
    });

    if (!job) {
      return NextResponse.json(
        { error: 'Job not found or inactive' },
        { status: 404 },
      );
    }

    const existing = await prisma.savedJob.findUnique({
      where: {
        userId_jobId: {
          userId: guard.session.user.id,
          jobId,
        },
      },
    });

    if (existing) {
      return NextResponse.json({ error: 'Job already saved' }, { status: 400 });
    }

    const savedJob = await prisma.savedJob.create({
      data: {
        userId: guard.session.user.id,
        jobId,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Job saved successfully',
      // savedJob,
    });
  } catch (error) {
    console.error('Error saving job:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const guard = await apiAuthGuard([Role.JOB_SEEKER]);
    if (!guard.ok) return guard.response;

    const { searchParams } = new URL(req.url);
    const jobId = searchParams.get('jobId');

    if (!jobId) {
      return NextResponse.json({ error: 'Job ID required' }, { status: 400 });
    }

    const savedJob = await prisma.savedJob.findUnique({
      where: {
        userId_jobId: {
          userId: guard.session.user.id,
          jobId,
        },
      },
    });

    if (!savedJob) {
      return NextResponse.json(
        { error: 'Saved job not found' },
        { status: 404 },
      );
    }

    await prisma.savedJob.delete({
      where: { id: savedJob.id },
    });

    return NextResponse.json({
      success: true,
      message: 'Job removed from saved',
    });
  } catch (error) {
    console.error('Error removing saved job:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const guard = await apiAuthGuard([Role.JOB_SEEKER]);
    if (!guard.ok) return guard.response;

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const skip = (page - 1) * limit;

    const [savedJobs, total] = await Promise.all([
      prisma.savedJob.findMany({
        where: { userId: guard.session.user.id },
        select: {
          id: true,
          createdAt: true,
          job: {
            select: {
              id: true,
              title: true,
              category: true,
              company: {
                select: {
                  name: true,
                  logo: true,
                  website: true,
                  id: true,
                },
              },
              country: true,
              city: true,
              workMode: true,
              employmentType: true,
              applicationDeadline: true,
              experienceLevel: true,
              numberOfOpenings: true,
              slug: true,
              salaryMax: true,
              salaryMin: true,
              createdAt: true,
              updatedAt: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.savedJob.count({
        where: { userId: guard.session.user.id },
      }),
    ]);

    return NextResponse.json({
      savedJobs: savedJobs.map((s) => ({
        savedAt: s.createdAt,
        ...s.job,
        isSaved: true,
      })),
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching saved jobs:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
