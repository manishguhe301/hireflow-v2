import { apiAuthGuard } from '@/src/lib/apiAuthGuard';
import prisma from '@/src/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const guard = await apiAuthGuard([
      'COMPANY_ADMIN',
      'JOB_SEEKER',
      'PLATFORM_ADMIN',
    ]);

    if (!guard.ok) {
      return guard.response;
    }

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    const unreadOnly = searchParams.get('unreadOnly') === 'true';

    const notifiactions = await prisma.notification.findMany({
      where: {
        userId: guard.session.user.id,
        ...(unreadOnly && { isRead: false }),
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    });

    const unreadCount = await prisma.notification.count({
      where: {
        userId: guard.session.user.id,
        isRead: false,
      },
    });

    return NextResponse.json({
      notifiactions,
      unreadCount,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        error: 'Internal Server Error',
      },
      { status: 500 },
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const guard = await apiAuthGuard([
      'COMPANY_ADMIN',
      'JOB_SEEKER',
      'PLATFORM_ADMIN',
    ]);

    if (!guard.ok) {
      return guard.response;
    }

    const { markAllAsRead, notificationIds } = await req.json();

    if (markAllAsRead) {
      await prisma.notification.updateMany({
        where: {
          userId: guard.session.user.id,
          isRead: false,
        },
        data: { isRead: true },
      });

      return NextResponse.json({
        success: true,
        message: 'All notifications marked as read',
      });
    }

    if (!notificationIds || !Array.isArray(notificationIds)) {
      return NextResponse.json(
        { error: 'notificationIds array required' },
        { status: 400 },
      );
    }

    await prisma.notification.updateMany({
      where: {
        id: { in: notificationIds },
        userId: guard.session.user.id,
      },
      data: { isRead: true },
    });

    return NextResponse.json({
      success: true,
      message: 'Notifications marked as read',
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        error: 'Internal Server Error',
      },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        error: 'Internal Server Error',
      },
      { status: 500 },
    );
  }
}
