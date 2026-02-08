import { apiAuthGuard } from '@/src/lib/apiAuthGuard';
import prisma from '@/src/lib/prisma';
import { Role } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const guard = await apiAuthGuard([Role.COMPANY_ADMIN]);
    if (!guard.ok) {
      return guard.response;
    }

    const company = await prisma.company.findUnique({
      where: { userId: guard.session.user.id },
    });

    if (!company) {
      return NextResponse.json(
        {
          error:
            'Company profile not found. ',
        },
        { status: 404 },
      );
    }

    const { slug } = await params;

    if (!slug) {
      return NextResponse.json({ error: 'Slug not found' }, { status: 404 });
    }

    const job = await prisma.job.findUnique({
      where: {
        slug,
      },
    });

    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    return NextResponse.json({ job: job });
  } catch (error) {
    console.error('Error fetching company:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
