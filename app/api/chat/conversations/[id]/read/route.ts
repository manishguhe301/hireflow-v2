import { apiAuthGuard } from '@/src/lib/apiAuthGuard';
import prisma from '@/src/lib/prisma';
import { Role } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const guard = await apiAuthGuard([Role.COMPANY_ADMIN, Role.JOB_SEEKER]);
    if (!guard.ok) return guard.response;

    const { id } = await params;

    const isCompany = guard.session.user.role === Role.COMPANY_ADMIN;

    await prisma.message.updateMany({
      where: {
        conversationId: id,
        isRead: false,
        senderType: isCompany ? 'JOB_SEEKER' : 'COMPANY',
      },
      data: { isRead: true },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error marking messages as read:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
