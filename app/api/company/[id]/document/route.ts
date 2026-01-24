import { apiAuthGuard } from '@/src/lib/apiAuthGuard';
import { getSignedUrl } from '@/src/lib/fileUpload';
import prisma from '@/src/lib/prisma';
import { Role } from '@prisma/client';
import { NextResponse } from 'next/server';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const guard = await apiAuthGuard([Role.PLATFORM_ADMIN]);
  if (!guard.ok) return guard.response;

  const { id } = await params;

  const company = await prisma.company.findUnique({
    where: { id: id },
  });

  if (!company?.businessDocPath) {
    return NextResponse.json({ error: 'Document not found' }, { status: 404 });
  }

  const signedUrl = await getSignedUrl(
    company.businessDocPath,
    'company-documents',
  );

  return NextResponse.json({ url: signedUrl });
}
