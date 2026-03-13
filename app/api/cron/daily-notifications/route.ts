import { notifyUser } from '@/src/lib/notificationService';
import prisma from '@/src/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const cronSecret = request.headers.get('x-cron-secret');
    const isLocalTest = process.env.NODE_ENV === 'development';

    if (cronSecret !== process.env.CRON_SECRET && !isLocalTest) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const today = new Date();
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(today.getDate() + 3);

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

    let savedJobNotificationsCreated = 0;

    await Promise.all(
      savedJobsExpiring.map(async (saved) => {
        const existingNotifications = await prisma.notification.findMany({
          where: {
            userId: saved.userId,
            type: 'JOB_DEADLINE_APPROACHING',
          },
        });

        const alreadyNotified = existingNotifications.some((notif) => {
          if (!notif.metadata) return false;
          const meta = notif.metadata as { jobId?: string };
          return meta.jobId === saved.job.id;
        });

        if (alreadyNotified) {
          console.log(
            `⏭️ Skipping: Notification already exists for job ${saved.job.id}`,
          );
          return;
        }

        await notifyUser({
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

        savedJobNotificationsCreated++;
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

    let jobClosingNotificationsCreated = 0;

    await Promise.all(
      jobsClosingSoon.map(async (job) => {
        const existingNotifications = await prisma.notification.findMany({
          where: {
            userId: job.company.userId,
            type: 'JOB_CLOSING_SOON',
          },
        });

        const alreadyNotified = existingNotifications.some((notif) => {
          if (!notif.metadata) return false;
          const meta = notif.metadata as { jobId?: string };
          return meta.jobId === job.id;
        });

        if (alreadyNotified) {
          console.log(
            `⏭️ Skipping: Notification already exists for job ${job.id}`,
          );
          return;
        }

        await notifyUser({
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

        jobClosingNotificationsCreated++;
      }),
    );

    return NextResponse.json({
      success: true,
      processed: {
        savedJobsExpiring: savedJobsExpiring.length,
        savedJobNotificationsCreated,
        jobsClosingSoon: jobsClosingSoon.length,
        jobClosingNotificationsCreated,
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
