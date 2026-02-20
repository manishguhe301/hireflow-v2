import { apiAuthGuard } from '@/src/lib/apiAuthGuard';
import { getSignedUrl } from '@/src/lib/fileUpload';
import prisma from '@/src/lib/prisma';
import { Role } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const guard = await apiAuthGuard([Role.JOB_SEEKER, Role.COMPANY_ADMIN]);
  if (!guard.ok) return guard.response;

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

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

  let filePath: string | null = null;

  if (profile.resumePath) {
    filePath = profile.resumePath;
  }

  if (!filePath) {
    return NextResponse.json({ error: 'Resume not found' }, { status: 404 });
  }

  const signedUrl = await getSignedUrl(filePath, 'user-resumes');

  return NextResponse.json({ url: signedUrl });
}
