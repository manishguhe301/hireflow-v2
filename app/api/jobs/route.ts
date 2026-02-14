import prisma from '@/src/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const country = searchParams.get('country') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const skip = (page - 1) * limit;

    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {
      status: 'ACTIVE',
    };

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { skills: { has: search } },
        {
          company: { is: { name: { contains: search, mode: 'insensitive' } } },
        },
      ];
    }

    if (category) {
      where.category = category;
    }

    if (country) {
      where.country = {
        contains: country,
        mode: 'insensitive',
      };
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
        orderBy: {
          createdAt: 'desc',
        },
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
