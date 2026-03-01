import { apiAuthGuard } from '@/src/lib/apiAuthGuard';
import prisma from '@/src/lib/prisma';
import { Role } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { pusherServer } from '@/src/lib/pusher';
import { getSignedUrl } from '@/src/lib/fileUpload';

const MAX_MESSAGE_LENGTH = 5000;

export async function POST(req: NextRequest) {
  try {
    const guard = await apiAuthGuard([Role.COMPANY_ADMIN, Role.JOB_SEEKER]);
    if (!guard.ok) return guard.response;

    const { conversationId, content } = await req.json();

    if (!conversationId || !content?.trim()) {
      return NextResponse.json(
        { error: 'Conversation ID and content required' },
        { status: 400 },
      );
    }

    if (content.trim().length > MAX_MESSAGE_LENGTH) {
      return NextResponse.json(
        { error: `Message too long (max ${MAX_MESSAGE_LENGTH} characters)` },
        { status: 400 },
      );
    }

    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
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

    const message = await prisma.message.create({
      data: {
        conversationId,
        senderId: guard.session.user.id,
        senderType: isCompany ? 'COMPANY' : 'JOB_SEEKER',
        content: content.trim(),
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            profile: {
              select: {
                avatar: true,
              },
            },
          },
        },
      },
    });

    let messageWithSignedAvatar = message;

    if (message.sender?.profile?.avatar) {
      const signedAvatar = await getSignedUrl(
        message.sender.profile.avatar,
        60 * 60 * 24 * 7,
      );

      messageWithSignedAvatar = {
        ...message,
        sender: {
          ...message.sender,
          profile: {
            ...message.sender.profile,
            avatar: signedAvatar,
          },
        },
      };
    }

    await prisma.conversation.update({
      where: { id: conversationId },
      data: { lastMessageAt: message.createdAt },
    });

    await pusherServer.trigger(
      `conversation-${conversationId}`,
      'new-message',
      { message },
    );

    return NextResponse.json(
      { message: messageWithSignedAvatar },
      { status: 201 },
    );
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
