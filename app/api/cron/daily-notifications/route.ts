import { notifyUser } from '@/src/lib/notificationService';
import prisma from '@/src/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('user-agent');

    const isLocalTest = process.env.NODE_ENV === 'development';
    const isVercelCron = authHeader?.includes('vercel-cron');

    if (!isVercelCron && !isLocalTest) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const today = new Date();
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(today.getDate() + 3);
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 7);

    const savedJobsExpiring = await prisma.savedJob.findMany({
      where: {
        job: {
          applicationDeadline: {
            gte: today,
            lte: threeDaysFromNow,
          },
          status: 'ACTIVE',
        },
      },
      include: {
        job: {
          select: {
            id: true,
            title: true,
            slug: true,
            applicationDeadline: true,
            company: { select: { name: true } },
          },
        },
      },
    });

    await Promise.all(
      savedJobsExpiring.map((saved) => {
        return notifyUser({
          userId: saved.userId,
          type: 'JOB_DEADLINE_APPROACHING',
          title: 'Job Deadline Approaching',
          message: `The deadline for ${saved.job.title} at ${saved.job.company.name} is in 3 days!`,
          link: `/jobs/${saved.job.slug}`,
          metadata: {
            jobId: saved.job.id,
            deadline: saved.job.applicationDeadline,
          },
        });
      }),
    );

    const jobsClosingSoon = await prisma.job.findMany({
      where: {
        applicationDeadline: {
          gte: today,
          lte: threeDaysFromNow,
        },
        status: 'ACTIVE',
      },
      include: {
        company: { select: { userId: true, name: true } },
      },
    });

    await Promise.all(
      jobsClosingSoon.map((job) => {
        return notifyUser({
          userId: job.company.userId,
          type: 'JOB_CLOSING_SOON',
          title: 'Job Closing Soon',
          message: `Your job posting "${job.title}" closes in 3 days.`,
          link: `/company/jobs/${job.slug}`,
          metadata: {
            jobId: job.id,
            deadline: job.applicationDeadline,
          },
        });
      }),
    );

    return NextResponse.json({
      success: true,
      processed: {
        jobDeadlines: savedJobsExpiring.length,
        jobsClosing: jobsClosingSoon.length,
      },
    });
  } catch (error) {
    console.error('Cron job error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
