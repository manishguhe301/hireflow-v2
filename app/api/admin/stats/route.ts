import { authOptions } from '@/src/lib/auth';
import prisma from '@/src/lib/prisma';
import { CompanyStatus, Role } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== Role.PLATFORM_ADMIN) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const totalCompanies = await prisma.company.count();
    const totalUsers = await prisma.user.count();
    const totalPendingCompanies = await prisma.company.count({
      where: {
        status: CompanyStatus.PENDING,
      },
    });
    const totalRejectedCompanies = await prisma.company.count({
      where: {
        status: CompanyStatus.REJECTED,
      },
    });
    const totalApprovedCompanies = await prisma.company.count({
      where: {
        status: CompanyStatus.APPROVED,
      },
    });
    const totalJobSeekers = await prisma.user.count({
      where: {
        role: Role.JOB_SEEKER,
      },
    });
    const totalPlatformAdminsCount = await prisma.user.count({
      where: {
        role: Role.PLATFORM_ADMIN,
      },
    });

    return NextResponse.json({
      companies: {
        total: totalCompanies,
        pending: totalPendingCompanies,
        rejected: totalRejectedCompanies,
        approved: totalApprovedCompanies,
      },
      users: {
        total: totalUsers,
        jobSeekers: totalJobSeekers,
        admins: totalPlatformAdminsCount,
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 },
    );
  }
}
