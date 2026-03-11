import { apiAuthGuard } from '@/src/lib/apiAuthGuard';
import prisma from '@/src/lib/prisma';
import { Role } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const guard = await apiAuthGuard([Role.PLATFORM_ADMIN]);
    if (!guard.ok) {
      return guard.response;
    }

    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return NextResponse.json(
        {
          error: 'User not found',
        },
        { status: 404 },
      );
    }

    if (user.role === Role.PLATFORM_ADMIN) {
      return NextResponse.json(
        { error: 'Platform admins cannot be deleted' },
        { status: 403 },
      );
    }

    if (user.id === guard.session.user.id) {
      return NextResponse.json(
        { error: 'You cannot delete your own account' },
        { status: 400 },
      );
    }

    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 },
    );
  }
}
