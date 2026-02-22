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
export async function POST(req: NextRequest) {
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
export async function PATCH(req: NextRequest) {
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
