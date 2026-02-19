import { apiAuthGuard } from '@/src/lib/apiAuthGuard';
import { getSignedUrl } from '@/src/lib/fileUpload';
import prisma from '@/src/lib/prisma';
import { Role } from '@prisma/client';
import { NextResponse } from 'next/server';

export async function GET() {
  const guard = await apiAuthGuard([Role.JOB_SEEKER, Role.COMPANY_ADMIN]);
  if (!guard.ok) return guard.response;

  const profile = await prisma.profile.findUnique({
    where: { userId: guard.session.user.id },
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
