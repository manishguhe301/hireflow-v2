import { apiAuthGuard } from '@/src/lib/apiAuthGuard';
import prisma from '@/src/lib/prisma';
import { Role } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { pusherServer } from '@/src/lib/pusher';

export async function POST(req: NextRequest) {
  try {
    const guard = await apiAuthGuard([Role.COMPANY_ADMIN]);
    if (!guard.ok) return guard.response;

    const { jobSeekerId, jobId } = await req.json();

    if (!jobSeekerId) {
      return NextResponse.json(
        { error: 'Job seeker ID required' },
        { status: 400 },
      );
    }

    const jobSeeker = await prisma.user.findUnique({
      where: { id: jobSeekerId, role: Role.JOB_SEEKER },
    });

    if (!jobSeeker) {
      return NextResponse.json(
        { error: 'Job seeker not found' },
        { status: 404 },
      );
    }

    const company = await prisma.company.findUnique({
      where: { userId: guard.session.user.id },
      select: { id: true, name: true },
    });

    if (!company) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 });
    }

    const existing = await prisma.conversation.findFirst({
      where: {
        companyId: company.id,
        jobSeekerId,
        jobId: jobId || null,
      },
      select: { id: true },
    });

    if (existing) {
      return NextResponse.json(
        { conversationId: existing.id, existed: true },
        { status: 200 },
      );
    }

    const conversation = await prisma.conversation.create({
      data: {
        companyId: company.id,
        jobSeekerId,
        jobId: jobId || null,
      },
      select: { id: true },
    });

    await pusherServer.trigger(`user-${jobSeekerId}`, 'new-conversation', {
      conversationId: conversation.id,
    });

    return NextResponse.json(
      { conversationId: conversation.id, existed: false },
      { status: 201 },
    );
  } catch (error) {
    console.error('Error creating conversation:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
