import { NextResponse } from 'next/server';
import prisma from '@/src/lib/prisma';
import { Role } from '@prisma/client';
import { apiAuthGuard } from '@/src/lib/apiAuthGuard';
import { getSignedUrl } from '@/src/lib/fileUpload';

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
        workExperience: true,
        education: true,
        certifications: true,
      },
    });

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    const signedAvatar = await getSignedUrl(
      profile?.avatarPath as string,
      604800,
    );

    return NextResponse.json({
      profile: profile ? { ...profile, avatar: signedAvatar } : null,
    });
  } catch (error) {
    console.error('Get Profile Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
