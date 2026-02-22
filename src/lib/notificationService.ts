import {
  ExperienceLevel,
  NotificationType,
  Role,
  WorkMode,
} from '@prisma/client';
import prisma from './prisma';

interface NotifyUserParams {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string | null;
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata?: Record<string, any>;
}

interface NotifyRoleParams {
  role: Role;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata?: Record<string, any>;
}

export async function notifyUser({
  message,
  title,
  type,
  userId,
  link,
  metadata,
}: NotifyUserParams) {
  try {
    await prisma.notification.create({
      data: {
        type,
        title,
        message,
        link,
        metadata,
        userId,
      },
    });
    console.log('Notification sent successfully!', { userId, type, title });
  } catch (error) {
    console.error('Error sending notification:', error);
  }
}

export async function notifyRoleUser({
  message,
  title,
  role,
  type,
  link,
  metadata,
}: NotifyRoleParams) {
  try {
    const users = await prisma.user.findMany({
      where: {
        role,
      },
      select: { id: true },
    });

    if (users.length === 0) {
      console.log(`No users found with role ${role} to send notifications to.`);
      return;
    }

    await prisma.notification.createMany({
      data: users.map((user) => ({
        userId: user.id,
        type,
        title,
        message,
        link,
        metadata,
      })),
    });
  } catch (error) {
    console.error('❌ Failed to send notification to role:', error);
  }
}

export async function notifyMatchingJobSeekers({
  jobId,
  jobTitle,
  companyName,
  category,
  skills,
  experienceLevel,
  workMode,
  jobSlug,
}: {
  jobId: string;
  jobTitle: string;
  companyName: string;
  category: string;
  skills: string[];
  experienceLevel: string;
  workMode: string;
  jobSlug: string;
}) {
  try {
    const matchingProfiles = await prisma.profile.findMany({
      where: {
        OR: [
          { jobCategories: { has: category } },
          { skills: { hasSome: skills } },
          { yearsOfExperience: experienceLevel as ExperienceLevel },
          { preferredWorkMode: { has: workMode as WorkMode } },
        ],
        profileCompleted: { gte: 70 },
      },
      select: { userId: true },
    });

    if (matchingProfiles.length === 0) return;

    await prisma.notification.createMany({
      data: matchingProfiles.map((profile) => ({
        userId: profile.userId,
        type: 'NEW_JOB_POSTED',
        title: 'New Job Matches Your Profile',
        message: `${companyName} posted a new ${jobTitle} position that matches your skills!`,
        link: `/jobs/${jobSlug}`,
        metadata: {
          jobId,
          jobTitle,
          companyName,
        },
      })),
    });

    console.log(`✅ Notified ${matchingProfiles.length} matching job seekers`);
  } catch (error) {
    console.error('❌ Failed to notify job seekers:', error);
  }
}
