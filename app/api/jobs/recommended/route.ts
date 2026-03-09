import { apiAuthGuard } from '@/src/lib/apiAuthGuard';
import prisma from '@/src/lib/prisma';
import { Role } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const guard = await apiAuthGuard([Role.JOB_SEEKER]);
    if (!guard.ok) return guard.response;

    const profile = await prisma.profile.findUnique({
      where: { userId: guard.session.user.id },
      select: {
        skills: true,
        jobCategories: true,
        preferredLocations: true,
        preferredWorkMode: true,
        yearsOfExperience: true,
      },
    });

    if (!profile) {
      return NextResponse.json({ jobs: [] });
    }

    const appliedJobIds = (
      await prisma.application.findMany({
        where: { userId: guard.session.user.id },
        select: { jobId: true },
      })
    ).map((a) => a.jobId);

    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {
      status: 'ACTIVE',
      id: { notIn: appliedJobIds },
      AND: [
        {
          OR: [
            { applicationDeadline: null },
            { applicationDeadline: { gte: new Date() } },
          ],
        },
      ],
    };

    const skillMatches =
      profile.skills.length > 0
        ? {
            skills: { hasSome: profile.skills },
          }
        : undefined;

    const categoryMatches =
      profile.jobCategories.length > 0
        ? {
            category: { in: profile.jobCategories },
          }
        : undefined;

    const workModeMatches =
      profile.preferredWorkMode.length > 0
        ? {
            workMode: { in: profile.preferredWorkMode },
          }
        : undefined;

    const experienceMatches = profile.yearsOfExperience
      ? {
          experienceLevel: profile.yearsOfExperience,
        }
      : undefined;

    const orConditions = [
      skillMatches,
      categoryMatches,
      workModeMatches,
      experienceMatches,
    ].filter(Boolean);

    if (orConditions.length > 0) {
      where.OR = orConditions;
    }

    const jobs = await prisma.job.findMany({
      where,
      select: {
        id: true,
        title: true,
        slug: true,
        category: true,
        workMode: true,
        employmentType: true,
        experienceLevel: true,
        country: true,
        city: true,
        salaryMin: true,
        salaryMax: true,
        applicationDeadline: true,
        numberOfOpenings: true,
        createdAt: true,
        updatedAt: true,
        company: {
          select: {
            id: true,
            name: true,
            logo: true,
          },
        },
      },
      take: 6,
      orderBy: { createdAt: 'desc' },
    });

    let savedJobIds: string[] = [];
    if (guard?.session.user.id) {
      savedJobIds = (
        await prisma.savedJob.findMany({
          where: { userId: guard.session.user.id },
          select: { jobId: true },
        })
      ).map((s) => s.jobId);
    }

    return NextResponse.json({
      jobs: jobs.map((job) => ({
        ...job,
        isSaved: savedJobIds.includes(job.id),
      })),
    });
  } catch (error) {
    console.error('Error fetching recommended jobs:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
