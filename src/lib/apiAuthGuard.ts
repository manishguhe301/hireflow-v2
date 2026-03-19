import { authOptions } from '@/src/lib/auth';
import { Role } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { AppSession } from '@/src/types/session';
import prisma from './prisma';

type GuardResult =
  | { ok: true; session: AppSession }
  | { ok: false; response: NextResponse };

export async function apiAuthGuard(
  allowedRoles: Role[] = [],
): Promise<GuardResult> {
  const session = (await getServerSession(authOptions)) as AppSession | null;

  if (!session) {
    return {
      ok: false,
      response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }),
    };
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, role: true },
  });

  if (!user) {
    return {
      ok: false,
      response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }),
    };
  }

  if (user.role !== session.user.role) {
    return {
      ok: false,
      response: NextResponse.json({ error: 'Forbidden' }, { status: 403 }),
    };
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return {
      ok: false,
      response: NextResponse.json({ error: 'Forbidden' }, { status: 403 }),
    };
  }

  return { ok: true, session };
}
