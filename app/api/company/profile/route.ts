import { apiAuthGuard } from '@/src/lib/apiAuthGuard';
import prisma from '@/src/lib/prisma';
import { Role } from '@prisma/client';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const guard = await apiAuthGuard([Role.COMPANY_ADMIN]);
    if (!guard.ok) {
      return guard.response;
    }

    const company = await prisma.company.findUnique({
      where: {
        userId: guard.session.user.id,
      },
    });

    const requiredFields = [
      'name',
      'description',
      'industry',
      'companySize',
      'location',
      'contactEmail',
      'website',
      'businessDocument',
    ];

    const filledFields = company
      ? requiredFields.filter((field) => company[field as keyof typeof company])
      : [];

    const completionPercentage = company
      ? Math.round((filledFields.length / requiredFields.length) * 100)
      : 0;

    return NextResponse.json({
      company: company || null,
      exists: !!company,
      isComplete: completionPercentage === 100,
      completionPercentage,
      missingFields: company
        ? requiredFields.filter((f) => !company[f as keyof typeof company])
        : requiredFields,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        error: 'Internal Server Error',
      },
      { status: 500 },
    );
  }
}
