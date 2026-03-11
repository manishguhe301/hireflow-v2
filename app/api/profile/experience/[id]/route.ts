import { apiAuthGuard } from '@/src/lib/apiAuthGuard';
import prisma from '@/src/lib/prisma';
import { Role, WorkMode } from '@prisma/client';
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

    const existing = await prisma.workExperience.findUnique({ where: { id } });
    if (!existing || existing.profileId !== profile.id) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const {
      company,
      title,
      location,
      workMode,
      startDate,
      endDate,
      description,
      isCurrent,
    } = await req.json();

    if (!company || !title || !workMode || !startDate) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 },
      );
    }

    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : null;

    if (isNaN(start.getTime())) {
      return NextResponse.json(
        { error: 'Invalid start date' },
        { status: 400 },
      );
    }

    if (end && end < start) {
      return NextResponse.json(
        { error: 'End date cannot be before start date' },
        { status: 400 },
      );
    }

    if (isCurrent && endDate) {
      return NextResponse.json(
        { error: 'Current job cannot have end date' },
        { status: 400 },
      );
    }

    const current = isCurrent ?? false;

    if (!current && !endDate) {
      return NextResponse.json(
        { error: 'End date required if job is not current' },
        { status: 400 },
      );
    }

    if (!Object.values(WorkMode).includes(workMode)) {
      return NextResponse.json({ error: 'Invalid work mode' }, { status: 400 });
    }

    const updated = await prisma.workExperience.update({
      where: { id },
      data: {
        company,
        title,
        location: location || null,
        workMode: workMode as WorkMode,
        startDate: start,
        endDate: end,
        description: description || null,
        isCurrent: current,
      },
    });

    return NextResponse.json({ success: true, experience: updated });
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

    const existing = await prisma.workExperience.findUnique({ where: { id } });
    if (!existing || existing.profileId !== profile.id) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    await prisma.workExperience.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
