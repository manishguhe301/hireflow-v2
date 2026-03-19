import { apiAuthGuard } from '@/src/lib/apiAuthGuard';
import prisma from '@/src/lib/prisma';
import { pusherServer } from '@/src/lib/pusher';
import { Role } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const guard = await apiAuthGuard([Role.COMPANY_ADMIN, Role.JOB_SEEKER]);
    if (!guard.ok) return guard.response;

    const { id } = await params;

    const conversation = await prisma.conversation.findUnique({
      where: { id },
      select: {
        companyId: true,
        jobSeekerId: true,
        company: {
          select: { userId: true },
        },
      },
    });

    if (!conversation) {
      return NextResponse.json(
        { error: 'Conversation not found' },
        { status: 404 },
      );
    }

    const isCompany = guard.session.user.role === Role.COMPANY_ADMIN;

    const hasAccess = isCompany
      ? conversation.company.userId === guard.session.user.id
      : conversation.jobSeekerId === guard.session.user.id;

    if (!hasAccess) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await prisma.conversation.delete({ where: { id } });

    const recipientId = isCompany
      ? conversation.jobSeekerId
      : conversation.company.userId;

    await Promise.all([
      pusherServer.trigger(
        `user-messages-${recipientId}`,
        'conversation-deleted',
        { conversationId: id },
      ),
      pusherServer.trigger(
        `user-messages-${guard.session.user.id}`,
        'conversation-deleted',
        { conversationId: id },
      ),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete conversation error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
