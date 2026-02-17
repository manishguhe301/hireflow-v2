import { authOptions } from '@/src/lib/auth';
import prisma from '@/src/lib/prisma';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const country = searchParams.get('country') || '';
    const workModes = searchParams.get('workModes') || '';
    const employmentTypes = searchParams.get('employmentTypes') || '';
    const experienceLevels = searchParams.get('experienceLevels') || '';
    const salaryMin = searchParams.get('salaryMin') || '';
    const salaryMax = searchParams.get('salaryMax') || '';
    const datePosted = searchParams.get('datePosted') || '';
    const sortBy = searchParams.get('sortBy') || 'recent';

    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const skip = (page - 1) * limit;

    const session = await getServerSession(authOptions);

    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {
      status: 'ACTIVE',
      AND: [
        {
          OR: [
            { applicationDeadline: null },
            { applicationDeadline: { gte: new Date() } },
          ],
        },
      ],
    };

    if (search) {
      where.AND.push({
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { skills: { has: search } },
          {
            company: {
              is: { name: { contains: search, mode: 'insensitive' } },
            },
          },
        ],
      });
    }

    if (category) {
      where.category = category;
    }

    if (country) {
      where.AND.push({
        OR: [
          { country: { contains: country, mode: 'insensitive' } },
          { city: { contains: country, mode: 'insensitive' } },
        ],
      });
    }

    if (workModes) {
      where.workMode = { in: workModes.split(',') };
    }

    if (employmentTypes) {
      where.employmentType = { in: employmentTypes.split(',') };
    }

    if (experienceLevels) {
      where.experienceLevel = { in: experienceLevels.split(',') };
    }

    if (salaryMin) {
      where.salaryMin = { gte: parseInt(salaryMin) };
    }

    if (salaryMax) {
      where.salaryMax = { lte: parseInt(salaryMax) };
    }

    if (datePosted) {
      const now = new Date();
      if (datePosted === '24h') {
        where.createdAt = {
          gte: new Date(now.getTime() - 24 * 60 * 60 * 1000),
        };
      } else if (datePosted === 'week') {
        where.createdAt = {
          gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
        };
      } else if (datePosted === 'month') {
        where.createdAt = {
          gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
        };
      }
    }

    if (session?.user?.id) {
      const appliedJobIds = await prisma.application.findMany({
        where: { userId: session.user.id },
        select: { jobId: true },
      });

      if (appliedJobIds.length > 0) {
        where.id = {
          notIn: appliedJobIds.map((a) => a.jobId),
        };
      }
    }

    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    let orderBy: any = { createdAt: 'desc' };
    if (sortBy === 'salary_high') {
      orderBy = { salaryMax: 'desc' };
    } else if (sortBy === 'salary_low') {
      orderBy = { salaryMin: 'asc' };
    }

    const [jobs, total] = await Promise.all([
      prisma.job.findMany({
        where,
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
          _count: true,
        },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.job.count({ where }),
    ]);

    return NextResponse.json({
      jobs,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching companies:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
