import { NextResponse } from 'next/server';
import prisma from '@/src/lib/prisma';
import { Role } from '@prisma/client';
import { apiAuthGuard } from '@/src/lib/apiAuthGuard';

export async function GET() {
  try {
    const guard = await apiAuthGuard([Role.JOB_SEEKER]);
    if (!guard.ok) {
      return guard.response;
    }

    const profile = await prisma.profile.findUnique({
      where: {
        userId: guard.session.user.id,
      },
      include: {
        workExperience: {
          orderBy: [{ endDate: 'desc' }, { startDate: 'desc' }],
        },
        education: {
          orderBy: { startYear: 'desc' },
        },
        certifications: {
          orderBy: { issueDate: 'desc' },
        },
      },
    });

    return NextResponse.json({
      profile,
    });
  } catch (error) {
    console.error('Get Profile Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
