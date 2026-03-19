import { apiAuthGuard } from '@/src/lib/apiAuthGuard';
import { getSignedUrl } from '@/src/lib/fileUpload';
import prisma from '@/src/lib/prisma';
import { Role } from '@prisma/client';
import { NextResponse } from 'next/server';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const guard = await apiAuthGuard([Role.PLATFORM_ADMIN, Role.COMPANY_ADMIN]);
  if (!guard.ok) return guard.response;

  const { id } = await params;
  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type');

  const isAdmin = guard.session.user.role === Role.PLATFORM_ADMIN;

  const company = await prisma.company.findUnique({
    where: { id },
    select: {
      userId: true,
      businessDocPath: true,
      taxDocPath: true,
    },
  });

  if (!company) {
    return NextResponse.json({ error: 'Company not found' }, { status: 404 });
  }

  if (!isAdmin && company.userId !== guard.session.user.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  let filePath: string | null = null;

  if (type === 'business') {
    filePath = company.businessDocPath;
  }

  if (type === 'tax') {
    filePath = company.taxDocPath;
  }

  if (!filePath) {
    return NextResponse.json({ error: 'Document not found' }, { status: 404 });
  }

  const signedUrl = await getSignedUrl(filePath);

  return NextResponse.json({ url: signedUrl });
}
