import { NextResponse } from 'next/server';
import prisma from '@/src/lib/prisma';
import { Role } from '@prisma/client';
import { apiAuthGuard } from '@/src/lib/apiAuthGuard';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const guard = await apiAuthGuard([
      Role.JOB_SEEKER,
      Role.COMPANY_ADMIN,
      Role.PLATFORM_ADMIN,
    ]);
    if (!guard.ok) {
      return guard.response;
    }

    const { id } = await params;

    const profile = await prisma.profile.findUnique({
      where: {
        userId: id,
      },
      include: {
        workExperience: true,
        education: true,
        certifications: true,
      },
    });

    return NextResponse.json({
      profile: profile || null,
    });
  } catch (error) {
    console.error('Get Profile Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
