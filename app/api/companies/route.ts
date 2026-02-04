import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/src/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const search = searchParams.get('search') || '';
    const industry = searchParams.get('industry') || '';
    const country = searchParams.get('country') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const skip = (page - 1) * limit;

    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {
      status: 'APPROVED',
    };

    if (search) {
      where.name = {
        contains: search,
        mode: 'insensitive',
      };
    }

    if (industry) {
      where.industry = industry;
    }

    if (country) {
      where.country = {
        contains: country,
        mode: 'insensitive',
      };
    }

    const [companies, total] = await Promise.all([
      prisma.company.findMany({
        where,
        select: {
          id: true,
          name: true,
          logo: true,
          industry: true,
          country: true,
          companySize: true,
          _count: {
            select: {
              jobs: {
                where: {
                  status: 'ACTIVE',
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
      prisma.company.count({ where }),
    ]);

    const companiesWithJobCount = companies.map((company) => ({
      id: company.id,
      name: company.name,
      logo: company.logo,
      industry: company.industry,
      country: company.country,
      companySize: company.companySize,
      jobCount: company._count.jobs,
    }));

    return NextResponse.json({
      companies: companiesWithJobCount,
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
