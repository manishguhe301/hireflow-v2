import { apiAuthGuard } from '@/src/lib/apiAuthGuard';
import { uploadFileToSupabase } from '@/src/lib/fileUpload';
import prisma from '@/src/lib/prisma';
import { Role } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const guard = await apiAuthGuard([Role.JOB_SEEKER]);
    if (!guard.ok) {
      return guard.response;
    }

    const formData = await req.formData();
    const jobId = formData.get('jobId') as string;
    const coverLetter = formData.get('coverLetter') as string;
    const resumeUrl = formData.get('resumeUrl') as string;
    const customResume = formData.get('customResume') as File | null;

    if (!jobId) {
      return NextResponse.json(
        {
          error: 'Job ID is required',
        },
        { status: 400 },
      );
    }

    const job = await prisma.job.findUnique({
      where: { id: jobId, status: 'ACTIVE' },
      select: {
        id: true,
        applicationDeadline: true,
        title: true,
        company: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!job) {
      return NextResponse.json(
        {
          error: 'Job not found or no longer accepting applications',
        },
        { status: 404 },
      );
    }

    if (
      job.applicationDeadline &&
      new Date(job.applicationDeadline) < new Date()
    ) {
      return NextResponse.json(
        { error: 'Application deadline has passed' },
        { status: 400 },
      );
    }

    // Check if already applied
    const existingApplication = await prisma.application.findUnique({
      where: {
        userId_jobId: {
          userId: guard.session.user.id,
          jobId,
        },
      },
    });

    if (existingApplication) {
      return NextResponse.json(
        {
          error: 'You have already applied for this job',
        },
        { status: 400 },
      );
    }

    let finalResumeUrl: string = '';

    if (customResume && customResume instanceof File) {
      const uploadResult = await uploadFileToSupabase(
        customResume,
        'user-resumes',
      );
      finalResumeUrl = uploadResult.url;
    } else if (resumeUrl) {
      finalResumeUrl = resumeUrl;
    } else {
      return NextResponse.json(
        {
          error: 'Resume is required for applying to a job',
        },
        { status: 400 },
      );
    }

    const application = await prisma.application.create({
      data: {
        userId: guard.session.user.id,
        jobId,
        resumeUrl: finalResumeUrl,
        coverLetter: coverLetter || null,
        status: 'APPLIED',
        statusHistory: [
          {
            status: 'APPLIED',
            date: new Date().toISOString(),
          },
        ],
      },
      include: {
        job: {
          select: {
            title: true,
            slug: true,
            company: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: `You have successfully applied for ${job.title} at ${job.company.name}.`,
        application: {
          id: application.id,
          jobTitle: application.job.title,
          jobSlug: application.job.slug,
          companyName: application.job.company.name,
          appliedAt: application.createdAt,
          status: application.status,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error('Error creating application:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const guard = await apiAuthGuard([Role.JOB_SEEKER]);
    if (!guard.ok) {
      return guard.response;
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {
      userId: guard.session.user.id,
    };

    if (status) {
      where.status = status;
    }

    const [applications, total] = await Promise.all([
      prisma.application.findMany({
        where,
        select: {
          id: true,
          status: true,
          coverLetter: true,
          resumeUrl: true,
          createdAt: true,
          updatedAt: true,
          statusHistory: true,
          job: {
            select: {
              id: true,
              title: true,
              slug: true,
              category: true,
              workMode: true,
              employmentType: true,
              experienceLevel: true,
              salaryMin: true,
              salaryMax: true,
              status: true,
              company: {
                select: {
                  id: true,
                  name: true,
                  logo: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      prisma.application.count({ where }),
    ]);

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
      applications,
      stats: applicationStats,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching applications:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
