import { apiAuthGuard } from '@/src/lib/apiAuthGuard';
import prisma from '@/src/lib/prisma';
import { Role } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const guard = await apiAuthGuard([Role.JOB_SEEKER]);
    if (!guard.ok) return guard.response;

    const profile = await prisma.profile.findUnique({
      where: { userId: guard.session.user.id },
    });
    if (!profile)
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });

    const {
      institution,
      degree,
      fieldOfStudy,
      startYear,
      endYear,
      grade,
      isCurrent,
    } = await req.json();

    if (!institution || !degree || !startYear) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 },
      );
    }

    if (startYear < 1900 || startYear > new Date().getFullYear()) {
      return NextResponse.json(
        { error: 'Invalid start year' },
        { status: 400 },
      );
    }

    if (endYear && endYear < startYear) {
      return NextResponse.json(
        { error: 'End year cannot be before start year' },
        { status: 400 },
      );
    }

    if (isCurrent && endYear) {
      return NextResponse.json(
        { error: 'Current education cannot have an end year' },
        { status: 400 },
      );
    }

    const education = await prisma.education.create({
      data: {
        profileId: profile.id,
        institution,
        degree,
        fieldOfStudy: fieldOfStudy || null,
        startYear: Number(startYear),
        endYear: endYear ? Number(endYear) : null,
        grade: grade || null,
        isCurrent: isCurrent ?? false,
      },
    });

    return NextResponse.json({ success: true, education }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
