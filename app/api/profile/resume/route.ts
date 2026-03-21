import { apiAuthGuard } from '@/src/lib/apiAuthGuard';
import { getSignedUrl } from '@/src/lib/fileUpload';
import prisma from '@/src/lib/prisma';
import { Role } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const guard = await apiAuthGuard([
      Role.JOB_SEEKER,
      Role.COMPANY_ADMIN,
      Role.PLATFORM_ADMIN,
    ]);
    if (!guard.ok) return guard.response;

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (guard.session.user.role === Role.COMPANY_ADMIN) {
      if (!id) {
        return NextResponse.json(
          { error: 'User ID required' },
          { status: 400 },
        );
      }

      const company = await prisma.company.findUnique({
        where: { userId: guard.session.user.id },
      });

      if (!company) {
        return NextResponse.json(
          { error: 'Company not found' },
          { status: 404 },
        );
      }

      const application = await prisma.application.count({
        where: {
          userId: id,
          job: {
            companyId: company?.id,
          },
        },
      });

      if (application === 0) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
      }
    }

    const profile = await prisma.profile.findUnique({
      where: {
        userId:
          guard.session.user.role === Role.JOB_SEEKER
            ? guard.session.user.id
            : (id as string),
      },
    });

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    const filePath = profile.resumePath;

    if (!filePath) {
      return NextResponse.json({ error: 'Resume not found' }, { status: 404 });
    }

    const signedUrl = await getSignedUrl(filePath);

    return NextResponse.json({ url: signedUrl });
  } catch (error) {
    console.error('Resume fetch error:', error);

    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
