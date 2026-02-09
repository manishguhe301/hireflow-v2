import { apiAuthGuard } from '@/src/lib/apiAuthGuard';
import prisma from '@/src/lib/prisma';
import { Role } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const guard = await apiAuthGuard([Role.COMPANY_ADMIN]);
    if (!guard.ok) {
      return guard.response;
    }

    const companyExists = await prisma.company.findUnique({
      where: { userId: guard.session.user.id },
    });

    if (!companyExists) {
      return NextResponse.json(
        {
          error: 'Company profile not found. ',
        },
        { status: 404 },
      );
    }
    const { slug } = await params;

    if (!slug) {
      return NextResponse.json({ error: 'Slug not found' }, { status: 404 });
    }

    const existingJob = await prisma.job.findUnique({
      where: { slug },
    });

    if (!existingJob) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    if (existingJob.companyId !== companyExists.id) {
      return NextResponse.json(
        { error: 'Unauthorized: This job does not belong to your company' },
        { status: 403 },
      );
    }

    const { status } = await req.json();

    if (!status || !['ACTIVE', 'CLOSED', 'DRAFT'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    if (status === 'ACTIVE' && existingJob.status === 'DRAFT') {
      if (
        !existingJob.title ||
        !existingJob.description ||
        !existingJob.requirements ||
        !existingJob.skills?.length ||
        !existingJob.category
      ) {
        return NextResponse.json(
          {
            error:
              'Cannot publish incomplete draft. Please fill all required fields.',
          },
          { status: 400 },
        );
      }
    }

    const updatedJob = await prisma.job.update({
      where: { id: existingJob.id },
      data: { status: status },
    });

    return NextResponse.json({
      success: true,
      job: updatedJob,
      message: `Job ${status === 'ACTIVE' ? 'activated' : status === 'CLOSED' ? 'closed' : 'updated'} successfully`,
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
