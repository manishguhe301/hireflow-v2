import { authOptions } from '@/src/lib/auth';
import { Role } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

type GuardResult =
  | { ok: true; session: Awaited<ReturnType<typeof getServerSession>> }
  | { ok: false; response: NextResponse };

export async function apiAuthGuard(
  allowedRoles: Role[] = [],
): Promise<GuardResult> {
  const session = await getServerSession(authOptions);

  if (!session) {
    return {
      ok: false,
      response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }),
    };
  }

  if (
    allowedRoles.length > 0 &&
    !allowedRoles.includes(session.user.role as Role)
  ) {
    return {
      ok: false,
      response: NextResponse.json({ error: 'Forbidden' }, { status: 403 }),
    };
  }

  return { ok: true, session };
}
