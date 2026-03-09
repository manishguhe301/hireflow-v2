import { apiAuthGuard } from '@/src/lib/apiAuthGuard';
import prisma from '@/src/lib/prisma';
import { Role } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const guard = await apiAuthGuard([Role.JOB_SEEKER]);
    if (!guard.ok) return guard.response;

    const { id } = await params;
    const profile = await prisma.profile.findUnique({
      where: { userId: guard.session.user.id },
    });
    if (!profile)
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });

    const existing = await prisma.certification.findUnique({ where: { id } });
    if (!existing || existing.profileId !== profile.id) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const {
      name,
      organization,
      issueDate,
      expiryDate,
      credentialId,
      credentialUrl,
    } = await req.json();

    const updated = await prisma.certification.update({
      where: { id },
      data: {
        name,
        organization,
        issueDate: new Date(issueDate),
        expiryDate: expiryDate ? new Date(expiryDate) : null,
        credentialId: credentialId || null,
        credentialUrl: credentialUrl || null,
      },
    });

    return NextResponse.json({ success: true, certification: updated });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const guard = await apiAuthGuard([Role.JOB_SEEKER]);
    if (!guard.ok) return guard.response;

    const { id } = await params;
    const profile = await prisma.profile.findUnique({
      where: { userId: guard.session.user.id },
    });
    if (!profile)
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });

    const existing = await prisma.certification.findUnique({ where: { id } });
    if (!existing || existing.profileId !== profile.id) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    await prisma.certification.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
