import { apiAuthGuard } from '@/src/lib/apiAuthGuard';
import { authOptions } from '@/src/lib/auth';
import { deleteFileFromB2 } from '@/src/lib/fileUpload';
import { notifyUser } from '@/src/lib/notificationService';
import prisma from '@/src/lib/prisma';
import { CompanyStatus, Role } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const guard = await apiAuthGuard([Role.PLATFORM_ADMIN]);
    if (!guard.ok) {
      return guard.response;
    }

    const company = await prisma.company.findUnique({
      where: { id: id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
          },
        },
      },
    });

    if (!company) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 });
    }

    // const signedLogo = await getSignedUrl(company?.logo as string, 604800);

    // return NextResponse.json({ company: { ...company, logo: signedLogo } });
    return NextResponse.json({ company });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== Role.PLATFORM_ADMIN) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { status, rejectionReason } = body;

    const company = await prisma.company.findUnique({
      where: {
        id,
      },
    });

    if (!company) {
      return NextResponse.json(
        {
          error: 'Company not found',
        },
        { status: 404 },
      );
    }

    if (
      !status ||
      ![CompanyStatus.APPROVED, CompanyStatus.REJECTED].includes(status)
    ) {
      return NextResponse.json(
        {
          error: 'Invalid status',
        },
        { status: 404 },
      );
    }

    if (status === CompanyStatus.REJECTED && !rejectionReason) {
      return NextResponse.json(
        {
          error: 'Rejection reason is required',
        },
        { status: 404 },
      );
    }

    const updatedCompany = await prisma.company.update({
      where: {
        id,
      },
      data: {
        status,
        rejectionReason:
          status === CompanyStatus.REJECTED ? rejectionReason : null,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    await notifyUser({
      title: 'Company Profile Status Updated',
      message: `Your company profile status has been ${status === CompanyStatus.APPROVED ? 'approved' : 'rejected'} by the admin. please refresh the page for see the changes.`,
      type: status === 'APPROVED' ? 'COMPANY_APPROVED' : 'COMPANY_REJECTED',
      userId: updatedCompany.user.id,
      link: status === 'REJECTED' ? '/company/profile-setup' : null,
      metadata: {
        companyId: updatedCompany.id,
        companyName: updatedCompany.name,
      },
    });

    return NextResponse.json({
      success: true,
      company: updatedCompany,
      message:
        status === 'APPROVED'
          ? 'Company approved successfully'
          : 'Company rejected',
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== Role.PLATFORM_ADMIN) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const company = await prisma.company.findUnique({
      where: { id },
    });

    if (!company) {
      return NextResponse.json(
        {
          error: 'Company not found',
        },
        { status: 404 },
      );
    }

    if (company.logoPath) {
      await deleteFileFromB2(company.logoPath);
    }

    if (company.businessDocPath) {
      await deleteFileFromB2(company.businessDocPath);
    }

    if (company.taxDocPath) {
      await deleteFileFromB2(company.taxDocPath);
    }

    await prisma.company.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Company deleted successfully',
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 },
    );
  }
}
