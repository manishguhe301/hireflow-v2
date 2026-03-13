import { apiAuthGuard } from '@/src/lib/apiAuthGuard';
import prisma from '@/src/lib/prisma';
import { Role } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;

    const guard = await apiAuthGuard([Role.COMPANY_ADMIN]);
    if (!guard.ok) {
      return guard.response;
    }

    const { searchParams } = new URL(req.url);

    if (!slug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
    }

    const status = searchParams.get('status') || '';
    const search = searchParams.get('search') || '';
    const sortBy = searchParams.get('sortBy') || 'recent';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    const company = await prisma.company.findUnique({
      where: { userId: guard.session.user.id },
      select: { id: true },
    });

    if (!company) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 });
    }

    const job = await prisma.job.findUnique({
      where: { slug, companyId: company.id },
      select: {
        id: true,
        title: true,
        companyId: true,
      },
    });

    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    if (job.companyId !== company.id) {
      return NextResponse.json(
        { error: 'Unauthorized - Job does not belong to your company' },
        { status: 403 },
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {
      jobId: job.id,
    };

    if (status) {
      where.status = status;
    }

    if (search) {
      where.user = {
        profile: {
          name: {
            contains: search,
            mode: 'insensitive',
          },
        },
      };
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let orderBy: any = { createdAt: 'desc' };
    if (sortBy === 'name') {
      orderBy = { user: { profile: { name: 'asc' } } };
    } else if (sortBy === 'oldest') {
      orderBy = { createdAt: 'asc' };
    }

    const [applications, total] = await Promise.all([
      prisma.application.findMany({
        where,
        select: {
          id: true,
          status: true,
          resumeUrl: true,
          coverLetter: true,
          createdAt: true,
          updatedAt: true,
          statusHistory: true,
          user: {
            select: {
              id: true,
              email: true,
              profile: {
                select: {
                  name: true,
                  phone: true,
                  city: true,
                  country: true,
                  avatar: true,
                  yearsOfExperience: true,
                  skills: true,
                  professionalTitle: true,
                  currentEmployment: true,
                },
              },
            },
          },
        },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.application.count({ where }),
    ]);

    const statusStats = await prisma.application.groupBy({
      by: ['status'],
      where: {
        jobId: job.id,
        job: {
          slug: slug,
        },
      },
      _count: true,
    });

    const stats = {
      total: statusStats.reduce((sum, s) => sum + s._count, 0),
      applied: statusStats.find((s) => s.status === 'APPLIED')?._count || 0,
      reviewing: statusStats.find((s) => s.status === 'REVIEWING')?._count || 0,
      shortlisted:
        statusStats.find((s) => s.status === 'SHORTLISTED')?._count || 0,
      interviewScheduled:
        statusStats.find((s) => s.status === 'INTERVIEW_SCHEDULED')?._count ||
        0,
      rejected: statusStats.find((s) => s.status === 'REJECTED')?._count || 0,
      offered: statusStats.find((s) => s.status === 'OFFERED')?._count || 0,
      hired: statusStats.find((s) => s.status === 'HIRED')?._count || 0,
      onHold: statusStats.find((s) => s.status === 'ON_HOLD')?._count || 0,
    };

    return NextResponse.json({
      job: {
        id: job.id,
        title: job.title,
      },
      applications,
      stats,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching job applicants:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
