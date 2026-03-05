import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/src/lib/prisma';
import { Role } from '@prisma/client';
import { apiAuthGuard } from '@/src/lib/apiAuthGuard';
import { getSignedUrl } from '@/src/lib/fileUpload';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string; applicationId: string }> },
) {
  try {
    const guard = await apiAuthGuard([Role.COMPANY_ADMIN]);
    if (!guard.ok) {
      return guard.response;
    }

    const { slug, applicationId } = await params;

    const company = await prisma.company.findUnique({
      where: { userId: guard.session.user.id },
      select: { id: true },
    });

    if (!company) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 });
    }

    const job = await prisma.job.findUnique({
      where: { slug },
      select: {
        id: true,
        title: true,
        companyId: true,
      },
    });

    if (!job || job.companyId !== company.id) {
      return NextResponse.json(
        { error: 'Unauthorized or job not found' },
        { status: 403 },
      );
    }

    const application = await prisma.application.findUnique({
      where: {
        id: applicationId,
      },
    });

    const profile = await prisma.profile.findUnique({
      where: {
        userId: application?.userId || '',
      },
      include: {
        workExperience: true,
        education: true,
        certifications: true,
      },
    });

    if (!application || application.jobId !== job.id) {
      return NextResponse.json(
        { error: 'Application not found for this job' },
        { status: 404 },
      );
    }

    const profileWithAvatar = await getSignedUrl(
      profile?.avatar as string,
      604800,
    );

    return NextResponse.json({
      job: {
        id: job.id,
        title: job.title,
      },
      application,
      profile: { ...profile, avatar: profileWithAvatar },
    });
  } catch (error) {
    console.error('Get Application Details Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
