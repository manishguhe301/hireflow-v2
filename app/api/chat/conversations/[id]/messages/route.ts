import { apiAuthGuard } from '@/src/lib/apiAuthGuard';
import { getCachedSignedUrl } from '@/src/lib/fileUpload';
import prisma from '@/src/lib/prisma';
import { Role } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const guard = await apiAuthGuard([Role.COMPANY_ADMIN, Role.JOB_SEEKER]);
    if (!guard.ok) return guard.response;

    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const skip = (page - 1) * limit;

    const conversation = await prisma.conversation.findUnique({
      where: { id },
      select: {
        companyId: true,
        jobSeekerId: true,
        company: { select: { userId: true } },
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

    const [messages, total] = await Promise.all([
      prisma.message.findMany({
        where: { conversationId: id },
        include: {
          sender: {
            select: {
              id: true,
              name: true,
              profile: { select: { avatar: true, name: true } },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.message.count({ where: { conversationId: id } }),
    ]);

    const messagesWithSignedAvatars = await Promise.all(
      messages.map(async (msg) => {
        if (msg.sender?.profile?.avatar) {
          const signedAvatar = await getCachedSignedUrl(
            msg.sender.profile.avatar,
            60 * 60 * 24 * 7,
          );

          return {
            ...msg,
            sender: {
              ...msg.sender,
              profile: {
                ...msg.sender.profile,
                avatar: signedAvatar,
              },
            },
          };
        }

        return msg;
      }),
    );

    return NextResponse.json({
      messages: messagesWithSignedAvatars.reverse(),
      pagination: {
        total,
        page,
        limit,
        hasMore: skip + messages.length < total,
      },
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
